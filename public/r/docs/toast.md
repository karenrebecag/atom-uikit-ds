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

## Criterio de uso

- Usa Toast para confirmar brevemente un resultado que no requiere decisión ni interrumpe el flujo.
- El mensaje debe nombrar la acción y el resultado; añade descripción o acción de recuperación sólo cuando aporte valor.
- Usa duración sticky (`0`) sólo cuando el usuario necesita tiempo real para leer o actuar; no conviertas cada evento en una interrupción persistente.

## Gotchas

- Monta un solo `Toaster` en el root y dispara la API imperativa desde el evento; no montes árboles declarativos duplicados.
- Para errores asociados a un campo o a una decisión irreversible, coloca el mensaje junto al contexto o usa `AlertDialog`.
