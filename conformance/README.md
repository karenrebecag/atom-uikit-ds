# Conformance suite — el contrato ejecutable del DS

Las reglas del sistema (leyes de escala, capas, scoping, structure-only, budgets) vivían
como prosa en CLAUDE.md: un agente podía ignorarlas sin que nada fallara. Este directorio
las convierte en **datos** que `scripts/conformance.mjs` ejecuta — el patrón de
conformance suites de Simon Willison: el contrato es el archivo, no el párrafo.

```bash
pnpm conformance            # todo el contrato
pnpm conformance tokens     # una sección: tokens | css | layouts | registry | budgets | references
```

## Diseño

1. **El contrato es data, el runner es tonto.** Cambiar una ley = editar un JSON de aquí
   (revisable en diff), no tocar código. Un agente que necesita relajar una regla tiene
   que tocar ESTE directorio explícitamente — eso es visible en el review; un hardcode
   enterrado en un CSS no lo es.

2. **Ratchet, no big-bang.** `css-contract.json` registra la deuda existente por archivo
   (baseline). Si un archivo empeora → falla. Si mejora → aviso para bajar el baseline.
   Así el suite pasa HOY sin fingir que el pasado es perfecto, y congela la entrada de
   deuda nueva.

3. **Agnóstico de marca a propósito.** Las reglas verifican ESTRUCTURA (que la tipografía
   siga una razón armónica, que los layouts no pinten, que todo cuelgue de tokens), y los
   VALORES (razón 1.25, base 16, ramp de spacing) viven en `token-contract.json`. Replicar
   este sistema bajo otra identidad de marca = re-escribir tokens + este archivo de datos;
   el runner y las leyes estructurales no cambian.

## Archivos

| Archivo | Contrato |
|---|---|
| `token-contract.json` | leyes de escala: tercera mayor exacta (tipografía y rhythm), retícula base-4 (spacing) |
| `css-contract.json` | CSS de componentes: sin literales de color, sin `!important`, font-family vía var, y **sin motion inventado** — `cubic-bezier()`/`linear()`/duraciones literales NUEVOS fallan (las curvas firmadas existentes viven en baseline hasta su tokenización W6). Baseline ratchet de deuda existente |
| `layout-contract.json` | layouts structure-only: sin literales de color ni font-family; toda clase del html existe en el DS; slots bien formados; `components[]` ⊆ `registryDependencies`; display sobre componentes solo `none` o el display propio del átomo (mapa `componentDisplay`) |
| `reference-contract.json` | **integridad referencial**: que las referencias que SALEN de un archivo aterricen. `var()` sin fallback resuelve contra tokens o CSS local; toda clase de componente tiene emisor o está publicada en `cssClasses`; el `entry` de tsup cubre cada subdirectorio con fuentes; todo `sourcePath` del registry existe; y los baselines, exenciones y mapas slug→módulo apuntan a archivos vivos. Baseline ratchet de la deuda existente |
| `budgets.json` | performance: peso raw/gzip de los artefactos `/v1` y de las fuentes. Subir un budget es un cambio consciente de ESTE archivo |
| `../public-dist/channel.json` | **pipeline de distribución**: qué artefactos publica `/v1` y de qué paquete sale cada uno. Lo verifica `scripts/check-distribution.mjs` (sección `distribution`) |

### La sección `distribution`

Los budgets vigilan el PESO de lo que se publica; esta sección vigila que la MAQUINARIA
que lo publica sea coherente. Todo se deriva de `public-dist/channel.json`: agregar un
artefacto al canal es editar ese archivo, y el gate dice qué falta ajustar en el resto.

Cada check existe porque el fallo que previene ya ocurrió (todos el 2026-07-30, en una
sola sesión):

| Check | Fallo real que previene |
|---|---|
| Quien consume build-output ajeno lo declara `workspace:*` | `public-dist` no declaraba NINGUNA dep pese a consumir tokens y css (regla 9 de CLAUDE.md) |
| El lockfile conoce esas deps | declarar una dep sin `pnpm install --lockfile-only` revienta el CI, que instala con `--frozen-lockfile` |
| `vercel.json` buildCommand compila cada paquete origen | el deploy moría en el `requireFile` del artefacto nuevo |
| El workflow compila cada paquete origen | idem |
| El workflow se dispara con las rutas de cada paquete origen + `pnpm-lock.yaml` | el commit que arreglaba el lockfile no disparó deploy y el canal quedó sin publicar |
| Los artefactos declarados llegan a `out/v1` | `/v1` sirvió solo CSS durante meses; nadie lo notó hasta que Webflow necesitó el JS |

**Prueba de aceptación:** un gate que no falla con un bug conocido no es un gate. Al
escribirlo se revirtió cada uno de esos seis fixes por separado y el gate los cazó 7/7
(el séptimo es el artefacto ausente del canal ensamblado).

### La sección `references`

Las otras reglas verifican FORMA dentro del archivo: sin hex, sin `!important`, sin
`cubic-bezier()` nuevo. Ninguna verificaba que las referencias que SALEN del archivo
aterricen en algo que existe, y por eso el contrato podía cerrar en verde con 32 defectos
publicados (auditoría 2026-08-17).

| Check | Fallo real que previene |
|---|---|
| `var()` sin fallback resuelve | `video-player.css` usa 6 custom properties que nunca se crearon: el `backdrop-filter`, el accent y la barra de progreso no pintan nada, en `atom.css` Y en `embed.css` |
| idem | `tag.css` usaba `var(--color-sky)` y el ramp real es `--color-sky-500`/`-700`: `.tag--info` en ghost y outlined salía sin color, y `color-mix()` con un valor inválido tira la declaración completa |
| Toda clase tiene emisor o está declarada | 25 clases en 7 archivos que ningún componente, layout, behavior o pilot emite y que el registry no publica en `atom.implementation.cssClasses` |
| El `entry` de tsup cubre cada subdirectorio | `sidebar` no compilaba a `dist` y el canal Webflow lo excluía en silencio |
| Todo `sourcePath` del registry existe | borrar un componente y olvidar su item deja el `files[]` colgando: `build:registry` sale 1, pero solo si alguien lo corre — así cae en el PR |
| Baselines, exenciones y mapas apuntan a archivos vivos | donde más se pudre un borrado. Simulacro del 2026-08-17: quitar 5 fuentes de `video-player` dejaba la suite EN VERDE; con estas dos reglas salen 6 violaciones que nombran exactamente qué falta limpiar (`Modo E` de `docs/component-agent-flow.md`) |

Tres reglas de precisión, todas por un falso positivo real de la sonda que lo midió:

1. **Un `var()` con fallback no se verifica.** `var(--x, 0px)` es contrato explícito con el
   consumidor, no un bug. `var(--a, var(--b))` sí verifica `--b`: si ninguna de las dos
   existe, la declaración muere igual.
2. **`runtimeProvided` con razón obligatoria.** `--char` la setea GSAP SplitText con
   `propIndex: true`; sin la allowlist el gate marcaría los 8 usos legítimos del stagger
   por carácter.
3. **El separador que importa es el ÚLTIMO.** `stats-card__trend--${trend}` emite
   `stats-card__trend--up` sin que el literal aparezca nunca. Cortar el prefijo en el
   primer separador produce 13 falsos positivos.

**Prueba de aceptación:** el gate se corrió quitando cada red por separado y falló las 5
veces — sin la allowlist de `--char`, sin el baseline del player, sin los baselines de
clases, tratando los fallbacks como bug, y con deuda nueva junto a deuda declarada.

#### El hallazgo no adivina intención: la exige

Una clase sin emisor puede ser pintura muerta **o** API del consumidor sin anunciar, y
nada en el código las distingue. De las 25 que encontró el gate, **11 estaban documentadas
en un comentario de su propio archivo** — entre ellas las del botón de WhatsApp, cuya
cabecera trae el markup exacto que un landing escribe a mano. Leerlas como código muerto
habría borrado API real (pasó: el primer `why` de ese baseline decía "el fix real es
borrar").

Por eso el baseline no admite prosa libre. Cada entrada elige un remedio de una lista
cerrada, y el gate lo verifica:

| `resolution` | Qué declara | Cómo lo verifica el gate |
|---|---|---|
| `publish` | es API del consumidor | exige que las clases estén en `cssClasses`; si no, falla |
| `wire` | falta el emisor | el componente o el behavior debe escribirla |
| `delete` | no la quiere nadie | se borra el CSS |
| `triage` | nadie lo ha decidido | exige `until`: una decisión sin fecha no se toma |

Un baseline sin `resolution` **falla**, y el hallazgo dice "sin declarar", nunca "muerta".
Cuando la clase aparece documentada en su archivo, el mensaje lo dice y sugiere `publish`
— el humano confirma, no adivina.

**Lo que este gate NO hace:** puntuar. No existe un score que mezcle defectos con ausencias.
Que un átomo no tenga dependientes, test o story no es un hallazgo de nada: si no es un
defecto verificable, no se emite. Un positivo que hay que aprender a ignorar destruye el
valor de todos los demás.

## Contrato con los agentes

- **Antes de empezar** una sesión de estilo: `pnpm conformance` (debe estar verde — es tu
  punto de partida, patrón "first run the tests").
- **Criterio de éxito de cualquier cambio visual**: `pnpm conformance && pnpm build &&
  pnpm validate:contrast && pnpm test:visual` verdes.
- **Nunca** añadir una excepción o subir un budget/baseline para hacer pasar tu propio
  cambio sin decírselo explícitamente a Karen en el resumen.

## Qué NO cubre (y quién lo cubre)

- Capas de tokens DTCG → `pnpm validate` (validate-tokens.js, pre-build)
- Contraste WCAG → `pnpm validate:contrast`
- Scoping del embed → `pnpm validate:embed` + `pnpm test:embed-leak`
- Regresión de pintura → `pnpm test:visual` (baselines por plataforma)
- Registry vs manifest MCP → `scripts/validate-registry-vs-manifest.ts`

Conformance no reemplaza esos gates: cierra los huecos que eran prosa.
