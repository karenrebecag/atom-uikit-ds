<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Inline pending state:

```tsx
import { Spinner } from '@/components/atoms/Spinner';

<Spinner size="m" />
```

## Accesibilidad

- Root already exposes `role="status"` and `aria-label="Loading"` — do not nest another live region around it.
- Pair with disabled buttons or reserved layout so users know *what* is loading.

### Correcto

- role='status' permite que screen readers anuncien el loading state
- aria-label='Loading' da texto accesible al spinner
- currentColor adapta el contraste al contexto automaticamente
- Reduced motion: spinner queda visible pero sin rotacion (aceptable por WCAG)

### Evitar

- No usar Spinner sin contexto visual o textual que indique que se esta cargando
- No usar Spinner como decoracion — es un indicador funcional de estado
- No cambiar la duracion a menos de 500ms — la rotacion se vuelve frenetica

## Cuándo no usar

- Full card/page content placeholders → `Skeleton`.
- Blocking modal progress with a determinate bar → progress patterns, not an endless spinner alone.

## Criterio de uso

- Usa Spinner para trabajo breve e indeterminado en una zona concreta; el usuario debe poder identificar qué está esperando.
- En botones, combina el spinner con estado disabled o loading para impedir reintentos accidentales.
- Para operaciones largas o con progreso conocido, muestra porcentaje, etapas o una barra determinable en lugar de girar indefinidamente.

## Gotchas

- El componente ya expone `role="status"`; no lo envuelvas en otra live region que duplique el anuncio.
- Un spinner aislado no explica el alcance de la espera: reserva espacio y conserva el contexto visible.
- **Nota**: 12 lineas de CSS. Junto con Skeleton, los dos componentes mas ligeros del DS. El SVG inline es obligatorio — no se referencia externamente.
- **Ojo**: prefers-reduced-motion: reduce pone animation-duration a 0ms — el spinner queda visible pero estatico. Esto es una excepcion aceptable segun WCAG: el spinner comunica estado esencial, pero la animacion no es esencial para entenderlo (el role='status' + aria-label ya comunican 'loading').
