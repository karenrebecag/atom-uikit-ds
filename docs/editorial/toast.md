<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

App-wide toaster + imperative API:

```tsx
import { Toaster, toast } from '@/components/atoms/Toast';

// once in layout:
<Toaster position="bottom-right" />

// on event:
toast.success('Saved', { description: 'Profile updated' });
toast.error('Could not save', { duration: 6000 });
```

## Accesibilidad

- Each toast is `role="status"` `aria-live="polite"`; default duration ~4000ms (`0` = sticky until dismiss).
- Mount a single `Toaster` at the root — do not nest multiple hosts.

## Cuándo no usar

- Blocking confirms that require a decision → `AlertDialog`.
- Inline field errors → `Field` error text, not a toast.
