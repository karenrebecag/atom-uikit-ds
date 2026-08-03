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
