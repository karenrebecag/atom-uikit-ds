---
"@atom-uikit/animations": patch
"@atom-uikit/css": patch
"@atom-uikit/components-react": patch
---

marquee-draggable: los controles pasan a una fila propia debajo del carril.

Estaban absolutos sobre los bordes de `.marquee`. El problema es que `.marquee`
es el carril de RECORTE (`overflow: hidden`), asi que vivir dentro los ata a su
alto y los mete en el area recortada. Como fila propia debajo
(`.marquee__controls`, space-between), el recorte sigue siendo solo del carril.

Eso obliga a que el modulo los busque fuera del wrapper: primero dentro y solo
despues en el padre. Ese orden importa — si cada marquee lleva los suyos dentro,
dos hermanos no se roban los botones. Con los controles fuera y dos marquees
bajo el mismo padre la asociacion si es ambigua, y ese caso pide un contenedor
por marquee, no una heuristica mas lista.

Los modificadores `--prev` / `--next` dejan de posicionar (ya no hay `left` ni
`right` que aplicar); se quedan como enganche semantico.
