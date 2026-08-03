<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Overflow actions on a trigger:

```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/atoms/DropdownMenu';

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent side="bottom" align="start">
    <DropdownMenuItem onSelect={() => {}}>Edit</DropdownMenuItem>
    <DropdownMenuItem variant="destructive" onSelect={() => {}}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Accesibilidad

- Trigger exposes `aria-expanded` and `aria-haspopup="menu"`; keep items activatable with Enter/Space.
- Controlled mode needs `open` + `onOpenChange` together.

## Cuándo no usar

- Always-visible primary actions → toolbar `Button`s.
- Right-click-only row menus → `ContextMenu` (still offer a visible alternative).
