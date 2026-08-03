<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Checkout progress:

```tsx
import { Stepper } from '@/components/atoms/Stepper';

<Stepper
  orientation="horizontal"
  steps={[
    { state: 'completed', title: 'Cart', description: 'Items saved' },
    { state: 'active', title: 'Payment' },
    { state: 'upcoming', title: 'Confirm' },
  ]}
/>
```

## Accesibilidad

- Root is `role="list"` with `aria-label="Progress steps"`; the active step sets `aria-current="step"`.
- Titles must be unique and human-readable — numbers alone are not enough.

## Cuándo no usar

- Single-page forms with no sequence — use headings / sections, not a stepper.
- Tabs that switch content panels → `Tabs` (not a progress metaphor).
