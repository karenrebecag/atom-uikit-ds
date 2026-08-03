<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

```tsx
import { Input } from '@/components/atoms/Input';
import { Field } from '@/components/atoms/Field';

<Field label="Email" error="Required">
  <Input type="email" error placeholder="you@company.com" />
</Field>
```

## Accesibilidad

- Pair with `Field` (label + helper/error) so the control has an accessible name and `aria-describedby`.
- `iconLeft` / `iconRight` are ReactNode slots — do not put interactive buttons inside without keyboard support.

## Cuándo no usar

- Multi-line free text → `Textarea`.
- Choosing from a fixed list → `Select` / `Combobox`.
