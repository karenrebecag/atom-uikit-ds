<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Deep product path:

```tsx
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/atoms/Breadcrumb';

<Breadcrumb>
  <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem><BreadcrumbLink href="/settings">Settings</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem><BreadcrumbPage>Profile</BreadcrumbPage></BreadcrumbItem>
</Breadcrumb>
```

## Accesibilidad

- Root is a `nav` with `aria-label="Breadcrumb"`.
- Current page uses `BreadcrumbPage` (`aria-current="page"`), never a link to the same URL.

## Cuándo no usar

- Primary app sections switching in-place → `Tabs` or sidebar nav.
- A single-level page with no hierarchy — omit breadcrumbs.

## Criterio de uso

- Úsalo cuando la página pertenece a una jerarquía navegable y los ancestros son destinos útiles.
- Los ancestros son enlaces; la página actual es texto no enlazado y debe anunciarse como tal con `aria-current="page"`.
- Mantén la ruta corta. Si la profundidad no ayuda a orientarse, reduce niveles en lugar de truncar nombres esenciales.

## Gotchas

- El contenedor debe ser un `nav` con `aria-label="Breadcrumb"`.
- No uses breadcrumbs como sustituto de la navegación principal ni para representar pasos lineales de un formulario.
