<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Separate stacked blocks:

```tsx
import { Divider } from '@/components/atoms/Divider';

<section>…</section>
<Divider orientation="horizontal" />
<section>…</section>
```

## Accesibilidad

- Vertical sets `role="separator"` and `aria-orientation="vertical"`; horizontal is a plain `hr`.
- Do not use dividers as the only way to express hierarchy — keep headings.

## Cuándo no usar

- Spacing alone without a rule → margin/gap utilities.
- Interactive split panes → `Resizable`, not a static divider.
