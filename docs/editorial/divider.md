<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Separate stacked blocks:

```tsx
import { Divider } from '@/components/atoms/Divider';

<section>…</section>
<Divider orientation="horizontal" />
<section>…</section>
```

## Accesibilidad

- Vertical sets `role="separator"` and `aria-orientation="vertical"`; horizontal is a plain `hr`.
- Do not use dividers as the only way to express hierarchy — keep headings.

## Cuándo no usar

- Spacing alone without a rule → margin/gap utilities.
- Interactive split panes → `Resizable`, not a static divider.

## Criterio de uso

- Usa Divider cuando una regla visible ayude a separar grupos que ya tienen estructura; no intentes construir jerarquía sólo con líneas.
- Usa orientación horizontal entre bloques apilados y vertical dentro de toolbars o grupos inline.
- Si la separación no aporta información, prefiere `gap` o margen para reducir ruido visual.

## Gotchas

- La orientación vertical tiene semántica de separator; la horizontal se comporta como `hr`.
- No uses Divider como control interactivo ni como sustituto de un heading o label.
