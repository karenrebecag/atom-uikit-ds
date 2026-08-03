<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Selected filter chip:

```tsx
import { Chip } from '@/components/atoms/Chip';

<Chip type="filled" size="s" onClose={() => {}}>
  Design
</Chip>
```

## Accesibilidad

- `onClose` must have an accessible name (`aria-label` on the close control).
- The visual prop is named `type` (not `variant`) — keep labels in sync with registry.

## Cuándo no usar

- Tags that are not interactive status labels should use `Tag`, not `Chip`.
