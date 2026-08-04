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

### Correcto

- El componente React agrega `aria-busy={true}` automaticamente en estado loading
- `disabled={true}` en `<button>` desactiva el foco y lo anuncia al screen reader
- href renderiza `<a>` con aria-disabled si esta desactivado
- focus-visible muestra outline con var(--ring) para navegacion por teclado
- prefers-reduced-motion: reduce desactiva transiciones y scale feedback

### Evitar

- No usar variant='destructive-primary' sin confirmacion previa (dialog o doble click)
- No ocultar texto del boton solo con iconos — usa aria-label si el boton es icon-only (usar IconButton en su lugar)

## Cuándo no usar

- Not for navigation to another page — use `link-button` (real `href`).
- Not for pure icon chrome — use `icon-button` with `aria-label`.

## Criterio de uso

- Usa `primary` para la única acción principal de una sección; reserva `destructive-*` para acciones irreversibles y acompáñalas con una consecuencia clara.
- Mantén la etiqueta visible mientras `loading` comunica trabajo en curso. No sustituyas el label por un spinner manual: el estado loading ya bloquea el reintento.
- En toolbars densas prefiere `s` o `xs` y deja `animated` apagado; el movimiento de texto aporta más en CTAs de marketing que en acciones repetidas.

## Gotchas

- El CSS del componente usa clases BEM globales; importarlo como CSS Module rompe los selectores.
- Si la acción cambia de ruta, usa un enlace real aunque visualmente parezca botón.
- **Nota**: El font-size es el mismo en todos los tamanos (13px). La diferenciacion viene de height y padding horizontal. Esto garantiza alineacion perfecta con inputs del mismo tamano.
- **Ojo**: La animacion de texto requiere @atom-uikit/animations (GSAP). Sin el modulo, el prop animated no tiene efecto visual. La animacion respeta prefers-reduced-motion automaticamente.
- **Nota**: Este CSS es autocontenido — no necesita tokens ni imports. Usalo para previews, prototipos o proyectos que no instalan @atom-uikit/css.
- **Ojo**: GSAP SplitText es un plugin de pago. Para produccion usa @atom-uikit/animations que lo incluye como dependencia. Los CDN de arriba son para previews y prototipos unicamente.
