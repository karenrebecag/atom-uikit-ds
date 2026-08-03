<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Multi-select with label:

```tsx
import { Checkbox } from '@/components/atoms/Checkbox';

<Checkbox
  label="Email me product updates"
  checked={optIn}
  onChange={setOptIn}
/>
```

Parent row with partial selection:

```tsx
<Checkbox
  label="Select all"
  checked={all ? true : some ? 'indeterminate' : false}
  onChange={toggleAll}
/>
```

## Accesibilidad

- Prefer the built-in `label` prop (associates the control). If you omit it, supply an external label via `id`/`htmlFor` or `aria-label`.
- `checked="indeterminate"` is for “some children selected” — still expose the result in surrounding UI text when it matters.

## Cuándo no usar

- Exactly one of many options → `Radio` group.
- Instant on/off preference with a switch affordance → `Toggle`.
