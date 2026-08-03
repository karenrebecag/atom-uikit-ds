<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Aligned toolbar of related actions:

```tsx
import { ButtonGroup, ButtonGroupSeparator } from '@/components/atoms/ButtonGroup';
import { Button } from '@/components/atoms/Button';

<ButtonGroup orientation="horizontal" aria-label="Document actions">
  <Button variant="secondary" size="s">Edit</Button>
  <ButtonGroupSeparator />
  <Button variant="secondary" size="s">Share</Button>
  <Button variant="primary" size="s">Publish</Button>
</ButtonGroup>
```

## Accesibilidad

- Root exposes `role="group"` — always pass `aria-label` (or `aria-labelledby`) describing the set of actions.
- Separators are `aria-hidden`; do not put meaning only in the divider.

## Cuándo no usar

- Free-floating unrelated buttons in a page section — use spacing/layout, not `ButtonGroup`.
- Single primary CTA — use one `Button`, not a group of one.
