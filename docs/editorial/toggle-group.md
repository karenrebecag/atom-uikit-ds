<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

View switch (single select):

```tsx
import { ToggleGroup, ToggleGroupItem } from '@/components/atoms/ToggleGroup';

<ToggleGroup type="single" value={view} onValueChange={setView} size="m">
  <ToggleGroupItem value="list">List</ToggleGroupItem>
  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
</ToggleGroup>
```

## Accesibilidad

- Each `ToggleGroupItem` needs a visible label or `aria-label`.
- In forms, wrap with a labelled fieldset/`Field` so the group has an accessible name.
- `type="single"` stores one string; `multiple` stores `string[]` — keep controlled state types in sync.

## Cuándo no usar

- Binary on/off for one setting → `Toggle` / `Checkbox`.
- Navigation across routes → links or tabs with URLs, not a toggle group that only looks like nav.
