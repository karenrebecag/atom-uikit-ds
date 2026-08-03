<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Mobile filters:

```tsx
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader,
  DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter,
} from '@/components/atoms/Drawer';

<Drawer>
  <DrawerTrigger><button type="button">Filters</button></DrawerTrigger>
  <DrawerContent direction="bottom">
    <DrawerHeader>
      <DrawerTitle>Filters</DrawerTitle>
      <DrawerDescription>Narrow the list.</DrawerDescription>
    </DrawerHeader>
    <DrawerBody>{/* controls */}</DrawerBody>
    <DrawerFooter><button type="button">Apply</button></DrawerFooter>
  </DrawerContent>
</Drawer>
```

## Accesibilidad

- `role="dialog"` `aria-modal`; Escape and overlay close. Prefer bottom on mobile, side for desktop filters.
- `direction` is on `DrawerContent` (default bottom); drag past threshold dismisses.

## Cuándo no usar

- Centered multi-field tasks → `Dialog`.
- Permanent app navigation → `Sidebar`.
