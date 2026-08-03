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
