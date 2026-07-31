# F6 Gate 0 — Capture real Designer clipboard fixtures

**Estado 2026-07-31:** `designer/testimonial-copy-json.json` es un dump REAL del
Designer (fuente: copy-json.webflow.io, componente publicado para paste). El
generador ya se valida clave-por-clave contra él (test "F6-C1 designer contract").
Correcciones aplicadas desde ese dump: payload sin `styleOverrides`, styles sin
`origin`, `classes` referencian style `_id` (UUID-shaped), `data.displayName`,
breakpoints solo `medium/small/tiny`, media no-breakpoint → head Custom Code.

Tus capturas propias siguen siendo valiosas como SEGUNDA fuente (hover y nested
de primera mano) y son el prerequisito de F6-C2 (paste real):

## How to capture

1. Open a throwaway Webflow site in the Designer.
2. Build by hand:
   - **simple:** a `Div` + 2 classes with padding/color
   - **hover:** same + hover style on one class
   - **nested:** 3 levels of divs
   - optional: one element with a max-width media query style
3. Select the root and **Copy**.
4. Dump `application/json` from the clipboard (browser snippet or clipboard inspector).
5. Save as:
   - `designer/simple.json`
   - `designer/hover.json`
   - `designer/nested.json`

## Snippet (paste in browser console on any page after copying in Designer)

```js
// Does NOT work for Webflow's internal clipboard from outside the Designer.
// Prefer a clipboard manager that shows application/json, or the Osmo/InsertFuel tools.
```

Inside Designer extensions / paste interceptors used by Code-to-Webflow:
copy with both `application/json` and `text/plain`.

## After capture

```bash
node --test scripts/webflow/generate-xscp.test.mjs
# then add designer fixtures to the structuralEqual suite
```
