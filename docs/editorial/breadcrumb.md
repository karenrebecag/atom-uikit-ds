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
