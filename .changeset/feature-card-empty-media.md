---
"@atom-uikit/css": patch
---

feature-card: el slot de media desaparece cuando no lleva nada dentro.

`__media` es un slot y por tanto opcional, pero su caja se reservaba sola: con
`aspect-ratio` un slot vacio seguia ocupando 5/4 del ancho de la columna, y en
pantalla eso se lee como una imagen que no cargo. Es el caso de las cards de
industrias, que son solo titulo y texto.

El consumidor no podia arreglarlo desde su lado: la unica salida era pisar la
clase del DS o borrar el div del slot, y esto ultimo lo obliga a volver a
crearlo el dia que quiera imagen.

`:not(:has(*))` y no `:empty` a proposito: `:empty` cuenta los nodos de texto,
asi que un salto de linea entre etiquetas —lo normal en HTML escrito a mano—
bastaria para que la regla no aplicara. Lo que decide es si hay un ELEMENTO
dentro.
