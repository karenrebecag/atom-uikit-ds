<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Anchored section rail:

```tsx
import { ProgressNav } from '@/components/atoms/ProgressNav';

<ProgressNav
  items={[
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
  ]}
  cta={{ label: 'Contact', href: '#contact' }}
/>
```

## Accesibilidad

- Root is a `nav`; keep labels short. Section `id`s on the page must match `items[].id`.
- Motion hooks read `data-progress-nav-*` — without them the fill indicator will not track scroll.

## Cuándo no usar

- Discrete checkout steps with state → `Stepper`.
- In-panel tab switching without page sections → `Tabs`.
