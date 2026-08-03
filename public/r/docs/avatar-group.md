<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Team row with overflow:

```tsx
import { AvatarGroup } from '@/components/atoms/AvatarGroup';
import { Avatar } from '@/components/atoms/Avatar';

<AvatarGroup size="s" max={3}>
  <Avatar type="image" src="/u/1.jpg" alt="A" />
  <Avatar type="image" src="/u/2.jpg" alt="B" />
  <Avatar type="image" src="/u/3.jpg" alt="C" />
  <Avatar type="image" src="/u/4.jpg" alt="D" />
</AvatarGroup>
```

## Accesibilidad

- Each child `Avatar` still needs its own name (`alt` / `aria-label`).
- Overflow “+N” is visual — provide a textual count nearby when the full roster matters (e.g. “4 assignees”).

## Cuándo no usar

- Single person → `Avatar`.
- Editable assignee pickers that need full names listed → list/`Item` rows, not only a face stack.
