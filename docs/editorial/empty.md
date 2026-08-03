<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Zero results with recovery CTA:

```tsx
import {
  Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent,
} from '@/components/atoms/Empty';

<Empty variant="outline">
  <EmptyHeader>
    <EmptyMedia variant="icon">{/* icon */}</EmptyMedia>
    <EmptyTitle>No projects</EmptyTitle>
    <EmptyDescription>Create one to get started.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><button type="button">New project</button></EmptyContent>
</Empty>
```

## Accesibilidad

- Title should explain the empty state; put recovery actions in `EmptyContent`.
- Decorative media can be `aria-hidden` when the title already carries the meaning.

## Cuándo no usar

- Loading placeholders → `Skeleton` / `Spinner`.
- Error failures with retry of a failed request → error banner/toast + retry, not a first-run empty.
