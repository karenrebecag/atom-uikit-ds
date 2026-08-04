<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Toolbar close control:

```tsx
import { IconButton } from '@/components/atoms/IconButton';

<IconButton
  variant="tertiary"
  size="xs"
  aria-label="Close dialog"
  icon={<CloseIcon />}
  onClick={onClose}
/>
```

## Accesibilidad

- `aria-label` is required (no text children). Name the action, not the glyph (“Close dialog”, not “X”).
- `loading` sets `aria-busy` and disables the control — keep adjacent status text if the wait matters.

### Correcto

- aria-label es OBLIGATORIO — sin el, el boton es invisible para screen readers
- `aria-busy={true}` se agrega automaticamente en loading
- `disabled={true}` remueve el boton del tab order
- focus-visible muestra outline con var(--ring)
- prefers-reduced-motion desactiva rotacion y scale

### Evitar

- No usar IconButton sin aria-label — es el error mas comun
- No usar como reemplazo de Button cuando hay espacio para texto — el texto siempre es mas accesible
- No confiar en el tooltip como unica forma de identificar la accion — el tooltip no es accesible en touch

## Cuándo no usar

- Actions that need a visible text label → `Button`.
- Navigation with a URL → `LinkButton` (or a real link), not an icon button that only looks like navigation.

## Criterio de uso

- Usa `aria-label` para nombrar la acción, no el dibujo: “Cerrar diálogo” comunica intención; “X” sólo describe el icono.
- En toolbars, mantén un mismo tamaño y agrupa acciones relacionadas; reserva `primary` para una sola acción dominante.
- Usa `loading` durante trabajo asíncrono y evita reemplazar el icono con contenido propio: el componente ya comunica el estado ocupado.

## Gotchas

- El control debe conservar un objetivo táctil suficiente aunque uses `xs` en una tabla densa.
- El CSS se publica como BEM global; no lo encapsules con CSS Modules.
- **Nota**: El icono siempre es 1.25em relativo al font-size (13px), lo que da ~16px. Pasa size=\{16} a los iconos de lucide para match perfecto.
- **Nota**: CSS autocontenido — no necesita tokens ni imports. La animacion de rotacion es puro CSS (data-icon-button-animate), no requiere GSAP.
