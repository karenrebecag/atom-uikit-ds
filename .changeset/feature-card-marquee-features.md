---
"@atom-uikit/tokens": patch
"@atom-uikit/css": patch
---

feature-card + layout marquee-features, y el intent `ai` estrena color propio.

**La card.** `feature.css` era una FILA (icono + texto + valor) para listas
dentro de un pricing-card; no habia ninguna card de feature en el sistema. Esta
tiene media, titulo y texto como slots, y UN solo componente con variantes de
color en vez de cuatro componentes de colores distintos.

Los nombres de variante son de color (`--green --purple --orange --blue`)
porque asi los nombra diseno, pero por dentro cada uno apunta a un intent y
nunca a un hex. El tinte es un solo mando (`--feature-card-tint: 4%`) y el tono
lo pone el intent: reproduce los colores de diseno con un desvio maximo de
5/255 por canal, asi que si el DS reafina `--success` o `--brand`, la card
sigue sin tocarla.

**El intent `ai` no tenia color de superficie**, y su `ai-text` apuntaba a
`forest`, exactamente el mismo valor que `success-text`. Es decir: `ai` se
pintaba de verde y era indistinguible del intent de exito — `.tag--ai` incluido.
Ahora `ai` es el violeta de marca del `gradient-highlight`, con el mismo flip de
paso que ya usa `link`: violet.500 en claro (5.6:1), violet.400 en oscuro
(5.2:1). El par `ai/ai-foreground` entra al gate de contraste.

**El layout.** `marquee-draggable` existia como behavior publicado pero sin
layout, o sea sin distribuir: cada consumidor reescribia el markup. `l-marquee-
features` publica la anatomia completa con sus `data-*` y sus notas (el
`draggable="false"` de las imagenes no es decorativo — sin el, el navegador
arranca su propio drag y se come el gesto).

**Y un conflicto que salio al montarlo**: `.marquee__list` lleva animacion CSS
propia, y el modo draggable mueve `.marquee__collection` con GSAP sobre el mismo
eje. Con los dos vivos la tira avanza al doble y el wrap deja de cuadrar con el
ancho real. `.marquee--draggable` apaga la animacion CSS.
