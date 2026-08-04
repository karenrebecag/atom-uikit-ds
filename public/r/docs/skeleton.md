<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Card placeholder while loading:

```tsx
import { Skeleton } from '@/components/atoms/Skeleton';

<div aria-busy="true" aria-live="polite">
  <Skeleton variant="default" />
  <Skeleton variant="default" />
</div>
```

## Accesibilidad

- Mark the loading region with `aria-busy="true"` (and optionally `aria-live`) on the container — skeleton shapes alone are not announced as “loading”.
- Replace skeletons with real content; do not leave them permanently on screen.

### Correcto

- aria-hidden='true' automatico — screen readers ignoran los skeletons
- prefers-reduced-motion desactiva el pulso (queda bloque estatico)
- Replicar la estructura del contenido real — mismos gaps, heights, widths
- Reemplazar skeleton por contenido real sin cambio de layout (CLS = 0)

### Evitar

- No usar Skeleton como indicador de error — es solo para loading
- No dejar skeletons permanentemente — siempre debe haber timeout o fallback
- No animar con duraciones menores a 500ms — el pulso se vuelve molesto

## Cuándo no usar

- Indeterminate wait without layout reservation → `Spinner`.
- Avatar-specific loading face → `Avatar skeleton` prop when that control owns the slot.

## Criterio de uso

- Usa Skeleton cuando conoces la forma del contenido que llegará y quieres reservar su espacio desde el primer paint.
- Haz que la geometría del placeholder se parezca al contenido real; una barra genérica no explica una card compleja y aumenta el cambio visual.
- Retíralo cuando el contenido esté listo y conserva `aria-busy` en el contenedor durante la transición.

## Gotchas

- Skeleton es decorativo: el estado de carga debe comunicarse en el contenedor, no con una colección de formas sin nombre.
- No lo uses como animación permanente ni para bloquear acciones que ya podrían estar disponibles.
- **Nota**: variant='text' tiene height: 1em por defecto — escala con el font-size del contenedor. Solo necesitas width.
- **Nota**: 10 lineas de CSS. El componente mas ligero del DS. El consumidor controla todo el dimensionamiento via inline style.
- **Nota**: No requiere GSAP. Es puro CSS @keyframes. La duracion (1s) es mas rapida que el Avatar skeleton (1.5s) — el pulso se siente mas energico.
