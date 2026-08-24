---
"@atom-uikit/css": patch
---

marquee: la altura del logo de cliente baja de 3.5rem a 3rem.

La tira de marcas se leia pesada frente a lo que la rodea: el logo es el
elemento mas alto del item y a 56px competia con los titulos de la seccion en
vez de acompanarlos. A 48px la tira vuelve a ser un pie de pagina visual, que es
lo que una lista de clientes debe ser.

Se cambia el fallback y no se introduce token: `--marquee-logo-height` sigue
siendo la perilla del consumidor y su nombre no cambia, asi que ningun sitio que
ya la declare se entera de esto.

Deliberadamente NO se tokeniza a `var(--spacing-12)`, aunque 3rem cae exacto en
la escala. Los tokens se emiten como `calc(N * var(--u))` y eso haria la altura
fluida, mientras que la correccion optica por marca es rem absoluto en el panel
de Webflow — que no declara custom properties (ver el comentario del bloque).
Base fluida contra correcciones fijas descuadra las proporciones en cada
breakpoint. Con las dos fijas, la relacion se sostiene en todos.

Consumidores con correcciones opticas: hay que reescalarlas por el mismo factor
(3/3.5) o quedan mas altas que la base. En atomchat.io son seis y ya estan
reescaladas.
