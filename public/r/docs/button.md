<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Marketing CTA with motion:

```tsx
import { Button } from '@/components/atoms/Button';

<Button variant="primary" size="l" animated>
  Get started
</Button>
```

Form submit with busy state:

```tsx
<Button type="submit" loading={pending} disabled={pending}>
  Save changes
</Button>
```

## Accesibilidad

- Keep a clear accessible name; icon-only usage belongs on `icon-button`, not `button` with empty children.
- Prefer explaining why a control is disabled nearby — a dead button alone fails WCAG name/purpose.

## Cuándo no usar

- Not for navigation to another page — use `link-button` (real `href`).
- Not for pure icon chrome — use `icon-button` with `aria-label`.
