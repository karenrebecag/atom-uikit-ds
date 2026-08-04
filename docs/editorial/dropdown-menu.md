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

## Criterio de uso

- Usa DropdownMenu para acciones sobre un objeto, no para elegir un valor de formulario — para eso existe `Select`.
- Agrupa por consecuencia y deja las destructivas al final, separadas; el orden importa mas que el icono.
- Cierra el menu al ejecutar una accion salvo que sea un toggle que el usuario querra repetir.

## Gotchas

- Es controlado: si `onOpenChange` no actualiza el estado, el menu queda abierto tras seleccionar.
- Un item que abre otro overlay debe cerrar el menu primero; encadenarlos deja dos capas compitiendo por el foco.
