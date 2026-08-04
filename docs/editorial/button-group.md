<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Aligned toolbar of related actions:

```tsx
import { ButtonGroup, ButtonGroupSeparator } from '@/components/atoms/ButtonGroup';
import { Button } from '@/components/atoms/Button';

<ButtonGroup orientation="horizontal" aria-label="Document actions">
  <Button variant="secondary" size="s">Edit</Button>
  <ButtonGroupSeparator />
  <Button variant="secondary" size="s">Share</Button>
  <Button variant="primary" size="s">Publish</Button>
</ButtonGroup>
```

## Accesibilidad

- Root exposes `role="group"` — always pass `aria-label` (or `aria-labelledby`) describing the set of actions.
- Separators are `aria-hidden`; do not put meaning only in the divider.

### Correcto

- role='group' se agrega automaticamente al container
- aria-label en el ButtonGroup describe el proposito del grupo
- ButtonGroupSeparator tiene aria-hidden='true' — no se anuncia
- Navegacion por teclado funciona: Tab mueve entre botones del grupo

### Evitar

- No anidar ButtonGroups — un solo nivel de agrupacion
- No mezclar tamaños distintos en un mismo grupo — rompe la alineacion visual
- No usar sin aria-label — el screen reader no puede describir el proposito del grupo

## Cuándo no usar

- Free-floating unrelated buttons in a page section — use spacing/layout, not `ButtonGroup`.
- Single primary CTA — use one `Button`, not a group of one.

## Criterio de uso

- Agrupa acciones que operan sobre el mismo objeto o flujo y que necesitan leerse como una unidad.
- Usa orientación horizontal en toolbars y vertical cuando el espacio o el contexto móvil exija acciones apiladas.
- Pasa un nombre accesible al grupo; el agrupamiento visual no explica por sí solo la relación entre controles.

## Gotchas

- El grupo controla el colapso de bordes y radios. No añadas márgenes individuales entre hijos porque crearás separaciones inconsistentes.
- Mantén el orden de acciones de menor a mayor compromiso y evita mezclar acciones sin relación sólo para ahorrar espacio.
- **Nota**: Este CSS requiere que los botones hijos ya tengan sus estilos (Button o IconButton standalone CSS). ButtonGroup solo maneja el layout y radius collapse.
