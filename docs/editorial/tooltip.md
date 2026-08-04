<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

```html
<!-- CSS-only: casos simples, un trigger, cero JS -->
<button data-tooltip="Guardar cambios" data-tooltip-dir="top">Guardar</button>
```

```html
<!-- Smart (behavior tooltip.ts): grupos que viajan con Flip, edge detection -->
<div data-tooltip-smart data-tooltip-placement="top" data-tooltip-delay="0" data-tooltip-hide-delay="100">
  <button data-tooltip-trigger data-tooltip-group="filters"
          data-tooltip-content="Filtra por color">Color</button>
  <button data-tooltip-trigger data-tooltip-group="filters"
          data-tooltip-content="Solo ofertas">Sale</button>
</div>
<!-- + initTooltipSmart() de @atom-uikit/animations (AtomMotion.initAll() lo cubre) -->
```

## Cuál de los dos

| Caso | Mecanismo |
|---|---|
| Un hint sobre un icono o botón suelto | **CSS-only** (`data-tooltip`) — cero JS, cero costo |
| Fila de filtros/acciones donde el tooltip debe VIAJAR entre triggers | **Smart** (`data-tooltip-smart`) — Flip por grupo |
| Trigger pegado al borde del viewport | **Smart** — detecta bordes y se voltea solo |
| Necesitas delay de aparición o de salida | **Smart** (`data-tooltip-delay` / `data-tooltip-hide-delay`, en ms) |

## Accesibilidad

- El smart es **funcional** bajo `prefers-reduced-motion`: aparece y desaparece
  instantáneo (el original del que se adaptó lo apagaba por completo).
- `aria-describedby` real del trigger al popup, y **Escape** cierra sin mover
  el puntero (WCAG 1.4.13). Focus/blur equivalen a hover para teclado.
- El popup del smart usa `--primary`/`--primary-foreground`: inverso clásico y
  theme-aware — en dark el CSS-only (neutral-900 fijo) contrasta peor; para
  superficies dark prefiere el smart o la variante `data-tooltip-theme="light"`.

## Cuándo no usar

- Contenido interactivo (links, botones dentro del popup) → usa `Popover`/`DropdownMenu`;
  un tooltip es solo lectura y `pointer-events: none`.
- Información imprescindible para completar la tarea → ponla visible; el hover
  no existe en táctil.
- Textos largos o multilínea en desktop → usa un `Dialog` o texto inline.
