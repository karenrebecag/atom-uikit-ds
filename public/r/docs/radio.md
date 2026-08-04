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

### Correcto

- Input nativo `<input type='radio'>` — screen readers lo leen como radio button
- name compartido entre opciones del mismo grupo para exclusion mutua nativa
- Touch target 40x40px cumple WCAG
- Arrow keys navegan entre opciones del mismo name (comportamiento nativo)
- Label clickeable — click en el texto selecciona la opcion
- focus-visible ring solo por teclado

### Evitar

- No usar Radio sin name — las opciones no seran mutuamente excluyentes
- No usar Radio para toggles on/off — usar Checkbox o Toggle en su lugar
- No usar un solo Radio — siempre son 2+ opciones en un grupo

## Cuándo no usar

- Multi-select → `Checkbox` / `ToggleGroup type="multiple"`.
- On/off for a single preference → `Toggle` / one `Checkbox`.

## Criterio de uso

- Úsalo cuando las opciones son mutuamente excluyentes y el usuario necesita comparar alternativas antes de elegir una.
- Muestra todas las opciones relevantes cuando el conjunto es pequeño; para listas largas considera `Select` o `Combobox`.
- Mantén una opción seleccionada cuando el formulario exige una elección y valida el grupo como una unidad.

## Gotchas

- Todos los radios del grupo comparten `name` y deben vivir bajo un `fieldset` con `legend` o un label equivalente.
- No dependas del placeholder ni de una diferencia de color para comunicar la opción seleccionada.
- **Nota**: La unica diferencia visual con Checkbox: border-radius 9999px (circular vs 4px cuadrado) y dot interno con scale animation en vez de check/minus SVG icon.
- **Nota**: CSS autocontenido. La animacion del dot (scale 0→1) es puro CSS via :checked selector — no necesita JS para la transicion.
