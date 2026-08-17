---
"@atom-uikit/animations": patch
"@atom-uikit/components-react": patch
---

marquee-draggable: `data-snap` para que el arrastre tenga puntos de parada.

Sin puntos definidos, soltar la tira a mitad de una card la deja cortada por el
borde. En pantallas anchas eso no molesta — una card asomando COMUNICA que hay
mas — pero cuando una card ocupa casi todo el ancho el recorte se lee como un
fallo de maquetacion.

Por eso `"auto"` no mira breakpoints sino cuantas cards entran: si caben menos
de dos, imanta al limite mas cercano al soltar. El DS no publica breakpoints
como tokens a proposito, y esta decision es de proporcion, no de dispositivo.
`"true"` imanta siempre, `"false"` (por defecto) mantiene el arrastre libre.

Detalles del mecanismo:

- La posicion se corrige moviendo `progress` del loop, no `x`: `x` lo escribe el
  propio tween, asi que escribirlo por fuera duraria un frame.
- Cerca de la costura 0/1 se elige el equivalente mas cercano. Sin eso, imantar
  al borde hace dar la vuelta entera a la tira.
- Solo aplica sin autoplay: imantar una tira que avanza sola es contradictorio.

**Budget subido** a 140/36 (medido 130/33). Lo acumulado de esta tanda:
text-reveal (espera de fuentes, guarda de gradiente, FOUC propio) y
marquee-draggable (autoplay, lag, snap).
