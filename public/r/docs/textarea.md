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

### Correcto

- aria-invalid='true' se agrega automaticamente con `error={true}`
- disabled remueve del tab order y desactiva resize
- Focus ring visible para navegacion por teclado
- Usar dentro de Field para label + mensaje de error asociados via htmlFor/id
- rows controla la altura inicial visible — mejor UX que min-height CSS

### Evitar

- No usar placeholder como label — desaparece al escribir
- No desactivar resize globalmente — los usuarios necesitan ajustar altura para textos largos
- No usar Textarea para input de una linea — usa Input en su lugar

## Cuándo no usar

- Single-line values (email, name) → `Input`.
- Structured choices → `Select` / `Combobox`, not a free-text box.

## Criterio de uso

- Define `rows` según la respuesta esperada; un área demasiado pequeña obliga a editar dentro de un viewport incómodo, especialmente en móvil.
- Para notas largas, comunica límite o tamaño esperado con `Field` y valida sin borrar texto durante la edición.
- Si el valor tiene estructura conocida, usa un control especializado en lugar de pedir formato libre.

## Gotchas

- `error` en `Textarea` cambia la superficie visual; el mensaje humano debe vivir en `Field` para que el error sea anunciado.
- Conserva el label visible aunque el placeholder incluya un ejemplo.
- **Nota**: La diferencia clave con Input: line-height 1.5 (multi-linea), min-height 80px en vez de height fijo 40px, padding en los 4 lados en vez de solo horizontal, y resize: vertical habilitado.
- **Nota**: CSS autocontenido. Mismos colores y focus rings que Input standalone.
