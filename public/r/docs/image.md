<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Product shot with ratio and cover fit:

```tsx
import { Image } from '@/components/atoms/Image';

<Image
  src="/product/hero.jpg"
  alt="Atom UIKit components on a light surface"
  size="hero"
  ratio="16x9"
  fit="cover"
  radius="lg"
/>
```

## Accesibilidad

- `alt` is mandatory for meaningful images; use empty `alt=""` only when the image is pure decoration next to adjacent text that already names it.
- Default `loading="lazy"` — override to `eager` for LCP heroes above the fold.

## Cuándo no usar

- Avatars / people faces → `Avatar` (sizes, status, initials).
- Icons and UI glyphs → icon components / SVG, not `Image` with a huge bitmap.
