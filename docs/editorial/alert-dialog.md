<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Destructive confirm:

```tsx
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/atoms/AlertDialog';

<AlertDialog>
  <AlertDialogTrigger><button type="button">Delete</button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete project?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel />
      <AlertDialogAction variant="destructive-primary" onAction={() => {}} />
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Accesibilidad

- `role="alertdialog"` + body scroll lock; Escape cancels. Overlay does **not** click-dismiss — require Cancel/Action.
- Use `destructive-primary` on Action only for irreversible ops.

## Cuándo no usar

- Multi-field forms or rich content → `Dialog`.
- Non-blocking tips → toast / inline text, not a blocking alert.

## Criterio de uso

- Reserva AlertDialog para decisiones destructivas o irreversibles: borrar, revocar, cancelar algo en curso.
- El titulo debe nombrar la consecuencia, no la accion: "Se eliminaran 3 archivos" informa mas que "Confirmar".
- No lo uses para exito o informacion: interrumpir sin una decision real entrena a cerrar sin leer.

## Gotchas

- A diferencia de Dialog, cerrar por fuera NO debe interpretarse como confirmacion: la accion destructiva solo ocurre en su boton.
- La accion peligrosa va en `destructive-primary` y nunca como boton por defecto del foco inicial.
