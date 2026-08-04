<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Team row with overflow:

```tsx
import { AvatarGroup } from '@/components/atoms/AvatarGroup';
import { Avatar } from '@/components/atoms/Avatar';

<AvatarGroup size="s" max={3}>
  <Avatar type="image" src="/u/1.jpg" alt="A" />
  <Avatar type="image" src="/u/2.jpg" alt="B" />
  <Avatar type="image" src="/u/3.jpg" alt="C" />
  <Avatar type="image" src="/u/4.jpg" alt="D" />
</AvatarGroup>
```

## Accesibilidad

- Each child `Avatar` still needs its own name (`alt` / `aria-label`).
- Overflow “+N” is visual — provide a textual count nearby when the full roster matters (e.g. “4 assignees”).

### Correcto

- Cada Avatar hijo debe tener alt con el nombre del usuario
- Count badge (+N) es decorativo — complementar con texto como 'y 3 mas' fuera del grupo
- Z-index descendente: primer avatar = mas importante visualmente (encima de los demas)

### Evitar

- No usar max sin indicar cuantos usuarios hay en total — '+3' sin contexto no es util
- No mezclar sizes distintos entre AvatarGroup y sus Avatar hijos
- No usar mas de 10 avatares visibles — el z-index stack solo cubre 10 niveles

## Cuándo no usar

- Single person → `Avatar`.
- Editable assignee pickers that need full names listed → list/`Item` rows, not only a face stack.

## Criterio de uso

- Usa el grupo para resumir participantes cuando el espacio es limitado y el detalle completo puede abrirse en otro contexto.
- Elige `max` según el ancho real de la superficie; un `+N` debe representar a todas las personas ocultas, no sólo a las que no cupieron en la primera fila.
- Mantén tamaño y forma consistentes con los Avatars vecinos y con la densidad del producto.

## Gotchas

- El overflow visual necesita resumen textual accesible, especialmente si la lista representa responsables o permisos.
- Sólo acepta Avatars como hijos; no mezcles texto o controles sin un patrón de lista explícito.
- **Nota**: CSS requiere Avatar standalone CSS como prerequisito. AvatarGroup solo agrega overlap, z-index stack y count badge.
