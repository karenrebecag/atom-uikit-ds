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

### Correcto

- role='listbox' en el trigger, role='option' en cada item
- aria-expanded refleja el estado open/closed
- aria-selected='true' en el item seleccionado
- aria-disabled en items desactivados
- aria-invalid en trigger cuando `invalid={true}`
- Escape cierra el dropdown — comportamiento estandar
- Arrow keys navegan items sin necesidad de mouse

### Evitar

- No usar Select para listas largas (+50 items) — usar Combobox con busqueda
- No omitir placeholder — sin el, el trigger vacio no comunica proposito
- No mezclar con `<select>` nativo — el componente custom ya maneja ARIA

## Cuándo no usar

- Large searchable catalogs → `Combobox`.
- Multi-select filters → `ToggleGroup type="multiple"` or checkboxes.

## Criterio de uso

- Usa `Select` para una elección única de un conjunto conocido; si hay muchas opciones o búsqueda frecuente, cambia a `Combobox`.
- Mantén el trigger como el punto de foco y deja que el menú gestione teclado, selección y cierre; no lo sustituyas por un `div` clickeable.
- En modo controlado, sincroniza `value` con `onValueChange`; el estado de apertura es independiente y sólo debe controlarse cuando el flujo lo necesite.

## Gotchas

- El portal del contenido puede requerir montaje client-side en SSR; no acoples la lógica de selección al primer render del menú abierto.
- El label y el valor seleccionado deben seguir siendo comprensibles sin depender sólo del color o del icono.
- **Nota**: No requiere GSAP. Todas las animaciones son CSS puro (@keyframes + transitions).

## Navegacion por teclado

| Tecla | Accion |
| --- | --- |
| Enter / Space | Abre el dropdown (si cerrado). Selecciona item highlighted (si abierto). |
| Arrow Down | Abre dropdown (si cerrado). Mueve highlight al siguiente item. |
| Arrow Up | Mueve highlight al item anterior. |
| Escape | Cierra el dropdown. |
| Click fuera | Cierra el dropdown (mousedown listener en document). |
