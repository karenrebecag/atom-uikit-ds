<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

App shell chrome:

```tsx
import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent,
  SidebarFooter, SidebarItem, SidebarTrigger,
} from '@/components/molecules/sidebar';

<SidebarProvider>
  <Sidebar side="left">
    <SidebarHeader>
      <SidebarTrigger />
    </SidebarHeader>
    <SidebarContent>
      <SidebarItem href="/home">Home</SidebarItem>
    </SidebarContent>
    <SidebarFooter>v1</SidebarFooter>
  </Sidebar>
</SidebarProvider>
```

## Accesibilidad

- Must wrap with `SidebarProvider` (collapse state); `useSidebar()` outside throws.
- Collapse is provider state, not a prop on `Sidebar` — toggle via `SidebarTrigger` / `toggle()`.

## Cuándo no usar

- Temporary filters or mobile sheets → `Drawer` / `Sheet`.
- A single short link list in a page body → plain nav, not the full shell sidebar.

## Criterio de uso

- Usa Sidebar para navegacion persistente de una aplicacion, no para menus de sitio: su valor esta en mantener el contexto entre vistas.
- El estado colapsado debe sobrevivir la navegacion; recordar la preferencia evita que el usuario la reajuste en cada pagina.
- Agrupa por tarea del usuario, no por modulo tecnico, y limita la anidacion a un nivel.

## Gotchas

- Son 11 sub-componentes con un Provider: montar Content sin el Provider deja el colapso sin estado compartido.
- `side` cambia la relacion espacial con el contenido, no solo el lado: en `right` el foco de lectura invierte y conviene revisar el orden de tabulacion.
