<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Selectable list row:

```tsx
import {
  Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions,
} from '@/components/atoms/Item';

<Item variant="outline" size="default" href="/docs">
  <ItemMedia variant="icon">{/* icon */}</ItemMedia>
  <ItemContent>
    <ItemTitle>Docs</ItemTitle>
    <ItemDescription>Guides and API</ItemDescription>
  </ItemContent>
  <ItemActions>→</ItemActions>
</Item>
```

## Accesibilidad

- With `href`, root renders `<a>`; otherwise `<div>` — add keyboard handlers/role if clickable without href.
- Prefer real links for navigation so open-in-new-tab and middle-click work.

## Cuándo no usar

- Form options in a closed list → `Select` / `Radio`.
- Dense data grids → `Table`.
