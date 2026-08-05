---
"@atom-uikit/tokens": minor
"@atom-uikit/css": minor
---

Reinstala el violeta de marca y declara el highlight tipografico como token.

CAMBIO DE CONTRATO DECLARADO (decision de Karen 2026-08-05): la migracion a OSMO
retiro la rampa violeta junto con la paleta Tailwind y dejo `.text-gradient` en
forest -> naranja. Pero el violeta #8023FF sigue vigente en el brandbook y el
highlight violeta -> naranja es el que viven las tres homes de atomchat.io, sin
estar declarado en ninguna parte (vivia como hex suelto en el `<head>` de la
pagina). Se reinstala como primitive y se declara con rol propio.

- `color.violet.400` (#bf44ff) y `color.violet.500` (#8023ff) vuelven a primitives.
- Nuevo `--gradient-highlight` (violeta -> naranja) para TIPOGRAFIA: keywords de
  titular y borde del eyebrow pill. `--gradient-brand` (forest -> naranja) se
  queda intacto para SUPERFICIES: fondos de seccion. Son dos roles, no uno.
- `.text-gradient` pasa a consumir `--gradient-highlight`.
- `tag` gana `--l` (eyebrow de hero: levanta el max-width de 12.5rem y el nowrap,
  porque es el unico tamano pensado para frase y no para etiqueta de estado) y
  `--gradient` (contorno degradado por doble background + clip boxes; un
  border-image no admite radio y el pill es radius-full).
