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

## Criterio de uso

- Usa Drawer cuando el panel es el foco principal de la interaccion y puede ocupar casi toda la pantalla: formularios largos, listas filtrables.
- Es la eleccion natural en movil donde Dialog resulta estrecho y Sheet corto.
- Mantén el encabezado y las acciones visibles mientras el cuerpo hace scroll.

## Gotchas

- El contenido largo necesita scroll en el cuerpo, no en toda la pagina: si el fondo tambien se desplaza, cerrar devuelve al usuario a otra posicion.
- Comparte contrato controlado con Dialog y Sheet; el criterio de eleccion es de tamano y foco, no tecnico.
