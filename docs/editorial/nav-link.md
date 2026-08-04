<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Active route in a nav list:

```tsx
import { NavLink } from '@/components/atoms/NavLink';

<NavLink href="/docs" size="default" active>
  Docs
</NavLink>
```

## Accesibilidad

- `children` is a string label; `active` sets `aria-current="page"` — one active link per section.
- `disabled` sets `aria-disabled`; still prefer removing the destination when navigation is blocked.

## Cuándo no usar

- Page CTAs that leave the app shell → `LinkButton` / `Button`.
- Icon-only chrome → `IconButton` with `aria-label`.

## Criterio de uso

- Úsalo para navegación persistente dentro del shell: sidebar, top nav o una lista de secciones.
- Marca sólo la ruta actual como `active`; no uses el estado activo para indicar foco, hover o una selección temporal.
- Mantén `href` y una etiqueta textual clara. Para acciones sin navegación, usa `Button`.

## Gotchas

- En cada sección debe existir como máximo un enlace con `aria-current="page"`.
- El estado `disabled` no reemplaza una política de permisos: si el destino no debe existir para el usuario, omite el enlace o resuelve la autorización en el router.
