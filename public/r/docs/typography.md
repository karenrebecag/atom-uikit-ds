<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Page heading + body:

```tsx
import { TypographyH1, TypographyP, TypographyMuted } from '@/components/atoms/Typography';

<TypographyH1>Design system</TypographyH1>
<TypographyP>Ship consistent UI with shared tokens and components.</TypographyP>
<TypographyMuted>Last updated today.</TypographyMuted>
```

## Accesibilidad

- Use the semantic export that matches rank (`TypographyH1`…`H4`) — do not style a `p` to look like an h1.
- Keep one logical h1 per view; nest ranks without skipping levels when possible.

### Correcto

- Elementos HTML semanticos correctos: h1-h4, p, blockquote, ul, code, small
- Jerarquia de headings: h1 solo una vez por pagina, h2-h4 en orden descendente
- line-height minimo 1.5 en body text (WCAG 1.4.12)
- Fluid scaling mantiene proporciones — el texto nunca se corta ni desborda
- -webkit-font-smoothing: antialiased mejora legibilidad en macOS

### Evitar

- No usar .h1 en un `<div>` — usar TypographyH1 que renderiza `<h1>` semantico
- No saltar niveles de heading (h1 → h3 sin h2)
- No usar font-size en px para texto body — usar rem para que escale con el sistema
- No desactivar el scaling system — rompe la consistencia tipografica responsive

## Cuándo no usar

- Marketing brand wordmarks that need custom art → dedicated logo asset, not type scale hacks.
- Interactive labels (buttons/links) → the control’s own text slot, not a bare Typography wrapper that steals focus semantics.

## Criterio de uso

- Usa el nivel semántico que corresponde a la estructura del contenido y deja que la escala visual venga del token, no de un heading incorrecto.
- Mantén una jerarquía legible: un h1 por vista y niveles anidados sin saltos innecesarios.
- Usa la variante mono sólo para valores que se benefician de alineación o lectura técnica, no como decoración general.

## Gotchas

- El nombre del export determina el elemento HTML; no uses un `TypographyH1` sólo para conseguir tamaño si el contenido no es un heading.
- Las clases tipográficas son BEM globales y deben cargarse desde el CSS publicado, no quedar aisladas en CSS Modules.
- **Nota**: Todos aceptan children (ReactNode), className, y todos los atributos HTML nativos del elemento que renderizan.
- **Ojo**: Los breakpoints son de container, no de tipografia. La tipografia nunca tiene media queries propias — escala fluidamente con --size-font. Los breakpoints solo redefinen el rango de clamp y el ideal width.
- **Ojo**: El CSS standalone incluye el scaling root simplificado (solo desktop). Para responsive completo, usa el atom.css original que incluye los 4 breakpoints.

## Notas de diseño

---

`<Callout type="info">`
Typography requiere el import de atom.css completo (incluye scaling.css + typography.css). Sin scaling, los rem no se adaptan al viewport.
`</Callout>`

## Arquitectura tipografica

Typography en ATOM UIKit sigue el patron **shadcn**: no es un solo componente con un prop `variant` — son componentes individuales por rol semantico (TypographyH1, TypographyP, TypographyMuted, etc.). Cada uno renderiza el elemento HTML correcto con la clase CSS correspondiente.

El sistema se compone de 3 capas:

`<Steps>`
`<Step>`
### Tokens tipograficos (primitives)

Escala Major Third (1.25): 10 pasos de font-size, 10 line-heights pareados 1:1, 3 letter-spacings, 4 font-weights.
`</Step>`
`<Step>`
### Fluid scaling (scaling.css)

Un sistema que escala todos los rem proporcionalmente al viewport. body \{ font-size: var(--size-font) } donde --size-font se calcula desde el viewport width.
`</Step>`
`<Step>`
### Clases tipograficas (typography.css)

Clases como .h1, .body, .caption, .label que combinan font-size + line-height + weight + letter-spacing de los tokens.
`</Step>`
`</Steps>`
