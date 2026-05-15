# @atom-uikit/components-astro

Astro components for the ATOM UIKit design system. This package is in early development with minimal component coverage.

## Install

```bash
pnpm add @atom-uikit/components-astro @atom-uikit/css @atom-uikit/tokens astro
```

## Usage

Import tokens and CSS in your Astro layout:

```astro
---
// src/layouts/Base.astro
import '@atom-uikit/tokens/css';
import '@atom-uikit/css';
---

<html>
  <body><slot /></body>
</html>
```

Then use components in your pages:

```astro
---
import Button from '@atom-uikit/components-astro/atoms/buttons/Button';
---

<Button variant="primary" size="m">Get Started</Button>
```

## What's Included

**Atoms**

- `buttons/Button` -- standard button component

The molecules directory exists but has no components yet. More components will be added as the package matures.

## How It Works

Astro components are `.astro` single-file components shipped as source (no build step). They render CSS class names consumed by `@atom-uikit/css`, matching the same class conventions as the React package.

## Peer Dependencies

- `astro` >= 5.0.0
- `@atom-uikit/css` -- provides all component styles

## License

MIT
