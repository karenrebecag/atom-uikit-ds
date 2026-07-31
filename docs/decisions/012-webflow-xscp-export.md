# ADR 012 — Webflow XscpData export (F6)

**Status:** Accepted (pilot)  
**Date:** 2026-07-31  
**Feature:** F6

## Context

new.atomchat.io and marketing sites use Webflow outside the DS. annnimate’s
recipe is clipboard paste of `@webflow/XscpData` + Custom Code for at-rules the
paste does not carry. The format is **not official** and may break.

## Decision

1. **Artifact, not runtime** — Generador puro `(html, css) → WebflowPackage`.
   Never load Webflow at runtime; regenerate after every registry change.

2. **Source of HTML/CSS** — CSS always from canónico `public/r/{slug}`. HTML for
   the pilot wave is a small BEM template per pilot under
   `scripts/webflow/pilots/{slug}.html` (components don’t ship HTML in the
   registry). Layouts can later pass their published HTML directly.

3. **Algorithm baseline** — Mapping follows the house skill
   [Code-to-Webflow](https://github.com/karenrebecag/Code-to-Webflow): tag→type,
   styleLess, variants (`main_hover`), required `createdBy`/`origin` on styles.

4. **IDs** — Deterministic `atom-{slug}-{n}` for reproducibility in tests.
   Designer may re-id on paste; tests normalize before compare.

5. **Breakpoints** — `@media` max-width maps:
   - ≤479 → `tiny` (optional; often mobile portrait)
   - ≤767 → `small`
   - ≤991 → `medium`
   - else → recorded as `unsupported` media (noisy, not silent)

6. **Unsupported** — CSS properties / selectors we don’t map go into
   `unsupported[]` on the package; generation never fails for that reason.

7. **MCP** — `atom_uikit_source({ component, format: "webflow" })` returns
   clipboard JSON + optional head keyframes + footer note + risk warning + paste
   steps. Non-pilot slugs get an actionable error pointing at HTML Embed fallback.

8. **Gate 0 designer fixtures** — Real Designer clipboard dumps live under
   `scripts/webflow/fixtures/designer/` (Karen). Algorithm fixtures under
   `fixtures/algorithm/` validate structure until designer dumps land.

## Pilots (wave 1)

| Slug | Role |
|------|------|
| `badge` | simple, no media/keyframes |
| `divider` | simple structure |
| `spinner` | `@keyframes` → head block |

## Risk

Documented in every MCP payload. If paste fails after a Webflow release, fall back
to HTML Embed + `/v1/embed.css` (playbook).

## Addendum 2026-07-31 — real-dump corrections + artifact channel

Contrastado contra un dump REAL del Designer
(`scripts/webflow/fixtures/designer/testimonial-copy-json.json`, fuente
copy-json.webflow.io) y el skill Code-to-Webflow:

1. **Formato** — payload es `{nodes, styles, assets, ix1, ix2}` (sin
   `styleOverrides`); styles SIN `origin` (keys exactas: _id, fake, type, name,
   namespace, comb, styleLess, variants, children, createdBy, selector);
   `node.classes` referencia style `_id`s (no nombres); `_id`s con forma UUID
   (deterministas aquí; el Designer re-asigna al pegar); `data.displayName`
   presente. Breakpoints válidos: `medium/small/tiny` — "large"+ son min-width
   y NO se emiten como variant.
2. **Media no mapeable → head** — `prefers-reduced-motion` y cualquier @media
   no-breakpoint viaja completo en el bloque head Custom Code (aplica a las
   clases pegadas), reportado en `unsupported`. Nunca se pierde el fallback de
   accesibilidad.
2b. **Selectores compuestos y custom properties → head** — el BEM real del DS
   usa selectores encadenados (`.badge--neutral.badge--enabled`) y modificadores
   var-driven (`--badge-bg`). El panel del Designer no puede expresar ninguno de
   los dos, y atribuir un selector compuesto a una sola clase mezcla variantes
   (bug detectado en la generación real del badge). Regla: SOLO selectores
   simples (`.clase`, `.clase:pseudo`) entran a styleLess; compuestos,
   descendientes, listas, `::pseudo-elementos` y declaraciones `--x` viajan como
   CSS normal al head, reportados en `unsupported`. Limitación aceptada wave 1:
   ese CSS no se ve en el canvas del Designer (Custom Code renderiza en
   publish/preview); combo classes nativas (`comb: "&"`) se evaluarán en wave 2
   con un fixture real de combo capturado por Karen.
3. **Canal de artefactos (fix duplicación)** — `build:registry` emite
   `public/r/webflow/{slug}.json` + `index.json` vía
   `scripts/emit-webflow-channel.mjs`. El MCP SIRVE el artefacto
   (`fetchWebflowArtifact`) y solo formatea; el generador gemelo del MCP fue
   eliminado. Decision 1 ("artifact, not runtime") ahora se cumple literalmente.
