---
"@atom-uikit/tokens": patch
"@atom-uikit/css": patch
---

Piso de 16px para el texto base: los tokens font-size y el body usan --u-text = max(1px, --u). Entre breakpoints (992-1439px, 320-389px) el ancho ideal supera al viewport y el texto base caia hasta 11px. Spacing y radius siguen en --u: el layout no cambia, solo el texto deja de encogerse por debajo de su tamano de diseno.
