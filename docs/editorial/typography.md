<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Page heading + body:

```tsx
import { TypographyH1, TypographyP, TypographyMuted } from '@/components/atoms/Typography';

<TypographyH1>Design system</TypographyH1>
<TypographyP>Ship consistent UI with shared tokens and components.</TypographyP>
<TypographyMuted>Last updated today.</TypographyMuted>
```

## Accesibilidad

- Use the semantic export that matches rank (`TypographyH1`…`H4`) — do not style a `p` to look like an h1.
- Keep one logical h1 per view; nest ranks without skipping levels when possible.

## Cuándo no usar

- Marketing brand wordmarks that need custom art → dedicated logo asset, not type scale hacks.
- Interactive labels (buttons/links) → the control’s own text slot, not a bare Typography wrapper that steals focus semantics.
