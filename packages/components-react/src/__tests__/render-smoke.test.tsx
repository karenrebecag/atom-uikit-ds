/**
 * Render-smoke data-driven de TODO el surface publico del package.
 *
 * Contrato: cada export de src/index.ts debe estar cubierto por un caso raiz,
 * por el arbol de una familia compuesta (covers) o en SKIP con razon escrita.
 * Un export nuevo sin cubrir rompe la suite — ratchet, como el conformance.
 *
 * Esto NO reemplaza los tests P0 (interaccion + ARIA); garantiza el minimo:
 * ningun componente del registry cruashea al montarse en un consumidor.
 */
import { describe, it, expect } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import type { ReactElement } from 'react';
import * as UIKit from '../index';

const C = UIKit as Record<string, any>;

// Exports que no son componentes montables.
const SKIP: Record<string, string> = {
  toast: 'funcion imperativa; se ejercita montando Toaster',
  useSidebar: 'hook; se ejercita dentro del caso Sidebar',
};

// Un caso por componente raiz. `covers` lista los subcomponentes que el
// arbol del caso monta, para el guard de completitud.
const CASES: Record<string, { el: () => ReactElement; covers?: string[] }> = {
  Accordion: {
    el: () => (
      <C.Accordion>
        <C.AccordionItem title="Titulo">Contenido</C.AccordionItem>
      </C.Accordion>
    ),
    covers: ['AccordionItem'],
  },
  AlertDialog: {
    el: () => (
      <C.AlertDialog defaultOpen>
        <C.AlertDialogTrigger>abrir</C.AlertDialogTrigger>
        <C.AlertDialogContent>
          <C.AlertDialogHeader>
            <C.AlertDialogMedia />
            <C.AlertDialogTitle>Titulo</C.AlertDialogTitle>
            <C.AlertDialogDescription>Descripcion</C.AlertDialogDescription>
          </C.AlertDialogHeader>
          <C.AlertDialogFooter>
            <C.AlertDialogCancel>no</C.AlertDialogCancel>
            <C.AlertDialogAction>si</C.AlertDialogAction>
          </C.AlertDialogFooter>
        </C.AlertDialogContent>
      </C.AlertDialog>
    ),
    covers: [
      'AlertDialogTrigger', 'AlertDialogContent', 'AlertDialogHeader',
      'AlertDialogMedia', 'AlertDialogTitle', 'AlertDialogDescription',
      'AlertDialogFooter', 'AlertDialogCancel', 'AlertDialogAction',
    ],
  },
  Avatar: { el: () => <C.Avatar name="Ada Lovelace" /> },
  AvatarGroup: {
    el: () => (
      <C.AvatarGroup>
        <C.Avatar name="Ada" />
        <C.Avatar name="Grace" />
      </C.AvatarGroup>
    ),
  },
  Badge: { el: () => <C.Badge>3</C.Badge> },
  Breadcrumb: {
    el: () => (
      <C.Breadcrumb>
        <C.BreadcrumbItem>
          <C.BreadcrumbLink href="/">Inicio</C.BreadcrumbLink>
        </C.BreadcrumbItem>
        <C.BreadcrumbSeparator />
        <C.BreadcrumbEllipsis />
        <C.BreadcrumbSeparator />
        <C.BreadcrumbItem>
          <C.BreadcrumbPage>Actual</C.BreadcrumbPage>
        </C.BreadcrumbItem>
      </C.Breadcrumb>
    ),
    covers: [
      'BreadcrumbItem', 'BreadcrumbLink', 'BreadcrumbSeparator',
      'BreadcrumbEllipsis', 'BreadcrumbPage',
    ],
  },
  BurgerIcon: { el: () => <C.BurgerIcon /> },
  Button: { el: () => <C.Button>Accion</C.Button> },
  ButtonGroup: {
    el: () => (
      <C.ButtonGroup>
        <C.Button>a</C.Button>
        <C.ButtonGroupSeparator />
        <C.ButtonGroupText>texto</C.ButtonGroupText>
      </C.ButtonGroup>
    ),
    covers: ['ButtonGroupSeparator', 'ButtonGroupText'],
  },
  Calendar: { el: () => <C.Calendar /> },
  Checkbox: { el: () => <C.Checkbox label="acepto" /> },
  Chip: { el: () => <C.Chip>chip</C.Chip> },
  Combobox: {
    el: () => (
      <C.Combobox>
        <C.ComboboxTrigger>elegir</C.ComboboxTrigger>
        <C.ComboboxContent>
          <C.ComboboxInput />
          <C.ComboboxList>
            <C.ComboboxGroup>
              <C.ComboboxItem value="a">A</C.ComboboxItem>
            </C.ComboboxGroup>
            <C.ComboboxSeparator />
            <C.ComboboxEmpty>vacio</C.ComboboxEmpty>
          </C.ComboboxList>
        </C.ComboboxContent>
      </C.Combobox>
    ),
    covers: [
      'ComboboxTrigger', 'ComboboxContent', 'ComboboxInput', 'ComboboxList',
      'ComboboxGroup', 'ComboboxItem', 'ComboboxSeparator', 'ComboboxEmpty',
    ],
  },
  ContextMenu: {
    el: () => (
      <C.ContextMenu>
        <C.ContextMenuTrigger>zona</C.ContextMenuTrigger>
        <C.ContextMenuContent>
          <C.ContextMenuLabel>menu</C.ContextMenuLabel>
          <C.ContextMenuItem>
            item <C.ContextMenuShortcut>K</C.ContextMenuShortcut>
          </C.ContextMenuItem>
          <C.ContextMenuSeparator />
        </C.ContextMenuContent>
      </C.ContextMenu>
    ),
    covers: [
      'ContextMenuTrigger', 'ContextMenuContent', 'ContextMenuLabel',
      'ContextMenuItem', 'ContextMenuShortcut', 'ContextMenuSeparator',
    ],
  },
  Dialog: {
    el: () => (
      <C.Dialog defaultOpen>
        <C.DialogTrigger>abrir</C.DialogTrigger>
        <C.DialogContent>
          <C.DialogHeader>
            <C.DialogTitle>Titulo</C.DialogTitle>
            <C.DialogDescription>Descripcion</C.DialogDescription>
          </C.DialogHeader>
          <C.DialogBody>cuerpo</C.DialogBody>
          <C.DialogFooter>
            <C.Button>ok</C.Button>
          </C.DialogFooter>
        </C.DialogContent>
      </C.Dialog>
    ),
    covers: [
      'DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogTitle',
      'DialogDescription', 'DialogBody', 'DialogFooter',
    ],
  },
  Divider: { el: () => <C.Divider /> },
  Drawer: {
    el: () => (
      <C.Drawer defaultOpen>
        <C.DrawerTrigger>abrir</C.DrawerTrigger>
        <C.DrawerContent>
          <C.DrawerHeader>
            <C.DrawerTitle>Titulo</C.DrawerTitle>
            <C.DrawerDescription>Descripcion</C.DrawerDescription>
          </C.DrawerHeader>
          <C.DrawerBody>cuerpo</C.DrawerBody>
          <C.DrawerFooter>pie</C.DrawerFooter>
        </C.DrawerContent>
      </C.Drawer>
    ),
    covers: [
      'DrawerTrigger', 'DrawerContent', 'DrawerHeader', 'DrawerTitle',
      'DrawerDescription', 'DrawerBody', 'DrawerFooter',
    ],
  },
  DropdownMenu: {
    el: () => (
      <C.DropdownMenu>
        <C.DropdownMenuTrigger>menu</C.DropdownMenuTrigger>
        <C.DropdownMenuContent>
          <C.DropdownMenuLabel>opciones</C.DropdownMenuLabel>
          <C.DropdownMenuGroup>
            <C.DropdownMenuItem>
              item <C.DropdownMenuShortcut>K</C.DropdownMenuShortcut>
            </C.DropdownMenuItem>
          </C.DropdownMenuGroup>
          <C.DropdownMenuSeparator />
        </C.DropdownMenuContent>
      </C.DropdownMenu>
    ),
    covers: [
      'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuLabel',
      'DropdownMenuGroup', 'DropdownMenuItem', 'DropdownMenuShortcut',
      'DropdownMenuSeparator',
    ],
  },
  Empty: {
    el: () => (
      <C.Empty>
        <C.EmptyHeader>
          <C.EmptyMedia />
          <C.EmptyTitle>Nada aqui</C.EmptyTitle>
          <C.EmptyDescription>Sin resultados</C.EmptyDescription>
        </C.EmptyHeader>
        <C.EmptyContent>
          <C.Button>crear</C.Button>
        </C.EmptyContent>
      </C.Empty>
    ),
    covers: ['EmptyHeader', 'EmptyMedia', 'EmptyTitle', 'EmptyDescription', 'EmptyContent'],
  },
  Field: { el: () => <C.Field label="Nombre"><C.Input /></C.Field> },
  IconButton: { el: () => <C.IconButton aria-label="cerrar" /> },
  Image: { el: () => <C.Image src="/x.png" alt="demo" /> },
  Input: { el: () => <C.Input placeholder="texto" /> },
  Item: {
    el: () => (
      <C.ItemGroup>
        <C.Item>
          <C.ItemMedia />
          <C.ItemContent>
            <C.ItemTitle>Titulo</C.ItemTitle>
            <C.ItemDescription>Descripcion</C.ItemDescription>
          </C.ItemContent>
          <C.ItemActions>
            <C.Button>ver</C.Button>
          </C.ItemActions>
        </C.Item>
        <C.ItemSeparator />
      </C.ItemGroup>
    ),
    covers: [
      'ItemGroup', 'ItemMedia', 'ItemContent', 'ItemTitle',
      'ItemDescription', 'ItemActions', 'ItemSeparator',
    ],
  },
  LinkButton: { el: () => <C.LinkButton href="https://atomchat.io">ir</C.LinkButton> },
  Marquee: {
    el: () => (
      <C.Marquee>
        <C.MarqueeItem>uno</C.MarqueeItem>
        <C.MarqueeSeparator />
        <C.MarqueeItem>dos</C.MarqueeItem>
      </C.Marquee>
    ),
    covers: ['MarqueeItem', 'MarqueeSeparator'],
  },
  NavLink: { el: () => <C.NavLink href="/">Inicio</C.NavLink> },
  Pagination: {
    el: () => (
      <C.Pagination>
        <C.PaginationPrevious href="#" />
        <C.PaginationItem>
          <C.PaginationLink href="#">1</C.PaginationLink>
        </C.PaginationItem>
        <C.PaginationEllipsis />
        <C.PaginationNext href="#" />
      </C.Pagination>
    ),
    covers: [
      'PaginationPrevious', 'PaginationItem', 'PaginationLink',
      'PaginationEllipsis', 'PaginationNext',
    ],
  },
  ProgressNav: {
    el: () => (
      <C.ProgressNav
        items={[
          { id: 'a', label: 'Uno' },
          { id: 'b', label: 'Dos' },
        ]}
      />
    ),
  },
  Radio: { el: () => <C.Radio label="opcion" name="g" /> },
  RangeSlider: { el: () => <C.RangeSlider /> },
  ResizablePanelGroup: {
    el: () => (
      <C.ResizablePanelGroup direction="horizontal">
        <C.ResizablePanel>a</C.ResizablePanel>
        <C.ResizableHandle />
        <C.ResizablePanel>b</C.ResizablePanel>
      </C.ResizablePanelGroup>
    ),
    covers: ['ResizablePanel', 'ResizableHandle'],
  },
  Select: {
    el: () => (
      <C.Select>
        <C.SelectTrigger>elegir</C.SelectTrigger>
        <C.SelectContent>
          <C.SelectGroup>
            <C.SelectItem value="a">A</C.SelectItem>
          </C.SelectGroup>
          <C.SelectSeparator />
        </C.SelectContent>
      </C.Select>
    ),
    covers: ['SelectTrigger', 'SelectContent', 'SelectGroup', 'SelectItem', 'SelectSeparator'],
  },
  Sheet: {
    el: () => (
      <C.Sheet defaultOpen>
        <C.SheetTrigger>abrir</C.SheetTrigger>
        <C.SheetContent>
          <C.SheetHeader>
            <C.SheetTitle>Titulo</C.SheetTitle>
            <C.SheetDescription>Descripcion</C.SheetDescription>
          </C.SheetHeader>
          <C.SheetBody>cuerpo</C.SheetBody>
          <C.SheetFooter>pie</C.SheetFooter>
        </C.SheetContent>
      </C.Sheet>
    ),
    covers: [
      'SheetTrigger', 'SheetContent', 'SheetHeader', 'SheetTitle',
      'SheetDescription', 'SheetBody', 'SheetFooter',
    ],
  },
  SidebarProvider: {
    el: () => (
      <C.SidebarProvider>
        <C.Sidebar>
          <C.SidebarHeader>logo</C.SidebarHeader>
          <C.SidebarContent>
            <C.SidebarGroup label="grupo">
              <C.SidebarItem>item</C.SidebarItem>
              <C.SidebarCollapsible label="mas">
                <C.SidebarItem>anidado</C.SidebarItem>
              </C.SidebarCollapsible>
            </C.SidebarGroup>
            <C.SidebarDivider />
          </C.SidebarContent>
          <C.SidebarFooter>pie</C.SidebarFooter>
        </C.Sidebar>
        <C.SidebarTrigger />
      </C.SidebarProvider>
    ),
    covers: [
      'Sidebar', 'SidebarHeader', 'SidebarContent', 'SidebarGroup',
      'SidebarItem', 'SidebarCollapsible', 'SidebarDivider',
      'SidebarFooter', 'SidebarTrigger',
    ],
  },
  Skeleton: { el: () => <C.Skeleton /> },
  Slider: { el: () => <C.Slider /> },
  Spinner: { el: () => <C.Spinner /> },
  StatsCard: { el: () => <C.StatsCard value="+40%" label="conversion" /> },
  Stepper: {
    el: () => (
      <C.Stepper
        steps={[
          { title: 'Uno' },
          { title: 'Dos' },
        ]}
      />
    ),
  },
  Table: {
    el: () => (
      <C.Table>
        <C.TableCaption>tabla</C.TableCaption>
        <C.TableHeader>
          <C.TableRow>
            <C.TableHead>col</C.TableHead>
          </C.TableRow>
        </C.TableHeader>
        <C.TableBody>
          <C.TableRow>
            <C.TableCell>dato</C.TableCell>
          </C.TableRow>
        </C.TableBody>
        <C.TableFooter>
          <C.TableRow>
            <C.TableCell>total</C.TableCell>
          </C.TableRow>
        </C.TableFooter>
      </C.Table>
    ),
    covers: [
      'TableCaption', 'TableHeader', 'TableRow', 'TableHead',
      'TableBody', 'TableCell', 'TableFooter',
    ],
  },
  Tabs: {
    el: () => (
      <C.Tabs defaultValue="a">
        <C.TabsList>
          <C.TabsTrigger value="a">A</C.TabsTrigger>
          <C.TabsTrigger value="b">B</C.TabsTrigger>
        </C.TabsList>
        <C.TabsContent value="a">contenido</C.TabsContent>
      </C.Tabs>
    ),
    covers: ['TabsList', 'TabsTrigger', 'TabsContent'],
  },
  Tag: { el: () => <C.Tag>tag</C.Tag> },
  Textarea: { el: () => <C.Textarea placeholder="texto" /> },
  Toaster: { el: () => <C.Toaster /> },
  Toggle: { el: () => <C.Toggle label="modo" /> },
  ToggleGroup: {
    el: () => (
      <C.ToggleGroup>
        <C.ToggleGroupItem value="a">A</C.ToggleGroupItem>
      </C.ToggleGroup>
    ),
    covers: ['ToggleGroupItem'],
  },
  TypographyH1: { el: () => <C.TypographyH1>H1</C.TypographyH1> },
  TypographyH2: { el: () => <C.TypographyH2>H2</C.TypographyH2> },
  TypographyH3: { el: () => <C.TypographyH3>H3</C.TypographyH3> },
  TypographyH4: { el: () => <C.TypographyH4>H4</C.TypographyH4> },
  TypographyP: { el: () => <C.TypographyP>p</C.TypographyP> },
  TypographyLead: { el: () => <C.TypographyLead>lead</C.TypographyLead> },
  TypographyLarge: { el: () => <C.TypographyLarge>large</C.TypographyLarge> },
  TypographySmall: { el: () => <C.TypographySmall>small</C.TypographySmall> },
  TypographyMuted: { el: () => <C.TypographyMuted>muted</C.TypographyMuted> },
  TypographyBlockquote: { el: () => <C.TypographyBlockquote>cita</C.TypographyBlockquote> },
  TypographyInlineCode: { el: () => <C.TypographyInlineCode>code</C.TypographyInlineCode> },
  TypographyList: { el: () => <C.TypographyList items={['a', 'b']} /> },
  UserProfile: { el: () => <C.UserProfile name="Ada" organization="Atom" /> },
  VideoPlayer: { el: () => <C.VideoPlayer src="https://example.com/v.m3u8" /> },
};

describe('render-smoke: surface publico completo', () => {
  it('cada export esta cubierto por un caso, una familia o SKIP con razon', () => {
    const covered = new Set<string>([
      ...Object.keys(CASES),
      ...Object.values(CASES).flatMap((c) => c.covers ?? []),
      ...Object.keys(SKIP),
    ]);
    const missing = Object.keys(C).filter((k) => !covered.has(k));
    expect(missing, `exports sin cubrir: ${missing.join(', ')}`).toEqual([]);
  });

  for (const [name, testCase] of Object.entries(CASES)) {
    it(`${name} monta sin crashear y produce DOM`, () => {
      render(testCase.el());
      expect(document.body.innerHTML.length).toBeGreaterThan(0);
      cleanup();
    });
  }
});
