# @atom-uikit/css

Pure CSS components and utilities for the ATOM UIKit design system -- no CSS-in-JS, no Tailwind, just custom properties and clean class names.

## Install

```bash
pnpm add @atom-uikit/css @atom-uikit/tokens
```

## Usage

Import tokens first, then the stylesheet:

```css
@import '@atom-uikit/tokens/css';
@import '@atom-uikit/css';
```

Or in your HTML:

```html
<link rel="stylesheet" href="node_modules/@atom-uikit/tokens/build/css/tokens.css" />
<link rel="stylesheet" href="node_modules/@atom-uikit/css/dist/atom.css" />
```

## What's Included

### Foundation

- **Scaling** -- fluid viewport-based typography system (no breakpoint jumps for font sizes)
- **Typography** -- heading, body, and label classes using the Major Third scale
- **Focus** -- consistent focus-visible ring styles

### Components

**Buttons** -- button, icon-button, link-button, button-group, toggle-group, menu-button (burger icon)

**Forms** -- input, textarea, field, search-input, checkbox, radio, toggle, select, combobox, dropdown-menu, context-menu, calendar, slider

**Indicators** -- avatar, avatar-group, chip, tag, skeleton, spinner, tooltip

**Layout** -- accordion, divider, empty, item, resizable, table, dialog, sheet, drawer, alert-dialog

**Navigation** -- nav-link, breadcrumb, pagination, tabs

**Sidebar** -- sidebar (collapsible, with groups and items)

**Molecules** -- marquee, user-profile, video-player

**Feedback** -- toast

### Layout Utilities

Container classes with fluid max-width scaling.

### Utilities

Additional helper classes.

## Class Naming Convention

```
.{component}
.{component}--{variant}
.{component}--{size}
.{component}--{state}
```

Sizes: `xs`, `s`, `m`, `l`, `xl`. Variants: `primary`, `secondary`, `tertiary`, `destructive-primary`, `destructive-secondary`, `destructive-tertiary`.

## Peer Dependencies

- `@atom-uikit/tokens` -- provides all CSS custom properties consumed by component styles

## License

MIT
