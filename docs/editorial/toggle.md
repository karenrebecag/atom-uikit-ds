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

### Correcto

- role='switch' — screen readers anuncian 'toggle' o 'switch', no 'checkbox'
- Input nativo `<input type='checkbox'>` maneja el estado internamente
- Touch target 44x40px cumple WCAG
- Label clickeable — click en el texto togglea
- focus-visible ring combinado con inset shadow (no los reemplaza)
- Space togglea on/off (comportamiento nativo)

### Evitar

- No usar Toggle para seleccion multiple — usar Checkbox
- No usar Toggle sin label a menos que el contexto sea obvio (ej: dentro de un settings row)
- No simular toggle con divs — el input nativo ya maneja ARIA

## Cuándo no usar

- Form multi-select or “agree to terms” → `Checkbox`.
- Choosing one of many plans → `Radio` group.

## Criterio de uso

- Usa Toggle para una preferencia que cambia de inmediato y que tiene sólo dos estados persistentes.
- Comunica el efecto del cambio en la etiqueta, no sólo con “on/off”; el usuario debe entender qué queda activo.
- Si la preferencia está bloqueada por plan o permisos, explica el motivo cercano al control en lugar de dejar un switch muerto.

## Gotchas

- Un switch sin label visible o `aria-label` no tiene nombre accesible.
- No uses Toggle para enviar un formulario ni para seleccionar una opción dentro de un conjunto mutuamente excluyente.
- **Nota**: La animacion de bounce es puro CSS (cubic-bezier(0.35, 1.5, 0.6, 1) — spring con overshoot). Se activa con la clase .toggle--animated. Sin ella, el thumb se mueve instantaneamente.
- **Nota**: No requiere GSAP. El bounce es puro CSS cubic-bezier. La diferencia con easing-spring (0.34, 1.56, 0.64, 1) del sistema: este es mas lento y con menos damping, diseñado para el slide fisico del thumb.
