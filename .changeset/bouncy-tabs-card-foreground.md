---
"@atom-uikit/css": patch
---

bouncy-tabs: la card declara su propio foreground.

`.bouncy-tabs__card` pintaba `--card` y no declaraba texto, asi que cualquier
contenido sin color propio heredaba el de la pagina. Con el componente en dark
sobre una pagina light, un heading salia casi negro sobre `#171717`.

No se veia porque los dos unicos textos que habia — parrafo y botones —
declaran color explicito y se salvaban por casualidad. Aparecio al anadir
headings a los paneles.

Es la regla de pares del DS: toda superficie va con su `-foreground`.
Medido: 17.18:1 en dark, muy por encima de AA.
