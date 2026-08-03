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
