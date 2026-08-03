<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Instant preference:

```tsx
import { Toggle } from '@/components/atoms/Toggle';

<Toggle
  label="Show activity status"
  checked={showStatus}
  onChange={setShowStatus}
/>
```

## Accesibilidad

- Prefer the built-in `label` (or `aria-label`) — a naked switch has no accessible name.
- `onChange` fires for immediate prefs; do not rely on a separate submit for the only state change.

## Cuándo no usar

- Form multi-select or “agree to terms” → `Checkbox`.
- Choosing one of many plans → `Radio` group.
