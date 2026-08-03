<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Account header block:

```tsx
import { UserProfile } from '@/components/atoms/UserProfile';

<UserProfile
  name="Ada Lovelace"
  org="Analytical Engines"
  avatar={{ type: 'initials', size: 's' }}
/>
```

## Accesibilidad

- `name` is required. Initials default from the name; when using image avatars, pass meaningful `alt` via `avatar` props.
- Treat as a presentational cluster — interactive menus belong on a surrounding button/menu, not only on the faces.

## Cuándo no usar

- Single avatar without name/org → `Avatar`.
- Dense assignee stacks → `AvatarGroup`.
