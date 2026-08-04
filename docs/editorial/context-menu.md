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

## Criterio de uso

- Usa ContextMenu solo como ATAJO de acciones que tambien existen en la interfaz visible: es descubrible por accidente, nunca por diseno.
- Util en superficies densas (tablas, canvas, listas) donde poner un boton por fila satura.
- Repite en el menu la accion primaria de la fila para que quien lo abre no tenga que salir a buscarla.

## Gotchas

- No tiene prop `open`: el disparador es el click derecho del navegador, y esa es toda su superficie de activacion.
- En tactil no existe el click derecho: si una accion solo vive aqui, en movil es inalcanzable.
