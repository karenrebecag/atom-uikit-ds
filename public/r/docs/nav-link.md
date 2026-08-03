<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Active route in a nav list:

```tsx
import { NavLink } from '@/components/atoms/NavLink';

<NavLink href="/docs" size="default" active>
  Docs
</NavLink>
```

## Accesibilidad

- `children` is a string label; `active` sets `aria-current="page"` — one active link per section.
- `disabled` sets `aria-disabled`; still prefer removing the destination when navigation is blocked.

## Cuándo no usar

- Page CTAs that leave the app shell → `LinkButton` / `Button`.
- Icon-only chrome → `IconButton` with `aria-label`.
