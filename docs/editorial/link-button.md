<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

Secondary CTA that navigates:

```tsx
import { LinkButton } from '@/components/atoms/LinkButton';

<LinkButton href="https://docs.example.com" size="default" animated>
  Read the docs
</LinkButton>
```

## Accesibilidad

- Ships as a real `<a href>` — keep a clear text label in `children` (string only).
- Default `target="_blank"` + `rel="noopener noreferrer"`: warn users when leaving the app, or override `target` for same-tab in-app routes.
- `disabled` sets `aria-disabled` but still renders an anchor — prefer removing the link or blocking navigation in the router when inactive.

### Correcto

- Siempre renderiza como `<a>` con href — es un link semantico, no un boton
- target='_blank' + rel='noopener noreferrer' aplicados automaticamente
- aria-disabled se agrega cuando `disabled={true}`
- focus-visible muestra outline para navegacion por teclado
- prefers-reduced-motion desactiva shimmer y transiciones

### Evitar

- No usar LinkButton para acciones (submit, delete) — usar Button con href o un `<button>`
- No pasar JSX como children — solo string (necesario para el shimmer gradient)
- No combinar con onClick para acciones — es un `<a>`, navega, no ejecuta

## Cuándo no usar

- In-page actions without navigation → `Button`.
- Icon-only chrome → `IconButton`.

## Criterio de uso

- Úsalo cuando la acción cambia de ubicación y el texto debe fluir dentro de un párrafo, card o CTA secundario.
- Conserva un `href` real. No conviertas el componente en un botón con `onClick`: perdería semántica, teclado y comportamiento esperado del navegador.
- `animated` funciona mejor como énfasis puntual; déjalo apagado en listas legales, tablas o interfaces donde el usuario repite navegación.

## Gotchas

- El contenido animado debe ser texto; si necesitas composición rica o una acción, usa el componente apropiado.
- Si el destino es externo y abre una pestaña nueva, comunica ese cambio en el contexto visible; si es navegación interna, configura el router para conservar la experiencia de la aplicación.
- **Nota**: Los nombres de size son diferentes a Button: usa 'sm' y 'default' en vez de 's' y 'm'. Esto es porque LinkButton sigue la escala tipografica, no la escala de componentes interactivos.
- **Nota**: CSS autocontenido. La animacion de underline y el shimmer son puro CSS — no necesitan JS.
- **Nota**: Todas las animaciones son puro CSS. No requieren GSAP ni JS. El shimmer se desactiva automaticamente con prefers-reduced-motion: reduce.
