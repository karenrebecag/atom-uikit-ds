<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Selected filter chip:

```tsx
import { Chip } from '@/components/atoms/Chip';

<Chip type="filled" size="s" onClose={() => {}}>
  Design
</Chip>
```

## Accesibilidad

- `onClose` must have an accessible name (`aria-label` on the close control).
- The visual prop is named `type` (not `variant`) — keep labels in sync with registry.

### Correcto

- Close button tiene aria-label='Remove {text}' automaticamente
- Close button usa `tabIndex={-1}` — no focusable por Tab (el chip completo recibe foco)
- focus-visible y focused prop muestran focus ring para teclado
- disabled desactiva tanto el chip como el close button

### Evitar

- No usar Chip para status display estatico — usar Tag en su lugar
- No pasar JSX como children — solo string (necesario para aria-label del close)
- No omitir onClose si el chip es removible — sin el, no hay boton X

## Cuándo no usar

- Tags that are not interactive status labels should use `Tag`, not `Chip`.

## Criterio de uso

- Usa Chip para una selección, filtro o valor que el usuario pueda retirar; el botón de cierre debe estar dentro del mismo contexto semántico.
- Usa `outlined` en reposo y `filled` cuando el estado seleccionado deba destacar; evita que la superficie sea la única señal.
- Si el chip está bloqueado por permisos, explica la razón cerca del grupo y no simules una acción disponible.

## Gotchas

- El control de cierre necesita nombre accesible propio y debe conservar foco de teclado.
- `type` es el prop visual del componente; no lo renombres a `variant` al componerlo con otros controles.
