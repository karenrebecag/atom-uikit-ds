---
"@atom-uikit/animations": patch
---

marquee-draggable: espera a poder medirse en vez de rendirse.

Un marquee dentro de una seccion que arranca en `display: none` — el switch de
seccion por viewport del sitio, un tab, un acordeon — no tiene caja al cargar,
asi que medía 0 y el modulo hacia `return`. Como `initDraggableMarquee` corre
una sola vez, eso lo dejaba muerto PARA SIEMPRE: al cambiar de viewport la tira
seguia quieta y, peor, los controles prev/next nunca llegaban a engancharse
(eso pasa despues del punto donde abortaba), asi que parecian ROTOS en vez de
inertes. Es como se encontro: los botones del marquee de reviews en movil no
respondian.

Ahora, si no se puede medir, se aplaza con un `ResizeObserver` y se monta en
cuanto tenga ancho. Es la herramienta exacta para esto: un elemento en
`display: none` no tiene box, y en cuanto la tiene dispara el callback.

El cuerpo del bucle pasa a ser una funcion `setup()` para poder reintentarlo; el
guard de `data-draggable-marquee="initialized"` ya impedia el doble montaje y
sigue cubriendo el reintento.

Budget sin tocar: 149.2/155 raw, 37.8/40 gz.
