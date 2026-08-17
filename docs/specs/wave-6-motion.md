# Wave 6 — Motion firma ATOM

**Estado: APROBADO 2026-08-03 — decisiones D1-D6 firmadas por Karen (§4).**
Reemplaza al spec diferido que vivía en `~/Desktop/atom-web-ds-specs` (carpeta
perdida); este vive en el repo para que no vuelva a pasar. Con esta firma, la
regla "W6 no arranca sin spec aprobado" de CLAUDE.md queda satisfecha.

Objetivo: que el DS **se sienta** ATOM — la dirección visual ya aprobada
(2026-07-28) — sin romper ninguna ley del repo: tokens-only, layouts no animan,
`prefers-reduced-motion`, contratos DOM para el canal Webflow.

## 1. Inventario medido (espejo local de ATOM, `js/main.js` + `css/main.css`)

Valores extraídos del código real, no de impresiones:

| Qué | Medido |
|---|---|
| Ease firma | `CustomEase("osmo", "0.625, 0.05, 0, 1")` — **idéntico a nuestro token `easing-osmo`** |
| Eases secundarios | `expo.out` (equivale a nuestro `easing-out`), `power1-3.inOut` |
| Duraciones micro | 0.25 / 0.3 / 0.4 s (hovers, toggles, UI) |
| Duraciones macro | 0.8 / 1 / 1.2 s (reveals, transiciones) |
| Duraciones hero | 1.4 / 1.8 / 2 s (entradas grandes) — nuestros `duration-1200/1800` ya reservados |
| Staggers | 0.03 / 0.05 / 0.075 s |
| Stack | GSAP + ScrollTrigger + Observer + Draggable + SplitText, **Lenis** (smooth scroll), **Barba** (transiciones de página) |
| CSS propio | usa variables (`--animation-default`, `--cubic-default`) — misma filosofía que nosotros |

Patterns sistémicos identificados (los page-specific se descartan):
smooth scroll (Lenis), cambio de tema por sección al scrollear
(`data-theme-section` → nav invierte sobre secciones dark), transiciones de
página (Barba), reveals con stagger (cards y SplitText), hover de botones con
rotación, marquees (CSS y radial), footer con parallax reveal, cursor custom,
sliders, modales con clip-path, detección de dirección de scroll.

## 2. Cruce contra el DS (qué existe, qué falta)

| Pattern ATOM | En el DS | Gap |
|---|---|---|
| Ease/duraciones firma | tokens `easing-osmo`, `duration-1200/1800` | aplicarlos: hoy casi nada los consume |
| Text reveal | `text-reveal.ts` funcional | literales hardcodeados (0.8/0.08…) → tokenizar |
| Marquee | `marquee-draggable.ts` completo | ninguno |
| Scroll direction / nav | `nav-autohide.ts` | ninguno |
| Hover botones | `button-hover.ts` | enriquecer al carácter ATOM (decisión de valores) |
| Reveal de secciones/cards con stagger | **no existe** | behavior nuevo `scroll-reveal` (el de mayor impacto) |
| Tema por sección al scroll | **no existe** | behavior nuevo `section-theme` |
| Transiciones de página | **no existe** | `page-transition` — **View Transitions API nativa, no Barba** (regla reuse: plataforma antes que dep) |
| Smooth scroll | **no existe** | D1 — Lenis es dep nueva (bloqueada sin tu OK) |
| Footer parallax, cursor, modales clip-path | **no existen** | W6c decorativos |
| Staggers como sistema | **no hay tokens de stagger** | D3 |

## 3. Plan por sub-waves

### W6a — Fundamentos (el 80% del "se siente ATOM")

1. **Tokens nuevos** (`packages/tokens/src/primitives/motion.json`):
   `stagger-1/2/3` (D3) y — si D2 lo aprueba — `duration-250`/`duration-400`.
2. **Tokenizar `text-reveal`** con el patrón `readMotionTokens` de
   `menu-button.ts` (referencia canónica). El ratchet de conformance baja su
   baseline en el mismo PR.
3. **Behavior nuevo `scroll-reveal.ts`**: reveal genérico por
   IntersectionObserver con stagger, dirigido por atributos
   (`data-reveal`, `data-reveal-stagger`, `data-reveal-delay`), ease firma,
   `prefers-reduced-motion` + `data-motion-exempt` (decorativo). Contrato DOM
   exportado → viaja al canal Webflow solo.
4. **Behavior nuevo `section-theme.ts`**: `data-theme-section` invierte
   `data-theme` del nav/hijos al cruzar secciones (mecánica CSS del DS ya
   soporta `data-theme` por nodo).

### W6b — Transiciones y micro-detalle

5. **`page-transition.ts`** sobre View Transitions API nativa (cero deps,
   progressive enhancement: sin soporte → corte normal). Ease/duración por
   tokens vía CSS `::view-transition-*`.
6. **Micro-detalle CSS** (sin JS): `::selection`, focus rings con
   `easing-osmo`, scrollbar, `transition` de hovers de cards/links a
   `var(--duration-*) var(--easing-osmo)`.
7. **Enriquecer `button-hover`** al carácter ATOM (valores D5).

### W6c — Decorativos (posterior, cada uno con gate propio)

8. Footer parallax reveal; modales con clip-path (tokens); cursor custom (D4);
   slider/carousel es COMPONENTE nuevo (flujo `component-agent-flow.md`), no
   solo behavior.

## 4. Decisiones — RESUELTAS (firma Karen, 2026-08-03)

| # | Decisión | Resolución firmada |
|---|---|---|
| D1 | Smooth scroll | CSS `scroll-behavior` + GSAP existente primero. Lenis SOLO si el feel no alcanza, como decisión nueva (es dep) |
| D2 | Duraciones 0.25/0.4 de ATOM | Mapear a `duration-200/300/500` existentes. Tokens nuevos solo si el oído lo exige al calibrar (decisión nueva) |
| D3 | Tokens de stagger | Aprobados: `stagger-1: 30ms`, `stagger-2: 50ms`, `stagger-3: 75ms` |
| D4 | Cursor custom | **Sí, como componente opcional independiente, SIEMPRE desactivado por default (accesibilidad)**. Nunca viaja ON en ningún canal |
| D5 | Defaults de motion por canal | **Canales no-code (Webflow paste + MCP): animado `true` por default, opt-out explícito con `false`** (extiende F10-C6). **Canal CLI/código: siempre editable como prop `animated: boolean`** — el consumidor decide |
| D6 | Canal Webflow | `scroll-reveal` y `section-theme` entran al paste desde W6a |

La política D5 es transversal: todo behavior nuevo de W6 la implementa desde su
primer PR (default por canal, no default global). D4 crea un componente
(`cursor`) que sigue `component-agent-flow.md` completo, con
`data-motion-exempt` y opt-in explícito como único modo de activación.

## 5. Criterios de aceptación

- **W6-C1** — Tokens nuevos publicados y consumidos: cero literales nuevos en
  behaviors; `text-reveal` sin literales (baseline del ratchet baja, nunca sube).
- **W6-C2** — `scroll-reveal` y `section-theme` con contrato DOM exportado,
  invariante querySelector↔hooks verde, y emitidos en el canal Webflow.
- **W6-C3** — E2E en ds-lab: paste de un componente con reveal → anima con el
  ease firma. Firma Karen (como F7/F10-C6).
- **W6-C4** — `prefers-reduced-motion` verificado en todos los behaviors
  nuevos; decorativos con `data-motion-exempt`; funcionales documentan por qué no.
- **W6-C5** — Storybook: stories de los behaviors nuevos con el patrón de
  controles del repo; visual regression en verde o baselines regenerados en el
  mismo PR.
- **W6-C6** — Layouts siguen sin animar (gate de layout-contract intacto).
- **W6-C7** — Escalera completa del `component-agent-flow.md` en verde +
  tablero F16: los behaviors nuevos con manifest/editorial si aplica.

## 6. Estimación

- W6a: 2-3 sesiones (tokens + tokenizar + 2 behaviors).
- W6b: 2 sesiones. W6c: 1-2 por pieza, según D4/alcance.
- Cada sesión entrega verde completo; sin verde no se pasa a la siguiente.
