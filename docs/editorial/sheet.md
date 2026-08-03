<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Side settings panel:

```tsx
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader,
  SheetTitle, SheetDescription, SheetBody,
} from '@/components/atoms/Sheet';

<Sheet>
  <SheetTrigger><button type="button">Open</button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Tune preferences.</SheetDescription>
    </SheetHeader>
    <SheetBody>{/* fields */}</SheetBody>
  </SheetContent>
</Sheet>
```

## Accesibilidad

- Modal sheet locks body scroll; Escape and overlay close. Include a clear title.
- `side` (default **right**) and `showCloseButton` live on `SheetContent`.

## Cuándo no usar

- Centered short forms → `Dialog`.
- Drag-from-edge mobile patterns with handle → `Drawer` may fit better.
