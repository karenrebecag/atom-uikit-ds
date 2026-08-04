<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

View switch (single select):

```tsx
import { ToggleGroup, ToggleGroupItem } from '@/components/atoms/ToggleGroup';

<ToggleGroup type="single" value={view} onValueChange={setView} size="m">
  <ToggleGroupItem value="list">List</ToggleGroupItem>
  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
</ToggleGroup>
```

## Accesibilidad

- Each `ToggleGroupItem` needs a visible label or `aria-label`.
- In forms, wrap with a labelled fieldset/`Field` so the group has an accessible name.
- `type="single"` stores one string; `multiple` stores `string[]` — keep controlled state types in sync.

### Correcto

- role='group' en el container
- role='radio' + aria-checked en cada item (type=single)
- aria-disabled en items desactivados
- Icon-only items necesitan aria-label (no hay texto visible)
- focus-visible ring inset (outline-offset negativo) para no romper el layout

### Evitar

- No usar ToggleGroup como tabs de navegacion — usar Tabs para eso
- No mezclar text items con icon-only items en el mismo grupo — inconsistencia visual
- No usar type='multiple' con mas de 5-6 opciones — usar Checkbox list en su lugar

## Cuándo no usar

- Binary on/off for one setting → `Toggle` / `Checkbox`.
- Navigation across routes → links or tabs with URLs, not a toggle group that only looks like nav.

## Criterio de uso

- Usa `type="single"` para cambiar una vista o modo y `type="multiple"` para filtros independientes.
- Mantén etiquetas cortas pero inequívocas; si el grupo representa un campo del formulario, añade un nombre al conjunto.
- En interfaces densas prefiere `m` o `s` y deja `animated` apagado cuando el cambio se repite con frecuencia.

## Gotchas

- El modo controlado requiere que el tipo del estado coincida: un string para `single`, un arreglo para `multiple`.
- No lo uses como navegación si cada opción debe tener URL, historial o deep link.
- **Nota**: Icon-only items son cuadrados (width = height). Se detecta automaticamente cuando children no es un string.
- **Ojo**: El CSS standalone requiere JS para toggle de la clase --active. El componente React lo maneja internamente via Context. Para vanilla, toggle la clase manualmente en onClick.
- **Nota**: La animacion de text swap reutiliza la misma estructura de Button: .button__label > .button__label-inner > .button__text.is--default + .button__text.is--hover. El ToggleGroupItem genera este markup cuando animated=\{true} y children es string.
