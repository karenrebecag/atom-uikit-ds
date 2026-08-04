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

### Correcto

- role='group' en el root agrupa label + control + helper semanticamente
- htmlFor conecta el label con el input — click en label enfoca el input
- field__error tiene role='alert' — screen readers lo anuncian inmediatamente al aparecer
- data-invalid marca el grupo completo como invalido para CSS y assistive tech
- Required asterisco es visual + el input debe tener required attribute para a11y real

### Evitar

- No usar Field sin htmlFor si el control tiene id — la conexion label-input se pierde
- No depender solo del color rojo para comunicar error — el mensaje de texto es obligatorio
- No olvidar pasar `error={true}` al Input/Textarea ademas de error='msg' al Field — son independientes

## Cuándo no usar

- Decorative headings above non-form UI — use Typography, not Field.
- Field does not render the input itself — always provide `Input` / `Select` / `Textarea` / etc. as children.

## Criterio de uso

- Usa `Field` como la unidad semántica de un control: label, ayuda, error y estado deben permanecer alineados.
- Marca `required` sólo cuando el envío realmente dependa del valor y valida igualmente en código; el asterisco no sustituye la validación.
- Presenta un solo mensaje de error accionable y evita duplicar la misma información en helper, tooltip y error.

## Gotchas

- `Field` no crea el control: el hijo debe tener un `id` asociado al label o estar correctamente envuelto.
- `disabled` debe reflejar una razón de producto entendible; si el campo está bloqueado por plan, explica cómo habilitarlo.
- **Nota**: Field no tiene tokens de componente propios — usa solo tokens semanticos (foreground, destructive, muted-foreground, placeholder, spacing-1, font-size-xs).
- **Nota**: CSS autocontenido. Field es puro layout — no tiene transiciones, animaciones ni estados hover. Requiere el CSS del control hijo (Input, Textarea, etc.) por separado.

## Notas de diseño

---

`<Callout type="info">`
Field no pasa props a sus children automaticamente. Si necesitas que el Input tenga error styling, pasale error=\{true} directamente al Input ademas de pasar el mensaje a Field.
`</Callout>`
