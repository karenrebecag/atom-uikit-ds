<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Logo strip:

```tsx
import { Marquee, MarqueeItem, MarqueeSeparator } from '@/components/atoms/Marquee';

<Marquee speed={75} fade pauseOnHover>
  <MarqueeItem>Acme</MarqueeItem>
  <MarqueeSeparator />
  <MarqueeItem>Globex</MarqueeItem>
</Marquee>
```

## Accesibilidad

- CSS mode duplicates the list (`aria-hidden` on the clone); keep meaningful text only in the first list.
- Prefer `pauseOnHover` when items are links users must click. Avoid autoplay motion that cannot be paused if it causes distraction (respect reduced-motion at the product layer when required).

## Cuándo no usar

- Static logo grids that should all be visible at once → layout grid, not a marquee.
- Draggable mode needs the motion package hooks — do not enable `draggable` without them.

## Criterio de uso

- Usa Marquee para prueba social o continuidad visual (logos, testimonios cortos), nunca para contenido que el usuario deba leer completo.
- `pauseOnHover` es obligatorio si el contenido es legible: sin pausa, leer implica perseguir el texto.
- `fade` sugiere continuidad en los bordes; sin el, la cinta parece cortada.

## Gotchas

- La animacion base es CSS: funciona sin GSAP. `draggable` es lo unico que exige el modulo de animaciones.
- `speed` deriva la duracion del ancho real del contenido: duplicar los items cambia la velocidad percibida si no ajustas.
