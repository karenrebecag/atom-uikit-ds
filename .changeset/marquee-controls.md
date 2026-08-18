---
"@atom-uikit/animations": patch
"@atom-uikit/css": patch
"@atom-uikit/components-react": patch
---

marquee-draggable: flechas prev/next opcionales.

`[data-draggable-marquee-control="prev"|"next"]` dentro del wrapper. Cada
pulsacion avanza UN item exacto desde el limite mas cercano, no desde la x
cruda: pulsar a mitad de un arrastre no debe acumular medio item de desfase.

Reusa la misma mecanica que el imantado — se mueve `progress` y no `x`, porque
la `x` la escribe el propio tween del loop en cada frame.

Dos diferencias con un carrusel acotado, y las dos son consecuencia de que esta
tira sea un loop infinito:

- **No hay estado deshabilitado.** No existe un primer ni un ultimo item que
  alcanzar, asi que las flechas siempre responden.
- **Un paso congela el avance mientras dura** y lo restituye al terminar. Sin
  eso, con autoplay el loop sigue sumando por debajo y el paso queda corto.

El modulo **no inyecta `aria-label`**: este DS sirve un sitio en tres idiomas y
una etiqueta fija seria incorrecta en dos de ellos. La pone el consumidor; el
layout la expone como variable.
