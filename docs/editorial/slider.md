<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Volume-style range:

```tsx
import { Slider } from '@/components/atoms/Slider';
import { Field } from '@/components/atoms/Field';

<Field label="Volume">
  <Slider min={0} max={100} step={5} value={volume} onValueChange={setVolume} />
</Field>
```

## Accesibilidad

- Expose the live value in nearby text or `aria-valuetext` when the unit is not obvious (% vs currency).
- Keep `min` / `max` / `step` consistent with the visible unit; keyboard must still move the thumb.

## Cuándo no usar

- Discrete few options (S/M/L) → `ToggleGroup` or `Select`.
- Free numeric entry with high precision typing → `Input type="number"`.
