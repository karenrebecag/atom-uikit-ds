---
"@atom-uikit/css": patch
---

review-card: sin borde, altura igualada y todo el contenido a la izquierda.

**Fuera el borde.** No separaba nada que el fondo de la card no separase ya, y
en una tira de ocho dibujaba ocho rectangulos compitiendo con el texto.

**Todas las cards de una fila miden lo mismo.** Con altura por contenido, cada
atribucion cae donde acaba su cita y la fila se lee como un serrucho. La card
pide `height: 100%` y se estira con `align-self: stretch` — se estira ELLA en vez
de pedirle al carril que cambie, porque `.marquee__item` va en
`align-items: center` y es una clase COMPARTIDA con la tira de features.

El eslabon que faltaba es que la lista centra sus items, asi que el item se
ajustaba al contenido y el `height: 100%` no tenia contra que medir. Se resuelve
con `.marquee__item:has(> .review-card)`, para que el marquee siga sin saber
nada de review-card: la regla la trae quien la necesita, no el generico.

**Alineacion a la izquierda explicita** en la card, la cita y la atribucion. Ya
habia `text-align: left` en la raiz, pero un host con `text-align: center` en la
seccion se lo comia por herencia en los hijos.
