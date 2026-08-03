<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Mutually exclusive plan:

```tsx
import { Radio } from '@/components/atoms/Radio';

<fieldset>
  <legend>Billing period</legend>
  <Radio name="period" label="Monthly" checked={period === 'm'} onChange={() => setPeriod('m')} />
  <Radio name="period" label="Yearly" checked={period === 'y'} onChange={() => setPeriod('y')} />
</fieldset>
```

## Accesibilidad

- Share the same `name` across options in a group; prefer a `fieldset` + `legend` (or `Field`) for the group name.
- Built-in `label` associates text with the control; do not rely on placeholder text alone.

## Cuándo no usar

- Multi-select → `Checkbox` / `ToggleGroup type="multiple"`.
- On/off for a single preference → `Toggle` / one `Checkbox`.
