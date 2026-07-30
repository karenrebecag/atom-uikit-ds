# Conformance suite — el contrato ejecutable del DS

Las reglas del sistema (leyes de escala, capas, scoping, structure-only, budgets) vivían
como prosa en CLAUDE.md: un agente podía ignorarlas sin que nada fallara. Este directorio
las convierte en **datos** que `scripts/conformance.mjs` ejecuta — el patrón de
conformance suites de Simon Willison: el contrato es el archivo, no el párrafo.

```bash
pnpm conformance            # todo el contrato
pnpm conformance tokens     # una sección: tokens | css | layouts | registry | budgets
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
