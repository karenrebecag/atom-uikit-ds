<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Inline pending state:

```tsx
import { Spinner } from '@/components/atoms/Spinner';

<Spinner size="m" />
```

## Accesibilidad

- Root already exposes `role="status"` and `aria-label="Loading"` — do not nest another live region around it.
- Pair with disabled buttons or reserved layout so users know *what* is loading.

## Cuándo no usar

- Full card/page content placeholders → `Skeleton`.
- Blocking modal progress with a determinate bar → progress patterns, not an endless spinner alone.
