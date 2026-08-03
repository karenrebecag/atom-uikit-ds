<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Secondary CTA that navigates:

```tsx
import { LinkButton } from '@/components/atoms/LinkButton';

<LinkButton href="https://docs.example.com" size="default" animated>
  Read the docs
</LinkButton>
```

## Accesibilidad

- Ships as a real `<a href>` — keep a clear text label in `children` (string only).
- Default `target="_blank"` + `rel="noopener noreferrer"`: warn users when leaving the app, or override `target` for same-tab in-app routes.
- `disabled` sets `aria-disabled` but still renders an anchor — prefer removing the link or blocking navigation in the router when inactive.

## Cuándo no usar

- In-page actions without navigation → `Button`.
- Icon-only chrome → `IconButton`.
