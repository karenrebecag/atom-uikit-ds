<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Person in a list:

```tsx
import { Avatar } from '@/components/atoms/Avatar';

<Avatar
  type="image-border"
  size="m"
  src="/u/ada.jpg"
  alt="Ada Lovelace"
  status
/>
```

Initials fallback:

```tsx
<Avatar type="initials" size="s" initials="AL" shape="circle" />
```

## Accesibilidad

- Image type needs meaningful `alt` (person/entity name). Initials/icon types need `aria-label` when the name is not adjacent text.
- `status` is decorative presence — do not encode critical state only in the pip color.

## Cuándo no usar

- Product/hero photography → `Image`.
- Stacks of people → `AvatarGroup`.
