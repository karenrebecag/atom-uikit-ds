# ATOM UIKit Design System

Monorepo for the ATOM UIKit component library. Distributes via private registry (shadcn model) — source copied to consumer projects, not installed as npm dependencies. Documented at `uikit.atomchat.io`.

**Operación (release, deploy /v1, Webflow, registry, accesos):** seguir
[`docs/RUNBOOK.md`](docs/RUNBOOK.md). Decisiones vigentes: [`docs/decisions/`](docs/decisions/).
**Guía para agentes (consumir el DS o modificarlo):** [`docs/AGENTS.md`](docs/AGENTS.md).
**Crear/editar componentes (procedimiento paso a paso, apto para agentes ligeros):**
[`docs/component-agent-flow.md`](docs/component-agent-flow.md).
**Publicar un organismo (card, hero, tabla…) de forma replicable:**
[`docs/organism-pipeline.md`](docs/organism-pipeline.md) — proceso canónico y prueba de
aceptación. Un organismo sin layout publicado NO está distribuido.
**Mapa del modelo de distribución (flujo de datos + comparación con estándares):**
[`docs/distribution-model.md`](docs/distribution-model.md).

## Scope

Web development components for landing pages, web apps, and marketing sites. Este es EL ÚNICO design system de Atom (ADR 007): el antiguo `ATOM_DS` (`@atomchat.io/*`, pre-OSMO) está deprecado y archivado en GitHub como referencia histórica.

## Lenguaje visual y flujo end-to-end (LEER ANTES DE CUALQUIER CAMBIO DE ESTILO)

El lenguaje visual oficial web es **OSMO/academy** (aprobado por marketing 2026-07-28):
neutral ramp de 13 pasos (con 150/850), acentos `green-electric`/`forest`/`coral`/`sky`,
brand `#ff6600`, tipografías Inter Tight (sans), Grift (display), Interval (mono),
Gantol (scribble), ease firma `cubic-bezier(0.625, 0.05, 0, 1)`.

Flujo canónico — TODO cambio visual entra por aquí, sin excepciones:

```
packages/tokens/src/*.json          ← EDITAR AQUÍ (única fuente de verdad)
  → pnpm --filter @atom-uikit/tokens build
  → packages/css (consume vars semánticas)
  → Storybook local (QA visual, pre-merge)
  → merge → canales de distribución (abajo)
```

### Contrato de conformance (agentes: OBLIGATORIO)

Las reglas de abajo son prosa; el contrato ejecutable vive en `conformance/*.json`
(ver `conformance/README.md`). Protocolo para CUALQUIER cambio visual/estructural:

1. **Antes de tocar nada**: `pnpm conformance` — debe estar verde. Es tu punto de partida.
2. **Criterio de éxito** de tu cambio: `pnpm conformance && pnpm build && pnpm validate &&
   pnpm validate:contrast && pnpm test:visual` verdes. Si tocaste embed: `pnpm validate:embed`
   y `pnpm test:embed-leak`.
3. **Nunca** edites `conformance/*.json` (excepciones, baselines, budgets, legacy) para que
   pase tu propio cambio sin declararlo explícitamente en tu resumen a Karen. El contrato
   se cambia a la vista, no por conveniencia.
4. Un "stylish" bien hecho = editar tokens (nivel 0) y dejar todo el contrato verde. Si para
   estilizar necesitas hardcodear en CSS, el diseño te está pidiendo un token nuevo.

Reglas duras para agentes de styling/flow/motion:

1. **Nunca editar outputs**: `packages/tokens/build/`, `packages/css/dist/`,
   `public/r/`, `public-dist/out/` son generados. Se regeneran, no se editan.
2. **Capas estrictas**: component tokens → semantic → primitives. CSS de componentes
   consume SOLO variables semánticas (`--primary`, `--muted`), jamás primitives ni hex.
3. **Nuevo color de texto = nuevo par en `scripts/check-contrast.mjs`**. El gate WCAG AA
   corre en CI; texto sobre superficie debe pasar 4.5:1 en light Y dark. Precedente:
   `link` (sky.700 light / sky.500 dark) existe porque sky.500 sobre claro da 1.73:1.
4. **brand/destructive llevan foreground oscuro** (neutral-950) por WCAG — blanco sobre
   `#ff6600` da 2.9:1. No "corregirlo" a blanco.
5. **Motion (W6, diferida)**: los TOKENS de motion ya existen (`easing-osmo`,
   `duration-1200/1800`); los COMPORTAMIENTOS van en `packages/animations` como módulos
   `init*(): CleanupFn` que consumen esos tokens — cero cubic-bezier/ms hardcodeados en
   GSAP (referencia: `menu-button.ts` con `readMotionTokens`; los demás módulos tienen
   literales pre-regla protegidos por el ratchet de conformance hasta W6 — NO mapearlos
   a tokens sin spec: 0.8s ≠ duration-700 y `expo.out` de GSAP ≠ `easing-out`, sería
   cambiar el motion de Karen). Siempre `prefers-reduced-motion` + `data-motion-exempt`
   en módulos DECORATIVOS; los funcionales (progress-nav, video-player) documentan por
   qué no llevan guarda. **Layouts NO animan** (decisión Karen 2026-07-30): el motion
   vive en componentes inner o en behaviors — gate en conformance/layout-contract.json.
   Licencia: GSAP y TODOS sus plugins (incl. SplitText, Observer, ScrollTrigger,
   CustomEase) son gratuitos desde GSAP 3.13 (adquisición por Webflow) — sin bloqueo de
   licencia para la capa de text-swap. No iniciar W6 sin spec aprobado
   (ver ~/Desktop/atom-web-ds-specs/waves/wave-6-motion-DEFERRED.md).
6. **Webflow**: las Variables NO tienen REST Data API. El sync es
   `node scripts/sync-webflow.mjs --plan` + sesión con el MCP oficial de Webflow
   (protocolo en `docs/webflow-playbook.md`). No escribir clientes REST para variables.
7. **Fuentes**: las 4 familias tienen licencia comercial Envato. No agregar familias
   nuevas sin licencia verificada; woff2 viven en `packages/css/src/fonts/`.
8. **Un componente CSS-only publica pintura, no plano**: su item de registry lleva el
   `.css` y nada más. La anatomía (qué etiquetas, en qué orden, con qué átomos) se
   publica como `layout/<slug>` en `packages/layouts`. Sin layout, cada consumidor
   reescribe el markup a mano y a la tercera vez ya son tres diseños. Proceso completo
   y prueba de aceptación: `docs/organism-pipeline.md`.
9. **Si un paquete consume el build-output de otro, lo declara como `workspace:*`**,
   aunque no importe su JS. Sin la declaración turbo no conoce el orden y en máquinas
   frías los builds corren en paralelo y explotan (pasó dos veces el 2026-07-28:
   storybook→tokens/css y css→tokens; el proyecto Vercel del Storybook estuvo roto
   días por esto). Importar por ruta relativa NO crea dependencia.

## Canales de distribución (privados/controlados — NO npm)

| Canal | Superficie | Auth |
|---|---|---|
| Registry shadcn `/api/r` (docs site) | MCP UIKit, CLI `atom-uikit add` | Clerk / JWT / API key |
| CSS+JSON público versionado | `https://atom-web-ds.vercel.app/v1/*` (tokens/foundation/atom.css, tokens.json, fonts) | Sin auth: son artefactos browser-facing, inherentemente públicos; el REPO y el registry siguen privados |
| Webflow Variables nativas | plan compiler + MCP de Webflow | Conexión MCP autorizada por site |

**npm está DESCONECTADO como canal** (decisión 2026-07-28: sin autorización para consumo
público). Todos los paquetes son `private: true`; `pnpm release` está bloqueado a
propósito. Changesets se sigue usando SOLO para versionado interno y CHANGELOGs.
Versiones `@atom-uikit/*` publicadas en npm en el pasado: no publicar encima; si se
requiere retirarlas (deprecate/unpublish), es decisión de Karen con acceso npm.

## Packages

| Package | Purpose |
|---------|---------|
| `packages/tokens` | W3C DTCG design tokens (3 layers) |
| `packages/css` | Pure CSS components + utilities |
| `packages/animations` | GSAP animation modules |
| `packages/components-react` | React 19 components |
| `packages/components-astro` | Astro components — CONGELADO (ADR 008): no sincronizar ni testear hasta que exista un consumidor Astro real |
| `packages/whatsapp` | [DEPRECADO 2026-07-22] Reemplazado por AtomGrowth/atom_whatsapp_buttons; congelado como referencia. El CSS del botón (`packages/css/.../whatsapp-button.css`) es GENERADO desde ese repo: `pnpm --filter @atom-uikit/css sync:whatsapp` |

## Distribution (Registry)

Components are distributed via a private shadcn-style registry, not npm.

```
registry.json (internal schema) → build:registry → public/r/*.json (shadcn-compatible)
```

| File | Purpose |
|------|---------|
| `registry.json` | Root config with all items (internal `AtomRegistryItem` schema) |
| `scripts/registry-schema.ts` | TypeScript types: `AtomRegistryItem`, `AtomField`, `AtomDiscovery`, `AtomImplementation` |
| `scripts/extract-component-metadata.ts` | Extracts `atom` field (variants, props, cssClasses, etc.) from source files |
| `scripts/build-registry.mjs` | Compiles internal → public, injects `atom` field, writes `public/r/*.json`, **publishes `public/r/tokens-nested.json`** |
| `scripts/validate-registry-vs-manifest.ts` | Validates new output against old MCP MERGED_MANIFEST (regression test) |
| `scripts/test-extract-metadata.ts` | 27 unit tests for the extractor |
| `scripts/validate-published-tokens.mjs` | Validates `public/r/tokens-nested.json` (categories, semantic palette, no unresolved refs) |
| `public/r/index.json` | Enriched catalog with `discovery` fields (for MCP warm start, ~38KB) |
| `public/r/{name}.json` | Per-item JSON with `files[].content` + `atom` field (discovery + implementation) |
| `public/r/tokens-nested.json` | **Resolved design tokens (Style Dictionary nested) — the token source of truth the MCP consumes** |

### Tokens as source of truth (`tokens-nested.json`)

`build:registry` now runs `pnpm --filter @atom-uikit/tokens build` first, then copies Style
Dictionary's `packages/tokens/build/json/tokens-nested.json` to `public/r/tokens-nested.json`
(a raw file, not a registry item, not in `index.json`). The MCP's `getTokens()` fetches it and
overlays the resolved values onto its local skeleton — so a token change in this repo propagates
to the MCP (and any generated `DESIGN.md`) without touching MCP code.

CI: `.github/workflows/validate-tokens.yml` runs `build:registry` + `validate-published-tokens.mjs`
on PRs touching `packages/tokens/**`, `registry.json`, or `scripts/**`.

### The `atom` field

Each registry item includes an `atom` field with two sections:

- **`atom.discovery`** — Exposed by MCP discovery tools (`context`, `component`). Contains: `name`, `description`, `category`, `variants`, `sizes`, `defaultVariant`, `defaultSize`, `hasAnimation`, `props[]`.
- **`atom.implementation`** — Only accessible via MCP implementation tools (`source`, `validate`, `audit`, `patch-plan`). Contains: `baseClass`, `cssClasses`, `peerDeps`, `hasCss`, `hasReact`.

This split enforces the anti-hallucination pattern: LLMs see enough to discover components but must call `atom_uikit_source` for actual implementation details.

### `cssClassPrefixes` — multi-block components

Some components define multiple BEM root blocks in a single CSS file (e.g. `.input` + `.input-group`). By default, the extractor auto-discovers root blocks that start with the component slug. For components where this isn't sufficient, declare explicit prefixes:

```json
{
  "name": "input",
  "cssClassPrefixes": ["input", "input-group"],
  ...
}
```

**When to add `cssClassPrefixes`**: only when the component's CSS defines root blocks that don't share a prefix with the slug. Currently annotated: `input`, `table`, `item`, `toast`, `sidebar`.

### Commands

```bash
pnpm build:registry    # Generate enriched public/r/*.json from registry.json
npx atom-uikit init    # Consumer: create atom-uikit.json + copy foundations
npx atom-uikit login   # Consumer: authenticate with Clerk
npx atom-uikit add button  # Consumer: copy component + deps to project
```

### Serving layer

Registry JSONs are served from `UIKitDocumentation_ATOM` at `/api/r/[name].json` with triple auth: Clerk session (browser), JWT (CLI/MCP), API key (CI).

The docs site (`atom-uikit-docs`) syncs registry files at build time via `sync-registry.ts` (no committed copies), then serves them at `/api/r/[name]`. After `build:registry`, this repo triggers a Deploy Hook to rebuild the docs site.

**Sync source — GitHub Contents API.** The docs build reads the registry directly from THIS repo's
`public/r/` on `main` via `https://api.github.com/repos/karenrebecag/atom-uikit-ds/contents/public/r`
(env `REGISTRY_SYNC_URL`), authenticated with `REGISTRY_SYNC_TOKEN` (a GitHub PAT, `contents:read`).
This replaced the old circular self-sync (docs pulling from its own previous deployment), so new
artifacts like `tokens-nested.json` propagate without a manual seed. So: **commit `public/r/` to
`main`** for it to reach production.

### Deploy Hook

`build-registry.mjs` triggers a Vercel deploy hook at the end of a successful build if `DOCS_DEPLOY_HOOK` env var is set. This ensures the docs site picks up fresh registry data without manual intervention.

```bash
# La URL del hook es cuasi-secreto (quien la tenga puede disparar builds de docs).
# NUNCA commitearla: vive en GitHub Secrets (DOCS_DEPLOY_HOOK) y en el gestor de
# secretos local de Karen. La URL que vivió aquí hasta 2026-07-28 quedó en el
# historial de git y fue ROTADA — regenerar en: Vercel > proyecto docs > Settings
# > Git > Deploy Hooks si vuelve a exponerse.
export DOCS_DEPLOY_HOOK=<url-del-hook>

# Then build:registry will trigger docs rebuild automatically
pnpm build:registry
```

### Deploy order

```
1. atom-uikit-ds   — pnpm build:registry -> public/r/*.json + tokens-nested.json; commit to main; trigger deploy hook
2. atom-uikit-docs — sync-registry.ts pulls public/r from this repo via GitHub Contents API, then builds + serves /api/r
3. uikit-atom-mcp  — fetches uikit.atomchat.io/api/r at runtime (index, components, tokens-nested.json; 5min cache)
```

`ATOM_REGISTRY_KEY` is the `/api/r` serving/API key — it must be identical across `uikit-atom-mcp`,
`atom-uikit-docs`, and `atom-uikit-cms-db`. Keep it separate from `REGISTRY_SYNC_TOKEN` (the GitHub PAT).

## Next Steps

- [x] ~~Migrate MCP to fetch from registry~~ (Wave 1+2 complete)
- [x] ~~Eliminate embed-source.ts and legacy files from MCP~~ (Wave 3A complete)
- [x] ~~Build-time sync in docs site~~ (Wave 3C complete)
- [ ] Migrate component-overrides.ts fields to registry.json (Wave 4)
- [ ] Implement CLI package (`atom-uikit`): login, init, add, list, diff
- [ ] Clerk production keys (currently test keys)

---

## Token Architecture (3 layers)

```
Primitives (raw values)
    |
Semantic (intent-based aliases)
    |
Component (scoped to UI components)
```

### Layer 1: Primitives (`packages/tokens/src/primitives/`)

Raw design values. No semantic meaning. Updated manually.

```json
{
  "color": {
    "$type": "color",
    "neutral-950": { "$value": "#0a0a0a" },
    "neutral-50": { "$value": "#fafafa" }
  }
}
```

**Rules:**
- Flat namespace, no nesting beyond one level
- Every value is a literal (no references)
- File per category: `colors.json`, `spacing.json`, `typography.json`, `radius.json`, `opacity.json`, `motion.json`, `elevation.json`

### Layer 2: Semantic (`packages/tokens/src/semantic/`)

Intent-based aliases following shadcn/ui pairing convention. Every surface token has a `-foreground` companion.

```json
{
  "primary": { "$type": "color", "$value": "{color.neutral.950}" },
  "primary-foreground": { "$type": "color", "$value": "{color.neutral.50}" }
}
```

**Surface pairs (bg + text that sits on it):**

| Token | Foreground | Usage |
|-------|-----------|-------|
| `background` | `foreground` | Default page |
| `card` | `card-foreground` | Elevated surfaces |
| `popover` | `popover-foreground` | Floating overlays |
| `primary` | `primary-foreground` | High-emphasis actions |
| `secondary` | `secondary-foreground` | Lower-emphasis actions |
| `muted` | `muted-foreground` | Subtle surfaces, disabled |
| `accent` | `accent-foreground` | Hover/focus highlights |
| `destructive` | `destructive-foreground` | Error, danger |
| `brand` | `brand-foreground` | Brand accent (#ff6600) |
| `success` | `success-foreground` | Success state |
| `warning` | `warning-foreground` | Warning state |
| `info` | `info-foreground` | Informational state |

**Utility tokens:** `border`, `input`, `ring`

**Dark mode:** Same token names with inverted values in `dark.json`. Applied via `[data-theme="dark"]` selector.

**Rules:**
- Every value is a reference to a primitive (never a literal)
- Surface token = background color. `-foreground` = text/icon color on that surface
- No interactive states here (hovered, pressed, focused) — those belong in component layer
- No product-specific tokens (inbox, notifications) — this is a generic web DS

### Layer 3: Component (`packages/tokens/src/components/`)

Scoped to a specific UI component. References semantic tokens.

```json
{
  "button": {
    "bg": {
      "primary-enabled": { "$value": "{bg.inverse-primary}" },
      "primary-hovered": { "$value": "{bg.inverse-secondary}" }
    }
  }
}
```

**Rules:**
- Every value references a semantic token (never a primitive, never a literal)
- Pattern: `{component}.{property}.{variant}-{state}`
- One file per component: `button.json`, `checkbox.json`, etc.

### Token naming

- W3C DTCG format: `{ "$value": "...", "$type": "..." }`
- kebab-case for all names
- CSS output: `--{layer}-{name}` e.g. `--button-bg-primary-enabled`

### Token update workflow

```
1. Edit JSON in src/primitives/, src/semantic/, or src/components/
2. Run `pnpm --filter @atom-uikit/tokens build`
3. Verify output in build/css/, build/js/
4. Test in Storybook
5. Commit + changeset
```

**No Figma sync.** All token updates are manual. This is intentional -- tokens are optimized for web development contexts, not mirrored from design files.

---

## Leyes de escala (constitución, decisión de Karen 2026-07-28)

| Dominio | Ley | Razón |
|---|---|---|
| Tipografía (`font-size-*`) | **Tercera mayor exacta** 16·1.25ⁿ, fluida sobre `--u` | Los tamaños se comparan perceptualmente |
| Ritmo de sección (`rhythm-*` → `section-padding-*`) | **Tercera mayor exacta** 64·1.25ⁿ, fluida sobre `--u`; responsive = bajar pasos exactos (÷1.25 por breakpoint) | La misma razón armónica gobierna texto y página |
| Composición de componente (`spacing-*`, `gap-*`) | **Retícula base-4** aritmética | Los espacios se SUMAN; deben caer en retícula |

Capa de uso obligatoria: `.section*` para ritmo (foundation/section.css) y el mapeo de
pasos tipográficos por rol. Nadie elige pasos a ojo.

## Spacing

Base-4 geometric scale (composición de componente).

| Token | px | Usage |
|-------|-----|-------|
| `spacing-0` | 0 | None |
| `spacing-1` | 4 | Hairline gaps, icon-to-text |
| `spacing-2` | 8 | Tight spacing, inline elements |
| `spacing-3` | 12 | Compact groups, form fields |
| `spacing-4` | 16 | Base unit, default gap |
| `spacing-5` | 20 | Comfortable spacing |
| `spacing-6` | 24 | Card padding, section inner |
| `spacing-8` | 32 | Card padding large, group gap |
| `spacing-10` | 40 | Section gap |
| `spacing-12` | 48 | Large section gap |
| `spacing-16` | 64 | Section padding |
| `spacing-14` | 56 | OSMO gap-xl |
| `spacing-20` | 80 | OSMO section m |
| `spacing-24` | 96 | Intermedio |
| `spacing-30` | 120 | OSMO section l |
| `spacing-32` | 128 | Intermedio |
| `spacing-40` | 160 | OSMO section xl |
| `spacing-50` | 200 | OSMO section xxl |

**Rule:** Token number x 4 = pixel value. No exceptions.

**Aliases semánticos** (`src/semantic/spacing.json`): `section-padding-{xxl..s}` =
200/160/120/80/48px (escala OSMO real, recalibrada 2026-07-28 — la original venía de la
campaña calc y era 1-2 pasos más apretada) y `gap-{xl..xs}` para ritmo de componente.
Overrides responsivos viven en `packages/css/foundation/scaling.css`, no en tokens.

**Capa de USO** (`foundation/section.css`) — no elegir pasos a ojo: hero=`.section--hero`
(xl/l asimétrico), sección estándar=`.section` (l), compacta=`.section--compact` (m),
banda densa=`.section--dense` (s).

---

## Radius

7 steps from sharp to full pill.

| Token | px | Usage |
|-------|-----|-------|
| `radius-none` | 0 | Sharp corners |
| `radius-sm` | 4 | Tags, badges |
| `radius-md` | 8 | Buttons, inputs, chips |
| `radius-lg` | 12 | Cards, dropdowns |
| `radius-xl` | 16 | Modals, large cards |
| `radius-2xl` | 24 | Hero elements, feature cards |
| `radius-full` | 9999 | Pills, circles, avatars |

---

## Opacity

8 steps. Perceptually distinct — no adjacent values that look the same.

| Token | Value | Usage |
|-------|-------|-------|
| `opacity-5` | 0.05 | Skeleton shimmer, ghost elements |
| `opacity-10` | 0.10 | Disabled backgrounds, faint tints |
| `opacity-20` | 0.20 | Hover overlays, subtle highlights |
| `opacity-30` | 0.30 | Backdrop light, soft overlays |
| `opacity-50` | 0.50 | Backdrop medium, placeholder text |
| `opacity-70` | 0.70 | Backdrop heavy, dimmed content |
| `opacity-80` | 0.80 | Modal overlay, focus backdrop |
| `opacity-90` | 0.90 | Near-opaque layers, frosted glass |

---

## Stroke

6 steps with semantic names. Covers dividers through decorative borders.

| Token | px | Usage |
|-------|-----|-------|
| `stroke-none` | 0 | No border |
| `stroke-hairline` | 1 | Dividers, subtle borders |
| `stroke-thin` | 1.5 | Input borders, cards |
| `stroke-medium` | 2 | Active states, focus rings |
| `stroke-thick` | 3 | Accent borders, emphasis |
| `stroke-heavy` | 4 | Decorative borders, nav indicators |

---

## Shadows

8 steps from invisible to dramatic. Based on Tailwind's shadow scale.

| Token | Usage |
|-------|-------|
| `shadow-none` | No shadow |
| `shadow-2xs` | Barely visible, subtle depth hint |
| `shadow-xs` | Inputs, small elements |
| `shadow-sm` | Cards, buttons on hover |
| `shadow-md` | Dropdowns, hover cards |
| `shadow-lg` | Popovers, floating panels |
| `shadow-xl` | Modals, dialogs |
| `shadow-2xl` | Full-screen overlays, hero elements |

---

## Z-index

8 layers with gaps of 10 for custom intermediate values.

| Token | Value | Usage |
|-------|-------|-------|
| `z-index-0` | 0 | Base layer |
| `z-index-10` | 10 | Sticky headers, raised elements |
| `z-index-20` | 20 | Dropdowns, select menus |
| `z-index-30` | 30 | Fixed navbars, sidebars |
| `z-index-40` | 40 | Modal backdrops, overlays |
| `z-index-50` | 50 | Modals, dialogs |
| `z-index-60` | 60 | Toasts, notifications |
| `z-index-70` | 70 | Tooltips, popovers (topmost) |

---

## Duration & Easing

### Duration

9 steps covering micro-interactions through long animations.

| Token | Value | Usage |
|-------|-------|-------|
| `duration-0` | 0ms | Instant |
| `duration-75` | 75ms | Checkbox, toggle |
| `duration-100` | 100ms | Button press, focus ring |
| `duration-150` | 150ms | Hover states, tooltips |
| `duration-200` | 200ms | Default — most UI interactions |
| `duration-300` | 300ms | Dropdowns, panels |
| `duration-500` | 500ms | Modals, page elements |
| `duration-700` | 700ms | Entrance animations, stagger |
| `duration-1000` | 1000ms | Skeleton shimmer, loaders |

### Easing (sistema OSMO)

| Token | Value | Usage |
|-------|-------|-------|
| `easing-linear` | `linear` | Progress bars |
| `easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting view |
| `easing-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | OSMO expo-out — elements entering view |
| `easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Neutral transitions |
| `easing-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy, playful interactions |
| `easing-osmo` | `cubic-bezier(0.625, 0.05, 0, 1)` | Ease firma — motion de marca (W6) |

Duraciones largas para motion: `duration-1200`, `duration-1800` (reservadas W6).

---

## Typography & Scaling

### Type Scale (OSMO, en rem — pendiente calibración F3 en Storybook)

Base: 1rem. Familias: sans = Inter Tight (UI/body), display = Grift (heros),
mono = Interval, scribble = Gantol. Weights 400-800.

| Token | rem | px | Line-height | Usage |
|-------|-----|-----|-------------|-------|
| `font-size-xs` | 0.75 | 12 | 1.35 | Labels, micro text |
| `font-size-sm` | 0.875 | 14 | 1.45 | Captions, secondary |
| `font-size-base` | 1 | 16 | 1.5 | Body (default) |
| `font-size-lg` | 1.25 | 20 | 1.4 | Body large |
| `font-size-xl` | 1.5 | 24 | 1.3 | h4 |
| `font-size-2xl` | 1.75 | 28 | 1.25 | h3 |
| `font-size-3xl` | 2.25 | 36 | 1.2 | h2 |
| `font-size-4xl` | 2.75 | 44 | 1.15 | h1 |
| `font-size-5xl` | 3.5 | 56 | 1.1 | Display large |
| `font-size-6xl` | 4.5 | 72 | 1.05 | Hero |

### Fluid Scaling System

Typography scales fluidly across viewports. No abrupt breakpoint jumps for font sizes.

**How it works:**
1. A root `--size-font` variable is calculated from the viewport width relative to the design's ideal container size
2. `body { font-size: var(--size-font); }` sets the root size
3. All `rem` values scale proportionally through the root

**Breakpoints (container-based):**

| Viewport | Ideal design width | Container range |
|----------|-------------------|-----------------|
| Desktop | 1440px | 992px - 1920px |
| Tablet | 834px | 768px - 991px |
| Mobile Landscape | 550px | 480px - 767px |
| Mobile Portrait | 390px | 320px - 479px |

**Container usage:**
```css
.container { max-width: var(--size-container); }
.container-md { max-width: calc(var(--size-container) * 0.85); }
.container-sm { max-width: calc(var(--size-container) * 0.7); }
```

**Files:**
- `packages/tokens/src/primitives/typography.json` -- raw scale values
- `packages/css/src/foundation/scaling.css` -- fluid scaling system
- `packages/css/src/foundation/typography.css` -- type classes (.h1, .body, .label, etc.)

**Rules:**
- Token font sizes are defined in px (primitives are raw values)
- CSS consumes tokens via custom properties and scales through rem
- No separate mobile/desktop typography files -- scaling system handles responsive
- Line-heights are paired 1:1 with font sizes (not independent scales)
- Display sizes (5xl, 6xl) use tighter line-height (~1.1) than body (~1.5)

### Breakpoints — CSS concern, not tokens

Breakpoints are defined ONLY in `css/foundation/scaling.css`. They are NOT design tokens.

**Why:**
- `@media` queries cannot consume CSS custom properties (CSS spec limitation)
- Responsive behavior is layout logic, not a design value
- Tailwind, shadcn, Material — none publish breakpoints as JSON tokens

**Reference values** (defined in scaling.css):

| Viewport | Range | Ideal design width |
|----------|-------|-------------------|
| Desktop (default) | 992px - 1920px | 1440px |
| Tablet | 768px - 991px | 834px |
| Mobile Landscape | 480px - 767px | 550px |
| Mobile Portrait | 320px - 479px | 390px |

Components that need `@media` queries use these values directly as hardcoded px in their CSS. The source of truth is `scaling.css`.

---

## Component Sizing Convention

**Sizing follows shadcn/Radix convention: explicit height + padding per size.**

Each size defines `height`, `padding`, and `font-size` explicitly. This guarantees buttons align with inputs at the same size and heights are pixel-perfect across browsers.

Gap, radius, and icon-size use `em` so they scale with font-size.

```css
/* Explicit per-size: height, padding, font-size */
.button--m {
  height: 2.5rem;        /* 40px — matches input--m */
  padding: 0 1rem;       /* horizontal padding */
  font-size: var(--button-font-size-m);  /* 16px from tokens */
}

/* em-relative: scales with font-size */
.button {
  gap: 0.5em;
  border-radius: 0.625em;
}
.button__icon { width: 1em; height: 1em; }
```

**Size scale (uniform font-size, height + padding differentiate):**

| Size | Height | H-Padding | Font-size | Usage |
|------|--------|-----------|-----------|-------|
| xs | 28px | 8px | 13px | Inline actions, table rows |
| s | 32px | 12px | 13px | Compact actions, toolbars |
| m | 40px | 16px | 13px | Standard buttons |
| l | 48px | 24px | 13px | Prominent actions |
| xl | 52px | 32px | 13px | Hero CTAs |

Font-size is the same across all sizes. Differentiation comes from height and horizontal padding. xl uses wider padding for visual prominence. xs minimum 28px for touch target safety.

### Naming convention

Component and variant names MUST match Figma exactly. Internal token names can differ.

**Sizes:** `xs`, `s`, `m`, `l`, `xl` (not sm/default/lg)
**Variants:** `primary`, `secondary`, `tertiary`, `destructive-primary`, `destructive-secondary`, `destructive-tertiary`

Figma has a typo "Terceary" — we correct it to `tertiary` in code but the variant structure stays the same.

**Rules:**
- `height` in `rem` (matches other components at same size)
- `padding` in `rem` (consistent spacing)
- `font-size` from tokens (Major Third scale)
- `gap`, `radius`, `icon-size` in `em` (proportional to font-size)
- `line-height: 1` on interactive components
- `-webkit-tap-highlight-color: transparent` on all interactive elements
- `scale` for press feedback (composited, no layout shift)
- `prefers-reduced-motion: reduce` disables transitions and scale

---

## Build Pipeline

```
tokens -> css -> components-react, components-astro
                 animations (independent)
```

Enforced by Turborepo. Never build components before tokens + css.

### Per-package builds

| Package | Tool | Input | Output |
|---------|------|-------|--------|
| tokens | Style Dictionary v4 | `src/**/*.json` | `build/{css,js,scss,json}/` |
| css | Vite + LightningCSS | `src/index.css` | `dist/atom.css` |
| animations | TypeScript | `src/**/*.ts` | `dist/**/*.js` + `.d.ts` |
| components-react | tsup | `src/**/*.tsx` | `dist/` (ESM + CJS) |
| components-astro | None | `src/**/*.astro` | direct import |

---

## CSS Rules

- **ZERO hardcoded values** in component CSS. Every color, spacing, radius, timing, font = CSS custom property from tokens.
- **No CSS-in-JS.** No Tailwind in component source. Pure CSS with custom properties.
- **No scoped styles in components.** All visual styling lives in `@atom-uikit/css`.
- Components render CSS class names. CSS package provides the styles.
- Class naming: `.{component}--{variant}`, `.{component}--{size}`, `.{component}--{state}`

---

## Animation Rules

- Each module exports `init*(): CleanupFn`
- Components expose `data-*` attributes as animation hooks (e.g., `data-hover-rotate`)
- Always check `prefers-reduced-motion` before animating
- Support `data-motion-exempt` to skip animation per-element
- GSAP is a peer dependency, not bundled

### Añadir un behavior: lo que el flujo exige (checklist)

`build-browser.mjs` recolecta automáticamente cualquier `export function init*`
de `dist/`, así que un módulo nuevo entra al bundle **solo. Sin avisar.** Por eso
el sistema tiene gates que hay que atender, no rodear:

1. **Export en `packages/animations/src/index.ts`.**
2. **Declararlo en la allowlist** de `packages/components-react/src/__tests__/animations-bundle-contract.test.ts`.
   Ese test existe para que ningún behavior entre al bundle sin declararse: si
   falla al añadir uno, está funcionando. Se actualiza la lista, no se relaja.
3. **Correr `pnpm --filter @atom-uikit/components-react test`**, no solo
   `pnpm conformance`. Son suites distintas y el contrato del bundle vive en la
   segunda (precedente: `initMegaNav` llegó a un PR con ese test en rojo).
4. **Revisar el budget** de `atom-animations.js` en `conformance/budgets.json`.
   Subirlo es un cambio consciente de ese archivo, justificado en el PR.
5. **Item `<slug>-animation`** en `registry.json` con `dependencies: ["gsap"]`.

Nota sobre CI: `component-tests.yml` corre con filtros de path. **No convertirlo
en check requerido** — con filtros de path el check no corre en PRs que no
tocan esas rutas y el PR queda colgado en pending para siempre (ver
`reference_atomuikit_branch_protection`). La cobertura se arregla ampliando
`paths`, que es donde `packages/animations/**` tuvo que entrar.

---

## Releasing (sin npm)

```bash
pnpm changeset          # create changeset (versionado interno + CHANGELOG)
pnpm changeset version  # bump versions
pnpm build              # build all
pnpm build:registry     # regenera public/r → commit a main → deploy hook docs
# deploy del canal público: ver public-dist/README.md (proyecto Vercel atom-web-ds)
```

`pnpm release` está deshabilitado — npm no es canal de distribución (ver "Canales de
distribución"). Un release = registry regenerado + canal /v1 redeployado.

---

## Dev Workflow

1. `pnpm install` at root
2. `pnpm dev` runs Storybook + watch mode on packages
3. Make changes in packages/
4. Preview in Storybook (apps/storybook/)
5. `pnpm build` to verify
6. `pnpm changeset` to document changes
7. Commit, PR, merge, release

---

## Storybook Interactive Preview Pattern

Stories use inline controls rendered inside the canvas (not Storybook's external controls panel). This is required because the documentation site (`UIKitDocumentation_ATOM`) embeds stories via `iframe.html?viewMode=story`, which hides the external panel.

Reference implementation: `apps/storybook/src/stories/Button.stories.tsx`

### Layout structure

```
+-------------------------------------------------------------+
|  Glass container (border-radius: 20px, margin: 12px)        |
|                                                              |
|  +--Controls (left, 300px)--+--Divider--+--Preview (right)--+
|  |                          |     |     |                    |
|  |  VARIANTE                |     |     |  PREVIEW           |
|  |  [Tabs animated]        |     |     |                    |
|  |                          |     |     |     [Component]    |
|  |  TAMANO                  |     |     |                    |
|  |  [Tabs animated]        |     |     |                    |
|  |                          |     |     |                    |
|  |  ESTADO                  |     |     |                    |
|  |  [Tabs animated]        |     |     |                    |
|  |                          |     |     |                    |
|  |  PROPIEDADES             |     |     |                    |
|  |  Label         (Toggle)  |     |     |                    |
|  |  Label         (Toggle)  |     |     |                    |
|  +--------------------------+-----+-----+--------------------+
+-------------------------------------------------------------+
```

### Glass container

Wraps the entire story. Provides depth and visual separation from the Storybook canvas.

```tsx
const glass: React.CSSProperties = {
  position: 'relative',
  borderRadius: '20px',
  overflow: 'hidden',
  isolation: 'isolate',
  backdropFilter: 'saturate(120%) blur(16px)',
  WebkitBackdropFilter: 'saturate(120%) blur(16px)',
  background: 'color-mix(in srgb, var(--card, #27272a) 55%, transparent)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
  border: '1px solid color-mix(in srgb, var(--border, #3f3f46) 40%, transparent)',
};
```

Inside the container, render `glassLayer` (5 absolute-positioned divs with mix-blend-modes: fill, highlight-soft, highlight-strong, edge-dark, inner-glow). These are `pointer-events: none`, `z-index: 0`. All content must have `position: relative; z-index: 1`.

### Controls panel (left side)

Width: `300px`. Padding: `24px`. Flex column, gap `16px`.

#### Control types

Only two control types are allowed:

1. **Segmented controls** (`<Tabs>` + `<TabsList animated>` + `<TabsTrigger>`) for selecting one option among several (variant, size, state). Each trigger gets `flex: 1` via CSS. The `animated` prop on `TabsList` renders a sliding indicator.

2. **Toggle switches** (`<Toggle animated>`) for boolean properties (disabled, animated, icon on/off). Laid out as rows: label left (`font-size: 13px`, `color: var(--foreground)`), toggle right (`justify-content: space-between`).

#### Section labels

Each control group has a label row with a lucide-style SVG icon (14x14, stroke-based):

```tsx
const sectionLabelRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--muted-foreground, #a1a1aa)',
  marginBottom: '8px',
};

// Usage:
<div style={sectionLabelRow}><IconLayers />Variante</div>
```

Icons are inline SVGs (no external dependency). Use lucide icon paths at 24x24 viewBox rendered at 14x14.

#### UX rules for control organization

- **Separate intent from hierarchy**: e.g. for Button, "destructive" is a toggle, "primary/secondary/tertiary" is a segmented control. Don't mix them into one flat list.
- **Mutually exclusive states** go in a single segmented control (Normal | Cargando | Deshab.), never separate toggles.
- **Independent booleans** get individual toggle rows.
- **Labels in Spanish**: Variante, Tamano, Estado, Propiedades, Destructivo, Animado, Icono izquierda, Icono derecha, Preview.

### Divider

`<Divider orientation="vertical" />` from the DS, wrapped in a flex container with `padding: 16px 0` and `align-items: stretch`.

### Preview area (right side)

`flex: 1`, `padding: 24px`. Label "Preview" with eye icon at top left. Component centered vertically and horizontally in the remaining space.

### Transition animation

When variant, size, or state changes, the preview component animates out/in:

```tsx
const animateTransition = (fn: () => void) => {
  setTransitioning(true);
  setTimeout(() => { fn(); setTransitioning(false); }, 200);
};

// On the preview wrapper:
style={{
  transition: 'opacity 0.2s cubic-bezier(0.625, 0.05, 0, 1), transform 0.2s cubic-bezier(0.625, 0.05, 0, 1)',
  opacity: transitioning ? 0 : 1,
  transform: transitioning ? 'scale(0.92)' : 'scale(1)',
}}
```

### DS components used in stories

All controls must use DS components, never native HTML or inline-styled replacements:

| Control | Component | Import path |
|---------|-----------|-------------|
| Segmented control | `Tabs`, `TabsList`, `TabsTrigger` | `components-react/src/atoms/Tabs` |
| Boolean switch | `Toggle` | `components-react/src/atoms/Toggle` |
| Separator | `Divider` | `components-react/src/atoms/Divider` |

Always pass `animated` to `TabsList` and `Toggle` for smooth interactions.

### Dark mode compatibility

All colors use CSS custom properties (`var(--card)`, `var(--border)`, `var(--foreground)`, `var(--muted-foreground)`) with fallback hex values. The glass container uses `color-mix()` for transparency. Never hardcode light-only or dark-only colors.

---

## Component Review & Story Workflow (paso a paso)

Proceso repetitivo para revisar cada componente del DS y dejarlo production-ready. Seguir en orden.

### Paso 1: Leer el componente

Leer 3 archivos:
- `packages/components-react/src/atoms/{Component}.tsx`
- `packages/css/src/components/{category}/{component}.css`
- `apps/storybook/src/stories/{Component}.stories.tsx`

### Paso 2: Tokenizar CSS

Reemplazar todos los valores hardcoded en el CSS del componente:

| Hardcoded | Token |
|-----------|-------|
| `Npx` (height) | `Nrem` (ej: `40px` -> `2.5rem`) |
| `padding: 8px` | `var(--spacing-2)` |
| `border-radius: 8px` | `var(--radius-md)` |
| `border: 1px` | `var(--stroke-thin)` |
| `box-shadow: 0 0 0 2px` | `0 0 0 var(--stroke-medium)` |
| `0.15s cubic-bezier(...)` | `var(--duration-150) var(--easing-out)` |
| `0.3s` | `var(--duration-300)` |
| `scale: none` | `scale: 1` (en `prefers-reduced-motion`) |
| `width: 16px` (iconos) | `1em` (escala con font-size) |

### Paso 3: Verificar componente React

Checklist:
- [ ] `forwardRef` presente
- [ ] Tipos exportados (`export type {Component}Props`)
- [ ] Sub-componentes tienen tipos exportados
- [ ] `aria-*` atributos correctos (aria-invalid, aria-disabled, aria-busy)
- [ ] Anchor disabled previene navegacion (`onClick preventDefault`)
- [ ] Spinner usa CSS animation (no inline `animateTransform`), respeta `prefers-reduced-motion`
- [ ] `cn()` importado de util compartido (si aplica)

### Paso 4: Crear story interactiva

Usar utilidades compartidas:
```tsx
import { StoryPreviewLayout, sectionLabelRow, switchRow, switchLabel, useTransition } from '../utils/StoryPreviewLayout';
import { IconLayers, IconRuler, IconActivity, IconSettings } from '../utils/SectionIcons';
```

Estructura del render:
```tsx
const { animateTransition, transitionStyle } = useTransition();

return (
  <StoryPreviewLayout minHeight={420} controls={<>...</>}>
    <div style={transitionStyle}>
      <Component ... />
    </div>
  </StoryPreviewLayout>
);
```

#### Categorias de controles (4 bloques jerarquicos)

1. **Seleccion multiple** -> `<Tabs>` + `<TabsList animated>` + `<TabsTrigger>`
   - Variante, Tamano, Estado, Tipo, Composicion, Orientacion, etc.
   - Mutually exclusive (ej: Normal | Cargando | Deshab.)

2. **Booleanos** -> `<Toggle animated>`
   - Destructivo, Animado, Icono izq., Etiqueta, etc.
   - Layout: `switchRow` (label izq, toggle der, full width)

#### Reglas de organizacion

- Separar intent de jerarquia (ej: "Destructivo" es toggle, "Primario/Secundario/Terciario" es segmented)
- Estados mutuamente excluyentes en un solo segmented (Normal | Cargando | Deshab.)
- Composicion con Field cuando el componente tiene label/helper/error
- Labels en espanol: Variante, Tamano, Estado, Propiedades, Marcado, Filas, Contenido, etc.
- Section labels con icono de `SectionIcons` + uppercase 10px

#### Iconos de seccion disponibles

`IconLayers` (variante), `IconRuler` (tamano/filas), `IconActivity` (estado/marcado), `IconSettings` (propiedades), `IconEye` (preview), `IconLayout` (orientacion), `IconBox` (composicion/contenido), `IconImage` (icono), `IconType` (tipo)

### Paso 5: Build y verificar

```bash
pnpm build   # debe pasar sin errores
```

Refresca Storybook local y verifica visualmente.

### Paso 6: Commit y push

```bash
git add {archivos modificados}
git commit -m "feat({component}): tokenize CSS, interactive story with {features}"
git push origin main
```

Solo Storybook (privado) no necesita release. Si CSS o React cambiaron:

### Paso 7: Release interno (sin npm)

```bash
# Si el prompt interactivo de `pnpm changeset` da guerra, no hace falta escribir el
# archivo a mano: `pnpm exec changeset add --message "texto"` hace lo mismo sin
# prompt (verificado 2026-08-09; el CLI responde y expone add/version/status).
# La forma manual sigue valiendo — escribir .changeset/{nombre}.md con frontmatter:
# ---
# "@atom-uikit/components-react": patch
# "@atom-uikit/css": patch
# ---
# Descripcion del cambio.

pnpm changeset version
git add .changeset/ packages/*/CHANGELOG.md packages/*/package.json
git commit -m "chore(release): version interna X.Y.Z"
git push origin main            # dispara registry → docs deploy hook
# si cambió tokens/css: redeploy del canal /v1 (public-dist/README.md)
```

Usar `patch` para fixes, `minor` para breaking changes (eliminacion de componentes).
NO correr `pnpm release` — npm está desconectado como canal.

### Componentes ya revisados

| Componente | CSS | Story | npm |
|------------|-----|-------|-----|
| Button | tokenizado | interactiva | 2.0.0 |
| IconButton | tokenizado | interactiva | 2.0.0 |
| LinkButton | tokenizado + shimmer | interactiva | 2.0.0 |
| ButtonGroup | tokenizado | interactiva | 2.0.0 |
| Input | tokenizado | interactiva | 2.0.0 |
| Textarea | tokenizado | interactiva | pendiente |
| Select | limpio | interactiva | pendiente |
| Checkbox | tokenizado | interactiva | pendiente |
| Toggle | limpio | pendiente | - |
| Tabs | indicador animado | pendiente | 2.0.0 |
| SearchInput | eliminado | - | 2.0.0 |

### Componentes nuevos (en desarrollo)

| Componente | Tipo | CSS | React | Story | npm |
|------------|------|-----|-------|-------|-----|
| Image | atom | ok | ok | ok | pendiente |
| Stepper | atom | ok | ok | ok | pendiente |
| StatsCard | molecule | ok | ok | ok | pendiente |
| ProgressNav | molecule | pendiente | pendiente | pendiente | pendiente |
| Counter | atom + animation | pendiente | pendiente | pendiente | pendiente |
| PricingCard | molecule | pendiente | pendiente | pendiente | pendiente |

### Componentes pendientes de documentacion (CMS + MCP manifest)

Estos componentes estan creados en el DS pero NO tienen articulo en el CMS ni entrada en el MCP manifest:
- Image, Stepper, StatsCard, ProgressNav (nuevos)
- Marquee, VideoPlayer, UserProfile, Sidebar (existentes, ocultos del manifest)
- Dialog, AlertDialog, Sheet, Drawer, Toast (existentes, ocultos)
- DropdownMenu, ContextMenu, Combobox (existentes, ocultos)
- Accordion, Tabs, NavLink, Breadcrumb, Pagination (existentes, ocultos)
- Divider, Item, Empty, Table, Resizable, Calendar, Tooltip, MenuButton (existentes, ocultos)

Pipeline de documentacion: atom-uikit-ds (crear) → UIKitCMS_ATOM (articulo Payload) → atom-uikit-cms-db (manifest + migration) → UIKitDocumentation_ATOM (se renderiza)

### Componentes pendientes de review

Radio, Chip, Tag, Slider, Divider, Skeleton, Spinner, Field, Accordion, Avatar, AvatarGroup, Breadcrumb, BurgerIcon, Calendar, Empty, Item, NavLink, Pagination, Resizable, Table, Typography.

---

### `cn()` se repite en cada componente A PROPÓSITO — no lo centralices

Los 51 componentes React declaran su propia copia de `cn()`. Parece deuda y no lo es:
el registry distribuye **archivos sueltos** que se copian al proyecto del consumidor
(`npx atom-uikit add button` deja `components/atoms/Button.tsx` y nada más — mira
`files[]` de `button` en `registry.json`). Un `import { cn } from '../utils/cn'`
llegaría al consumidor apuntando a un archivo que nunca se copió: import roto en
cada proyecto que instale el componente, y el canal privado es el canal principal.

Centralizarlo exige antes: item de registry para el util, `registryDependencies` en
los 51 componentes y resolución de alias en el CLI. Es una spec, no un refactor de
limpieza. Hasta entonces, cada archivo se vale por sí mismo.

Mismo criterio para cualquier helper compartido dentro de `components-react`.

## Prohibited

- Hardcoded hex, px, rem, or timing values in CSS or components
- CSS-in-JS (styled-components, emotion, etc.)
- Tailwind classes in component source
- Importing tokens as JS in CSS files (use CSS custom properties)
- Circular token references
- Skipping the semantic layer (component tokens must NOT reference primitives directly)
- Publishing without a changeset
- Modifying build output manually

## Release
Operación y smoke post-merge: [docs/RUNBOOK.md](docs/RUNBOOK.md) (sección *Release de componente*). `pnpm smoke:publish <slug>`.
