<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Table pages:

```tsx
import {
  Pagination, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis,
} from '@/components/atoms/Pagination';

<Pagination>
  <PaginationItem><PaginationPrevious href="?p=1" disabled /></PaginationItem>
  <PaginationItem><PaginationLink href="?p=1" isActive>1</PaginationLink></PaginationItem>
  <PaginationItem><PaginationEllipsis /></PaginationItem>
  <PaginationItem><PaginationNext href="?p=2" /></PaginationItem>
</Pagination>
```

## Accesibilidad

- Root `nav` has `aria-label="Pagination"`; only one `isActive` link should set `aria-current="page"`.
- Disable Previous on page 1 and Next on the last page.

## Cuándo no usar

- Infinite scroll feeds — use a load-more pattern, not page numbers alone.
- In-panel content switching without URLs → `Tabs`.

## Criterio de uso

- Úsala cuando el usuario necesita volver a una página concreta de resultados, especialmente en tablas y búsquedas.
- Deshabilita Previous en la primera página y Next en la última; no dejes enlaces que prometen una navegación inexistente.
- Mantén un único enlace activo y comunica el rango o total cuando ayude a entender la posición actual.

## Gotchas

- El contenedor debe ser un `nav` con `aria-label="Pagination"` y el estado activo debe expresarse como `aria-current="page"`.
- Para feeds exploratorios donde la posición exacta no importa, usa load-more o infinite scroll; no fuerces paginación numérica.
