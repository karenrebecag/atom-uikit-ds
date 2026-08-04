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

### Correcto

- Imagen: alt describe al usuario (ej: 'Karen Ortiz') — no 'avatar' ni 'foto'
- Icon default tiene stroke-dasharray para indicar visualmente que es placeholder
- Status dot es decorativo — no tiene role ni aria. Comunicar status via texto adyacente
- Skeleton oculta todo el contenido con display:none — screen readers no leen nada (correcto)

### Evitar

- No usar Avatar sin alt cuando tiene imagen — es obligatorio para a11y
- No depender del status dot como unica indicacion de estado online — acompanar con texto
- No usar initials de mas de 2 caracteres — se desborda del espacio

## Cuándo no usar

- Product/hero photography → `Image`.
- Stacks of people → `AvatarGroup`.

## Criterio de uso

- Elige `image` cuando la identidad visual importe, `initials` como fallback estable y `icon` para bots o entidades sin rostro.
- Usa círculo para personas y cuadrado para marcas, workspaces o entidades no humanas; mantén la decisión consistente en una misma superficie.
- Muestra `status` sólo si la presencia es actual y accionable; una pip de color sin información confiable crea una falsa expectativa.

## Gotchas

- La imagen necesita `alt` significativo; initials e icon necesitan un nombre accesible cuando el contexto no lo aporta.
- `skeleton` debe desaparecer cuando termina la carga y conservar el tamaño final para evitar saltos de layout.
