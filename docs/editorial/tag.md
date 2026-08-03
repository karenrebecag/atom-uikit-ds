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

## Cuándo no usar

- Dismissible / selectable filters → `Chip` (interactive).
- Numeric counts on icons → `Badge`.
