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

### Correcto

- aria-invalid='true' se agrega automaticamente cuando `error={true}`
- `disabled={true}` remueve del tab order y anuncia como no disponible
- Focus ring visible (box-shadow 2px) para navegacion por teclado
- Error ring rojo distinto del focus ring gris — distinguibles visualmente
- Usa Input dentro de Field para label + mensaje de error asociados
- placeholder no reemplaza un `<label>` — siempre usa label via Field

### Evitar

- No usar placeholder como unico indicador del campo — desaparece al escribir
- No usar error sin mensaje explicativo (usa Field con helperText)
- No cambiar el height — 40px coincide con Button m para alineacion en forms

## Cuándo no usar

- Multi-line free text → `Textarea`.
- Choosing from a fixed list → `Select` / `Combobox`.

## Criterio de uso

- Úsalo para valores de una sola línea y acompáñalo siempre de `Field` cuando necesite label, ayuda o error.
- Activa `error` sólo después de una validación fallida y muestra el motivo junto al control; el borde por sí solo no explica qué corregir.
- Reserva `iconLeft` y `iconRight` para información o affordances no interactivas. Una acción dentro del campo necesita su propio foco y nombre accesible.

## Gotchas

- El `id` del input debe coincidir con `htmlFor` del label y los mensajes de `Field` deben quedar asociados mediante descripción accesible.
- No uses placeholder como sustituto del label: desaparece al escribir y no comunica el propósito de forma persistente.
- **Nota**: Input height (40px) coincide con Button size='m' (40px). Siempre usa el mismo tamano de boton que de input en un form.
- **Nota**: CSS autocontenido. El input-group es el wrapper para iconos — si no usas iconos, solo necesitas .input.
