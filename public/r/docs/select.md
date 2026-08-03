<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Labeled single choice:

```tsx
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/atoms/Select';
import { Field } from '@/components/atoms/Field';

<Field label="Country" htmlFor="country">
  <Select value={country} onValueChange={setCountry}>
    <SelectTrigger id="country" />
    <SelectContent>
      <SelectItem value="mx">Mexico</SelectItem>
      <SelectItem value="us">United States</SelectItem>
    </SelectContent>
  </Select>
</Field>
```

## Accesibilidad

- Pair with `Field` so the trigger has an accessible name.
- Prefer keyboard open (Enter/Space/arrows) — do not replace the trigger with a non-focusable div.

## Cuándo no usar

- Large searchable catalogs → `Combobox`.
- Multi-select filters → `ToggleGroup type="multiple"` or checkboxes.
