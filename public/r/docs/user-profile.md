<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Account header block:

```tsx
import { UserProfile } from '@/components/atoms/UserProfile';

<UserProfile
  name="Ada Lovelace"
  org="Analytical Engines"
  avatar={{ type: 'initials', size: 's' }}
/>
```

## Accesibilidad

- `name` is required. Initials default from the name; when using image avatars, pass meaningful `alt` via `avatar` props.
- Treat as a presentational cluster — interactive menus belong on a surrounding button/menu, not only on the faces.

## Cuándo no usar

- Single avatar without name/org → `Avatar`.
- Dense assignee stacks → `AvatarGroup`.

## Criterio de uso

- Usa UserProfile como identidad, no como menu: si necesita acciones, envuelvelo en `DropdownMenu`.
- El nombre es lo minimo indispensable; `org` solo aporta cuando el usuario pertenece a varias.
- En sidebar colapsado se reduce a avatar: la inicial o imagen debe seguir identificando sin el texto.

## Gotchas

- Sin imagen cae a iniciales: nombres de una sola palabra dan una inicial, y con pocos usuarios eso deja de distinguir.
- El avatar no es un boton: si es clickeable, el elemento interactivo lo pone el contenedor.
