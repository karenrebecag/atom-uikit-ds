<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Row actions on right-click:

```tsx
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
} from '@/components/atoms/ContextMenu';

<ContextMenu>
  <ContextMenuTrigger>Invoice #1042</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onSelect={() => {}}>Open</ContextMenuItem>
    <ContextMenuItem variant="destructive" onSelect={() => {}}>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

## Accesibilidad

- Items use `role="menuitem"` — keep short labels; destructive actions need clear wording.
- Primary actions should also be reachable without right-click (row button or `DropdownMenu`) for keyboard/pointer diversity.

## Cuándo no usar

- Always-visible primary actions → toolbar `Button` / `DropdownMenu` on a trigger.
- Mobile-first UIs where long-press is unreliable — prefer an explicit overflow menu.
