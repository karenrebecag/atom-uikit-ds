# @atom-uikit/components-react

React components for the ATOM UIKit design system -- unstyled logic components that render CSS class names from `@atom-uikit/css`.

## Install

```bash
pnpm add @atom-uikit/components-react @atom-uikit/css @atom-uikit/tokens react react-dom
```

## Usage

Import tokens and CSS in your app entry point:

```css
@import '@atom-uikit/tokens/css';
@import '@atom-uikit/css';
```

Then use components:

```tsx
import { Button, Input, Dialog, DialogTrigger, DialogContent, DialogTitle } from '@atom-uikit/components-react';

function Example() {
  return (
    <>
      <Button variant="primary" size="m">Save</Button>
      <Input placeholder="Search..." />

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="s">Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm</DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## Components

### Atoms -- Buttons

- `Button` -- standard button with variant and size props
- `IconButton` -- icon-only button
- `LinkButton` -- anchor styled as button
- `ButtonGroup`, `ButtonGroupSeparator`, `ButtonGroupText` -- grouped button toolbar
- `ToggleGroup`, `ToggleGroupItem` -- exclusive/multi selection group
- `BurgerIcon` -- animated hamburger menu icon

### Atoms -- Forms

- `Input` -- text input
- `Textarea` -- multiline text input
- `Field` -- form field wrapper with label and error
- `SearchInput` -- input with search affordances
- `Checkbox` -- checkbox control
- `Radio` -- radio button
- `Toggle` -- switch toggle
- `Select`, `SelectTrigger`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectSeparator` -- dropdown select
- `Calendar` -- date picker calendar
- `Slider`, `RangeSlider` -- single and range slider controls

### Atoms -- Navigation

- `NavLink` -- navigation link with active state
- `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis` -- breadcrumb trail
- `Pagination`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis` -- page navigation
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` -- tabbed content

### Atoms -- Indicators

- `Avatar` -- user avatar image/fallback
- `AvatarGroup` -- stacked avatar row
- `Chip` -- status/filter chip
- `Tag` -- label tag
- `Skeleton` -- loading placeholder
- `Spinner` -- loading spinner

### Atoms -- Layout

- `Divider` -- horizontal/vertical separator
- `Accordion`, `AccordionItem` -- collapsible content sections
- `Item`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`, `ItemGroup`, `ItemSeparator` -- generic list item compound component
- `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent` -- empty state placeholder
- `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` -- resizable split panes
- `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` -- data table

### Atoms -- Typography

- `TypographyH1`, `TypographyH2`, `TypographyH3`, `TypographyH4` -- headings
- `TypographyP`, `TypographyLead`, `TypographyLarge`, `TypographySmall`, `TypographyMuted` -- body text variants
- `TypographyBlockquote`, `TypographyInlineCode`, `TypographyList` -- content elements

### Molecules

- `Sidebar`, `SidebarProvider`, `useSidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarItem`, `SidebarTrigger`, `SidebarDivider`, `SidebarCollapsible` -- application sidebar
- `UserProfile` -- user info display
- `Combobox`, `ComboboxTrigger`, `ComboboxContent`, `ComboboxInput`, `ComboboxList`, `ComboboxEmpty`, `ComboboxGroup`, `ComboboxItem`, `ComboboxSeparator` -- searchable select
- `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuGroup`, `DropdownMenuShortcut`, `DropdownMenuSeparator` -- context action menu
- `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuLabel`, `ContextMenuShortcut`, `ContextMenuSeparator` -- right-click menu
- `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogFooter` -- modal dialog
- `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogMedia`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogCancel`, `AlertDialogAction` -- confirmation dialog
- `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetBody`, `SheetFooter` -- slide-over panel
- `Drawer`, `DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerBody`, `DrawerFooter` -- bottom drawer
- `Toaster`, `toast` -- toast notifications
- `Marquee`, `MarqueeItem`, `MarqueeSeparator` -- scrolling content strip
- `VideoPlayer` -- Cloudflare Stream video player

## Deep Imports

Components can also be imported individually:

```ts
import { Button } from '@atom-uikit/components-react/atoms/Button';
import { Dialog } from '@atom-uikit/components-react/molecules/Dialog';
```

## Peer Dependencies

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `@atom-uikit/css` -- provides all component styles

## License

MIT
