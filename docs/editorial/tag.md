<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Category metadata:

```tsx
import { Tag } from '@/components/atoms/Tag';

<Tag variant="filled" intent="neutral" size="s">Design system</Tag>
<Tag variant="outline" intent="success" size="s" dot>Stable</Tag>
```

## Accesibilidad

- Tags are labels, not buttons — do not attach click handlers without turning them into real controls with roles and keyboard support.
- Color/`intent` must not be the only cue; keep the text label meaningful.

### Correcto

- Tag es un `<span>` no interactivo — correcto para metadata y status display
- Avatar img tiene alt='' (decorativo) — el texto del label es lo accesible
- Dot usa currentColor — cambia con el intent automaticamente
- Ellipsis con max-width 200px previene overflow en layouts

### Evitar

- No usar Tag para acciones — usar Chip (con onClose) o Button
- No depender solo del color del intent para comunicar estado — acompanar con texto descriptivo
- No usar intent='ai' para contenido no generado por AI — es un indicador semantico
- No pasar dot + icon + avatar juntos — elegir uno

## Cuándo no usar

- Dismissible / selectable filters → `Chip` (interactive).
- Numeric counts on icons → `Badge`.

## Criterio de uso

- Usa Tag para clasificar o describir contenido; el texto debe seguir siendo útil si se quita el color y el dot.
- Reserva `success`, `warning` y `danger` para estados con significado real; `brand` y `ai` deben funcionar como énfasis, no como semántica inventada.
- Mantén las etiquetas cortas. Si el usuario necesita seleccionar, quitar o cambiar el valor, usa `Chip` o un control explícito.

## Gotchas

- Tag no es interactivo por defecto: no lo conviertas en botón sólo con un click handler.
- No uses un Tag como banner de alerta; para mensajes que requieren atención usa un patrón de feedback.
- **Nota**: CSS autocontenido. Tag no tiene hover, transiciones ni animaciones — es puramente visual. Los 24 combos de color (3 variantes x 8 intents) estan hardcoded.
