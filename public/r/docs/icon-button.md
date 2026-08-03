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

## Cuándo no usar

- Actions that need a visible text label → `Button`.
- Navigation with a URL → `LinkButton` (or a real link), not an icon button that only looks like navigation.
