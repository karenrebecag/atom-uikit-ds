<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Bio with validation:

```tsx
import { Textarea } from '@/components/atoms/Textarea';
import { Field } from '@/components/atoms/Field';

<Field label="Bio" htmlFor="bio" error={err} description="Max 280 characters">
  <Textarea id="bio" error={!!err} rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
</Field>
```

## Accesibilidad

- Always pair with `Field` (or an explicit `<label htmlFor>`).
- `error` is visual on the control — put the message string on `Field` for `role="alert"`.

## Cuándo no usar

- Single-line values (email, name) → `Input`.
- Structured choices → `Select` / `Combobox`, not a free-text box.
