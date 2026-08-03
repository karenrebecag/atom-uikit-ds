<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Inbox count / quiet status:

```tsx
import { Badge } from '@/components/atoms/Badge';

<Badge variant="neutral" state="enabled">3</Badge>
<Badge variant="success">Live</Badge>
```

## Accesibilidad

- If the badge is the only indicator of state, include text (not color alone): “3 unread”, not a bare red dot without a name.
- Decorative badges next to already-named headings can be `aria-hidden` when they add no new information.

## Cuándo no usar

- Interactive filters users click to toggle → `Chip` / `Tag` patterns meant for actions.
- Category metadata chips that are purely labels → `Tag` may fit better than a count-oriented badge.
