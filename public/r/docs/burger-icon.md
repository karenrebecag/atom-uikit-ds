<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Mobile nav toggle (icon only — pair with a control that has a name):

```tsx
import { BurgerIcon } from '@/components/atoms/BurgerIcon';
import { IconButton } from '@/components/atoms/IconButton';

<IconButton
  variant="tertiary"
  size="m"
  aria-label={open ? 'Close menu' : 'Open menu'}
  aria-expanded={open}
  icon={<BurgerIcon />}
  onClick={() => setOpen((v) => !v)}
/>
```

## Accesibilidad

- `BurgerIcon` is decorative markup (three lines). Put the accessible name on the wrapping button (`aria-label` / `aria-expanded`), never on the icon alone.
- Morph-to-close is visual only — keep the label in sync with open/closed state.

## Cuándo no usar

- Not a standalone interactive control — always wrap in `IconButton` (or equivalent button).
- Not for desktop primary nav chrome when a labeled text control is clearer.
