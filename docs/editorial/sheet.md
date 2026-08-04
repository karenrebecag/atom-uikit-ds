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

## Criterio de uso

- Usa Sheet para contenido complementario que acompana a la pagina: filtros, detalle de un registro, ayuda contextual.
- Prefierelo a Dialog cuando el usuario necesita alternar entre el panel y la pagina varias veces sin perder el hilo.
- Elige el borde por relacion espacial: lateral para navegacion o filtros; inferior para acciones en movil.

## Gotchas

- Mismo contrato controlado que Dialog (`open`/`onOpenChange`): sin el callback no hay forma de cerrarlo.
- En movil compite con el gesto de volver del sistema; si el contenido es largo, un Drawer con scroll propio se siente mejor.
