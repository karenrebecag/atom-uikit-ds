<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Searchable country picker:

```tsx
import {
  Combobox, ComboboxInput, ComboboxContent, ComboboxItem,
} from '@/components/molecules/Combobox';

<Combobox value={v} onValueChange={setV}>
  <ComboboxInput placeholder="Search country" />
  <ComboboxContent>
    <ComboboxItem value="mx">Mexico</ComboboxItem>
    <ComboboxItem value="us">United States</ComboboxItem>
  </ComboboxContent>
</Combobox>
```

## Accesibilidad

- Pair with `Field` + label; keep arrow keys / Enter / Escape on the input — do not replace it with a non-textbox.
- Portal content can mismatch on first paint in SSR — open the list on the client when needed.

## Cuándo no usar

- Fewer than ~5 fixed options with no search need → `Select` / radio list.
- Free-form text without a closed list → `Input` / `Textarea`.

## Criterio de uso

- Usa Combobox cuando la lista es larga o desconocida y escribir es mas rapido que buscar; por debajo de ~7 opciones, `Select` es mejor.
- `autoHighlight` acelera al usuario que escribe y confirma con Enter; desactivalo si una seleccion accidental es costosa.
- Muestra siempre un estado vacio util: "sin resultados para X" con la opcion de limpiar.

## Gotchas

- Tiene DOS estados controlados independientes (`value` y `open`): confundirlos deja el panel abierto tras elegir o el valor congelado.
- El filtrado es responsabilidad del consumidor: el componente no decide que coincide.
