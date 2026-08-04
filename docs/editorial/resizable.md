<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Split workspace:

```tsx
import {
  ResizablePanelGroup, ResizablePanel, ResizableHandle,
} from '@/components/atoms/Resizable';

<ResizablePanelGroup orientation="horizontal" panels={2}>
  <ResizablePanel index={0}>Left</ResizablePanel>
  <ResizableHandle index={0} />
  <ResizablePanel index={1}>Right</ResizablePanel>
</ResizablePanelGroup>
```

## Accesibilidad

- Keyboard support lives on the handle; keep a visible affordance (`withHandle` when needed).
- Give the group an explicit height/width or flex grow — zero-size groups cannot be resized meaningfully.

## Cuándo no usar

- Fixed two-column marketing layouts → CSS grid, not draggable panes.
- Mobile single-column flows — prefer stacked sections over split handles.

## Criterio de uso

- Usa Resizable cuando el usuario necesita ajustar la relación entre panes durante una tarea, como editor y preview.
- Define un tamaño inicial razonable y límites que mantengan cada panel útil; dos paneles iguales no siempre son la mejor distribución.
- En pantallas estrechas, cambia a layout apilado en lugar de conservar handles difíciles de manipular.

## Gotchas

- El grupo necesita tamaño explícito o `flex-grow`; un contenedor sin alto o ancho no puede redimensionarse.
- Los índices de panel y handle deben ser contiguos y pertenecer al mismo `ResizablePanelGroup`.
