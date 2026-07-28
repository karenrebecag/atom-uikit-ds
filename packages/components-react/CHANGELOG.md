# @atom-uikit/components-react

## 4.0.0

### Patch Changes

- Updated dependencies [e5f84fc]
- Updated dependencies [3324cf1]
  - @atom-uikit/css@2.0.0

## 3.0.0

### Minor Changes

- New Badge component: numeric counter pill with neutral/inbox variants and enabled/focused/subtle states. Colors aligned with Figma for both light and dark mode.

### Patch Changes

- Updated dependencies
  - @atom-uikit/css@1.2.0

## 2.0.0

### Minor Changes

- BREAKING: Removed SearchInput component. Use `<Input type="search" iconLeft={...} />` instead.

### Patch Changes

- Updated dependencies
  - @atom-uikit/css@1.1.0

## 1.0.6

### Patch Changes

- Critical fixes: `scale: none` → `scale: 1` across button, icon-button, toggle-group. Button transitions tokenized. Anchor button prevents navigation when disabled. Spinner uses CSS animation respecting prefers-reduced-motion. Input CSS fully tokenized. Tabs list supports flex-wrap.
- Updated dependencies
  - @atom-uikit/css@1.0.7

## 1.0.5

### Patch Changes

- ButtonGroup: forwardRef support, exported types for all sub-components, aria-label prop for accessibility. Removed hardcoded CSS fallback.
- Updated dependencies
  - @atom-uikit/css@1.0.6

## 1.0.4

### Patch Changes

- LinkButton: new `animated` prop adds persistent underline and subtle text shimmer toward a lighter shade. Disabled state disables both effects.
- Updated dependencies
  - @atom-uikit/css@1.0.4

## 1.0.3

### Patch Changes

- TabsList animated indicator: sliding indicator that tracks the active tab with spring easing. Inactive tab text contrast improved for WCAG AA. Tabs list now uses flex layout with equal-width triggers.
- Updated dependencies
  - @atom-uikit/css@1.0.3

## 1.0.1

### Patch Changes

- Add dark mode tokens (dark.css under [data-theme="dark"] selector). Fix token build to separate light/dark outputs. Add README.md to all packages.
- Updated dependencies
  - @atom-uikit/css@1.0.1

## 1.0.0

### Minor Changes

- Initial release of the ATOM UIKit design system.

  Tokens: 3-layer architecture (primitives, semantic, component). Major Third typography scale, base-4 spacing, full color palette.

  CSS: 40+ component stylesheets. Pure CSS custom properties, dark mode, fluid scaling.

  Animations: GSAP modules for button hover, sidebar, draggable marquee, menu button, video player.

  Components (React): 50+ composable components - Button, IconButton, Input, Select, Combobox, Dialog, Sheet, Drawer, AlertDialog, Toast, Table, Tabs, Calendar, Slider, Sidebar, DropdownMenu, ContextMenu, Pagination, Accordion, Breadcrumb, Typography, Avatar, AvatarGroup, Tag, Chip, Toggle, Checkbox, Radio, Skeleton, Spinner, Resizable, Empty, Item, Marquee, VideoPlayer, ButtonGroup, ToggleGroup, BurgerIcon.

### Patch Changes

- Updated dependencies
  - @atom-uikit/css@1.0.0
