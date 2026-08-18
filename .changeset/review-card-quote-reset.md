---
"@atom-uikit/css": patch
---

review-card: la cita se blinda contra los estilos de tag del host, y el item se
estira de verdad.

**La barra gris a la izquierda de la cita.** `<blockquote>` llega con estilos
puestos por ETIQUETA — del navegador y del host; Webflow le da `border-left`
gris y padding propios. La clase gana a la etiqueta, pero solo en lo que
declara, y `.review-card__quote` declaraba tipografia y margen sin tocar borde
ni padding: los de Webflow sobrevivian. Ahora se resetean explicitamente.

Solo se veia donde el markup tiene `<blockquote>` real; donde quedo como `<p>`
no habia sintoma, que es justo lo que hace este fallo dificil de ver.

**Las alturas seguian desiguales.** El `align-items: stretch` del commit
anterior estaba mal: `align-items` alinea a los HIJOS del item, y el problema
era el item mismo, que seguia midiendo su contenido porque la lista centra. Va
`align-self: stretch`, para que el item se estire EL a la altura de la fila y el
`height: 100%` de la card tenga contra que medir.
