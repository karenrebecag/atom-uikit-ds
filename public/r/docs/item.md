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

## Criterio de uso

- Usa Item para filas con una jerarquía clara de media, título, descripción y acción; mantén el contenido secundario breve.
- Si la fila navega, usa `href` para conservar semántica, foco, historial y abrir en nueva pestaña.
- Usa `variant` y `size` para expresar densidad y agrupación, no para convertir cada fila en una tarjeta visual independiente.

## Gotchas

- Un Item clickeable sin `href` necesita teclado, role y estados equivalentes; es preferible un enlace real cuando el destino es navegación.
- Los slots deben conservar orden lógico para tecnologías asistivas: título antes de metadatos y acción con nombre claro.
