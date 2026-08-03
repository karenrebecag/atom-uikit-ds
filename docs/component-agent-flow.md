# Flujo de agentes — crear y editar componentes

Procedimiento para que CUALQUIER agente (incluidos modelos ligeros) produzca
componentes correctos sobre este pipeline. El diseño es deliberado: **el agente
no necesita criterio, necesita seguir pasos** — la calidad la imponen los gates,
no el modelo. Complementa `docs/AGENTS.md` (Rol B) y `CLAUDE.md`.

## Regla de oro

El pipeline es el auditor. Si un gate sale rojo, **se corrige el cambio, jamás
el gate**. Prohibido tocar `conformance/*.json`, bajar thresholds, borrar tests
o marcar excepciones para que tu propio cambio pase. Si crees que el gate está
mal, se reporta a Karen con evidencia — no se decide solo.

## Paso 0 — Identificar el modo

| El pedido dice… | Modo |
|---|---|
| "agrega gotchas / rangos / usage / editorial a X" | **A — Enriquecer contenido** |
| "cambia el estilo / comportamiento / props de X" | **B — Editar componente** |
| "crea el componente X" | **C — Crear componente** |

Antes de cualquier modo, punto de partida obligatorio:

```bash
pnpm conformance        # debe salir "contrato completo en verde"
```

Si arranca rojo, DETENTE y repórtalo: el rojo no es tuyo, pero tampoco avances
sobre él.

---

## Modo A — Enriquecer contenido (meta.agent / editorial)

Solo tocas DOS lugares. Nada más.

### A1. `meta.agent` — vive en `registry.json` (fuente), dentro del item

```jsonc
"meta": {
  "agent": {
    "configurables": [
      {
        "prop": "speed",            // DEBE existir en el .tsx — conformance lo verifica
        "type": "number",           // number ⇒ min/max/step/unit obligatorios
        "default": 75,              // DEBE coincidir con el default real del source
        "min": 20, "max": 200, "step": 5, "unit": "px/s",
        "what": "Velocidad de desplazamiento.",
        "how": "75 para logo bars; 40–60 texto denso; 100–150 hero strips."
      }
    ],
    "gotchas": [ { "context": "react|a11y|webflow|css", "note": "…" } ],
    "usage": "<Marquee speed={75}>…</Marquee>"
  }
}
```

Reglas de redacción (el gate de review las aplica, tú las cumples):

- `how` SIEMPRE prescriptivo con valores y contexto ("0.2–0.4 para FAQs
  densas"). PROHIBIDO: "elige el valor apropiado", "según necesites".
- Gotchas solo REALES, derivados de leer el source. Cero relleno.
- Antes de escribir, LEE el `.tsx` y el `.css` del componente. No inventes
  props: conformance F4 rechaza cualquier prop o default que no exista.

### A2. Editorial — un archivo `docs/editorial/{slug}.md`

Plantilla obligatoria (copia la estructura de `docs/editorial/button.md`):

```markdown
<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos
(1-2 bloques tsx con los imports y subcomponentes REALES)

## Accesibilidad
(solo lo específico del componente, no generalidades WCAG)

## Cuándo no usar
(cada bullet nombra la alternativa concreta: "→ usa Skeleton")
```

PROHIBIDO en editorial: tablas de hex, tokens o valores derivables — eso lo
emite `meta.derived` automáticamente.

### A3. Validar y entregar

```bash
pnpm build:registry                              # regenera public/r + tablero
node scripts/content-coverage.mjs --check-no-regression   # "F16d no-regression: OK"
pnpm conformance                                 # verde
```

**GATE DURO**: los rangos (`min`/`max`/`how` de motion y espaciado) son decisión
de marca. Presenta la tabla `slug → prop → rango → how` a Karen y espera su
firma ANTES de commitear. Commit: `feat(registry): meta.agent <slugs>` o
`feat(docs): editorial <slugs>`.

---

## Modo B — Editar un componente existente

1. **Lee los 3 archivos** del componente ANTES de editar:
   - `packages/components-react/src/{atoms|molecules}/X.tsx`
   - `packages/css/src/components/{categoria}/x.css`
   - `apps/storybook/src/stories/X.stories.tsx`
2. **Valores visuales**: SOLO variables semánticas (`var(--primary)`,
   `var(--spacing-4)`, `var(--duration-150) var(--easing-out)`). Un hex, px
   crudo o ms literal en CSS de componente = conformance rojo. Si el diseño
   pide un valor que ningún token cubre, el cambio correcto es un token nuevo
   en `packages/tokens/src/` — repórtalo, no lo hardcodees.
3. **Nunca edites** `public/r/`, `dist/`, `build/` — son generados.
4. Si cambiaste props/defaults: actualiza el `meta.agent` del item en
   `registry.json` en el MISMO cambio (conformance cruza ambos).
5. Escalera completa (abajo) antes de entregar.

---

## Modo C — Crear un componente nuevo

Un componente son **6 piezas**. Cópialas de un análogo existente — no partas de
cero. Análogos canónicos: `chip` (simple), `toggle-group` (con variants/estado
local), `marquee` (con motion).

| # | Pieza | Dónde | Copia de |
|---|---|---|---|
| 1 | React | `packages/components-react/src/atoms/X.tsx` (o `molecules/`) | análogo — mantén `forwardRef`, `export type XProps`, clases `.x`, `.x--variant` |
| 2 | CSS | `packages/css/src/components/{cat}/x.css` + import en el entry de la categoría | análogo — solo `var(--semantic-*)` |
| 3 | Item de registry | `registry.json` (name, kind component, files con sourcePath/outputPath, registryDependencies) | el item del análogo, literal |
| 4 | Story | `apps/storybook/src/stories/X.stories.tsx` | análogo — usa `StoryPreviewLayout` + controles DS (patrón de CLAUDE.md) |
| 5 | `meta.agent` | dentro del item en `registry.json` | Modo A1 |
| 6 | Editorial | `docs/editorial/x.md` | Modo A2 |

Notas que evitan los errores ya vividos:

- Si el componente vive en un **subdirectorio** de molecules, agrega el glob al
  `entry` de `packages/components-react/tsup.config.ts` (lección: sidebar no
  compilaba a dist y el canal Webflow lo excluía).
- Si sus props obligatorias son arrays/objetos (steps, items), agrega
  `meta.webflow.previewProps` con datos de ejemplo — sin eso el render SSR del
  canal Webflow truena (lección: stepper/progress-nav/user-profile).
- Si el componente es runtime-only o app-chrome (portal, provider, paneles),
  decláralo fuera del canal: `meta.webflow.exclude: "razón"` — decisión
  visible, no error de render.
- Motion: el behavior va en `packages/animations/src/` exportando
  `init*(): CleanupFn` + `REQUIRED_HOOKS`, consumiendo tokens de motion. El
  componente solo emite atributos `data-*`. Nada de GSAP inline en el .tsx.

---

## La escalera de verificación (correr SIEMPRE, en este orden)

```bash
pnpm build                                       # 1. compila todos los paquetes
pnpm validate && pnpm validate:contrast          # 2. tokens + WCAG AA
pnpm build:registry                              # 3. regenera public/r + canales + tablero
pnpm conformance                                 # 4. "contrato completo en verde"
pnpm test                                        # 5. unit tests
node scripts/content-coverage.mjs --check-no-regression  # 6. "F16d no-regression: OK"
```

Salida esperada de cada paso en el comentario. Cualquier rojo: corrige y repite
desde el paso que falló. El tablero del paso 3 debe mostrar tu slug nuevo con
`metaAgent: full` y `editorial: true` — si aparece en `batches`, te faltó
contenido (Modo A).

Verificación del canal Webflow (automática, solo confirma):

```bash
python3 -c "import json; d=json.load(open('public/r/webflow/index.json')); \
print('X' in d['pilots'] or [e for e in d['excluded'] if e['name']=='X'])"
```

Tu slug debe estar en `pilots` O en `excluded` con razón `declared:` — si la
razón es `render error` / `generate failed`, es un bug tuyo (previewProps,
dist, CSS faltante): arréglalo antes de entregar.

---

## Qué NUNCA hacer (destilado de las reglas duras)

1. Editar `public/r/`, `dist/`, `build/`, `public-dist/out/` a mano.
2. Hex/px/ms hardcodeados en CSS de componente; primitives en vez de semantics.
3. Tocar `conformance/*.json`, baselines o tests para que tu cambio pase.
4. Inventar props, defaults o clases que no salen del source real.
5. `npm install`/`publish` — npm no es canal (ADR 002). Deps nuevas = decisión de Karen.
6. Commitear sin la firma de Karen cuando el cambio incluye rangos/contenido de marca.
7. `git push` sin aprobación explícita en la sesión.
8. Editoriales con tablas de tokens/hex (derivable = `meta.derived`).

## Síntoma → acción

| Rojo | Acción |
|---|---|
| `conformance: huérfanos en public/r` | corriste build a medias — `pnpm build:registry` completo |
| `conformance: css fuera de contrato` | hardcodeaste un valor — cámbialo a token |
| `agent-meta-conformance: prop X` | tu configurable no existe o el default no coincide — relee el .tsx |
| `webflow excluded: render error …map` | falta `meta.webflow.previewProps` con las props obligatorias |
| `webflow excluded: missing dist` | el .tsx no está en el entry de tsup — agrega el glob |
| `F16d FAIL: aggregateScore dropped` | borraste contenido — restáuralo o declara la exclusión |
| `check-contrast` | par de color nuevo sin registrar — agrégalo a `scripts/check-contrast.mjs` |
| `test:visual` | cambio visual intencional ⇒ `pnpm test:visual:update` + commitea PNGs; no intencional ⇒ tu CSS rompió algo |

## Definition of done

- [ ] Escalera completa en verde (6 comandos)
- [ ] Slug con `metaAgent: full` + `editorial: true` en el tablero
- [ ] Canal Webflow: emitido o excluido con `declared:`
- [ ] Story visible en Storybook local
- [ ] Tabla de rangos firmada por Karen (si aplica)
- [ ] Commit `feat(x): …` — un cambio lógico por commit, mensaje = POR QUÉ
