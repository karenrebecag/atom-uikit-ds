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
