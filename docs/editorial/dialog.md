<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Focused edit task:

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogBody, DialogFooter,
} from '@/components/atoms/Dialog';

<Dialog>
  <DialogTrigger><button type="button">Edit</button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Update your public name.</DialogDescription>
    </DialogHeader>
    <DialogBody>{/* fields */}</DialogBody>
    <DialogFooter><button type="button">Save</button></DialogFooter>
  </DialogContent>
</Dialog>
```

## Accesibilidad

- `role="dialog"` `aria-modal`; Escape + overlay click close; body scroll locks. Always include `DialogTitle`.
- `showCloseButton` lives on `DialogContent` (default true).

## Cuándo no usar

- Binary destructive confirms → `AlertDialog`.
- Edge panels on mobile → `Drawer` / `Sheet`.

## Criterio de uso

- Usa Dialog para una tarea corta que necesita el contexto de la pagina detras: editar un campo, confirmar detalles, ver un resumen.
- El estado vive fuera (`open` / `onOpenChange`): el componente no decide cuando abrirse, y eso permite abrir desde una ruta, un atajo o una respuesta del servidor.
- Da siempre una salida visible ademas de Escape; un overlay sin boton de cerrar deja fuera a quien navega con puntero.

## Gotchas

- Al ser controlado, olvidar `onOpenChange` deja el dialogo imposible de cerrar: Escape y el overlay llaman a ese callback, no a un estado interno.
- El foco entra al abrir y debe volver al disparador al cerrar; si abres desde un menu que ya se desmonto, guarda la referencia antes.
