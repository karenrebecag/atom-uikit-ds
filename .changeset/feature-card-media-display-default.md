---
"@atom-uikit/css": patch
---

feature-card: el display del slot de media baja a especificidad cero.

`display: block` sobre un `<div>` es el default del navegador, no una decision
del componente. Declarado a especificidad normal EMPATA con cualquier regla de
una clase que escriba el consumidor, y como el CSS del DS se carga despues del
suyo, gana el DS: el slot no se puede ocultar desde fuera.

Medido en atomchat.io: las variantes "sin imagen" del componente de Webflow
declaran `display: none` sobre `.ds-feature-card__media`, pero el panel las
emite envueltas en `:where()` —cero especificidad anadida— asi que pesaban
(0,1,0), igual que la regla del DS. Empate, y `/v1/components.css` carga 7.200
caracteres mas abajo que la hoja de Webflow. La imagen seguia visible con la
regla correcta escrita y la clase correcta aplicada.

Con `:where()` la declaracion sigue cubriendo el unico caso que la justificaba
—un slot montado sobre un elemento inline, donde `aspect-ratio` no aplicaria— y
deja de pelear con quien consume el componente.
