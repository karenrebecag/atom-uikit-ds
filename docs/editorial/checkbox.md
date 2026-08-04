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

### Correcto

- Input nativo `<input type='checkbox'>` maneja el estado — screen readers lo leen correctamente
- Touch target de 40x40px (input invisible expandido) cumple WCAG minimum 44px aprox
- Label envuelve todo el componente — click en el texto tambien togglea
- focus-visible muestra ring solo por teclado, no por click
- data-indeterminate + ref.indeterminate para el estado parcial
- Disabled remueve del tab order via atributo disabled nativo

### Evitar

- No usar Checkbox sin label en contextos donde no hay otro indicador visual
- No simular checkbox con divs — el input nativo ya maneja ARIA internamente
- No usar error sin explicar el motivo (combinar con Field o texto de ayuda)

## Cuándo no usar

- Exactly one of many options → `Radio` group.
- Instant on/off preference with a switch affordance → `Toggle`.

## Criterio de uso

- Usa checkbox para selecciones independientes o para aceptar una condición explícita; varias opciones pueden quedar activas al mismo tiempo.
- El estado indeterminate representa una relación parcial, como “algunos hijos seleccionados”; no lo trates como un tercer valor persistente.
- En filtros, aplica la selección sin perder contexto y comunica cuántos resultados cambian cuando el efecto no es obvio.

## Gotchas

- El estado indeterminate es visual: mantén el estado accesible y el texto circundante sincronizados.
- No uses checkbox para una decisión mutuamente excluyente; en ese caso el usuario necesita `Radio`.
- **Ojo**: Para indeterminate en vanilla, necesitas JS: document.querySelector('.checkbox__input').indeterminate = true. El atributo data-indeterminate activa los estilos CSS pero no el estado nativo.
