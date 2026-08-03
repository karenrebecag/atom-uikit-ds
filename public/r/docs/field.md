<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Labeled control with error:

```tsx
import { Field } from '@/components/atoms/Field';
import { Input } from '@/components/atoms/Input';

<Field label="Email" htmlFor="email" error={err} required>
  <Input id="email" type="email" error={!!err} />
</Field>
```

## Accesibilidad

- Pass `htmlFor` matching the child control `id`, or wrap a single native control so the label associates.
- `error` renders with `role="alert"`; prefer one clear message, not duplicated helper + error at once.

## Cuándo no usar

- Decorative headings above non-form UI — use Typography, not Field.
- Field does not render the input itself — always provide `Input` / `Select` / `Textarea` / etc. as children.
