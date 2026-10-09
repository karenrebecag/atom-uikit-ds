# Bloque ejemplar — formato de `<slug>.exemplar.ts`

Hermano de `PATTERN.md`. Un ejemplar añade a un layout la decision de composicion que el layout,
por contrato, no puede llevar. **No escribe CSS ni HTML**: declara que clases ya publicadas usar
y con que copy. Contrato ejecutable: `conformance/block-contract.json` (7 reglas).

JS plano, sin imports (igual que los layouts: la extension `.ts` es cosmetica). Un solo export.

| Campo | Contenido |
|---|---|
| `slug` | el del layout hermano |
| `whenToUse` / `whenNotToUse` | >=2 cada uno; el segundo nombra el hermano al que ir |
| `rhythm` | una clase de `foundation/section.css`. **El html del layout la lleva en su raiz** y `.l-<slug>` no declara padding ni margin de bloque |
| `surface` | `default` o una `.bg-*` que `utilities` emite. La skill puede forzarla a `default` |
| `motion` | `{ hook, attrs }`: nombre de un item `kind: hook`, ya en `registryDependencies`, con sus `data-*` en el html del layout. `{ hook: null }` si no anima |
| `content` | copy de referencia por slot. `null` quita el elemento marcado `data-optional="<slot>"` (p. ej. un eyebrow) |
| `repeats` | filas para cada `data-repeat` |
| `rawSlots` | slots cuyo valor es HTML (iconos SVG propios); el resto se escapa |
| `states` | que debe sobrevivir la region |
| `a11y` | `carriesH1`: la region esta disenada para alojar el h1 (la skill asigna uno solo) |
| `related` | hermanos reales, ni deprecated ni legacy |
| `evidence` | `capture` (1440), `captureMobile` (390) en `docs/evidence/`, y la nota de la prueba §8 |

## Que publica el build

- `atom.exemplar` en el item `layout/<slug>`: todo lo anterior salvo `content`, `repeats`, `rawSlots`.
- `layouts/<slug>.exemplar.html`: el html del layout con la copy aplicada (0 `{{}}`, 0 `data-repeat`),
  con la clase de ritmo y la de superficie en la raiz y un comentario inicial que marca la copy
  como de referencia. **No es el camino de Webflow** (ese va por `docs/webflow-playbook.md`).

## Reglas de contenido

- Cifras solo del catalogo autorizado de atom-mcp (`apps/webflow/src/core/lp-metrics.ts`). Precios: no se inventan.
- Sin eyebrows: se omiten con `null`. Sin formularios: el CTA es `atom-wa-btn` a `wa.me`.
- El numero de WhatsApp de referencia es `00000000000`: sustituir con el del brief.
