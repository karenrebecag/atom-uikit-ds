<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Card placeholder while loading:

```tsx
import { Skeleton } from '@/components/atoms/Skeleton';

<div aria-busy="true" aria-live="polite">
  <Skeleton variant="default" />
  <Skeleton variant="default" />
</div>
```

## Accesibilidad

- Mark the loading region with `aria-busy="true"` (and optionally `aria-live`) on the container — skeleton shapes alone are not announced as “loading”.
- Replace skeletons with real content; do not leave them permanently on screen.

## Cuándo no usar

- Indeterminate wait without layout reservation → `Spinner`.
- Avatar-specific loading face → `Avatar skeleton` prop when that control owns the slot.
