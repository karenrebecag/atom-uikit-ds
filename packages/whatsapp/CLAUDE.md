# @atom-uikit/whatsapp

WhatsApp CTA widget with inline WCI tracking. One script tag, zero external dependencies, immune to adblockers.

## DEPRECADO Y CONGELADO 2026-07-22 — el núcleo vive en `atom-whatsapp-buttons`

**Este paquete no recibe cambios.** Toda evolución del widget (JS y CSS) ocurre en el repo
standalone; el CSS del DS (`packages/css/.../whatsapp-button.css`) es un archivo GENERADO que se
sincroniza con `pnpm --filter @atom-uikit/css sync:whatsapp`. El consumidor React documentado usa
el `Button` del DS con override de colores — no el runtime de este paquete. El resto de este
documento se conserva como referencia histórica y contexto del port.

## ESTADO 2026-07-22 — distribución reemplazada por `atom-whatsapp-buttons`

La distribución pública de este widget vive ahora en un repo standalone:
**[AtomGrowth/atom_whatsapp_buttons](https://github.com/AtomGrowth/atom_whatsapp_buttons)**,
desplegado en `https://atom-whatsapp-buttons.vercel.app/v1/loader.js` (major en la URL, loader
evergreen, assets inmutables). Ese repo es un **port evolucionado** de este paquete: misma
arquitectura WCI, más cascada de números por idioma/región, telemetría a Cloudflare Analytics
Engine, espejo de leads en el edge y dashboard de marketing. Su carpeta `spec/` es la fuente de
verdad de las decisiones.

Este paquete queda para **consumidores npm/React del monorepo** (componente `Button` del DS con
override de colores) y como referencia MCP. La duplicación de lógica WCI entre ambos es deuda
conocida (D1 del repo standalone). **Para instalar el widget en cualquier sitio, usar siempre el
loader del repo standalone — no el IIFE de este paquete.**

Correcciones a este documento verificadas en producción:

- **Endpoint del webhook:** `https://api.atomchat.io/wci` y
  `https://us-central1-atom-ai.cloudfunctions.net/api/webhook/wci` son el MISMO backend — la
  primera es un Worker de Cloudflare (`atom-wci-proxy`) que proxea a la segunda. Verificado con
  POSTs el 2026-07-22. Usar siempre la primera: pasa por el espejo de analítica.
- **CSP:** ya no se necesita `unsafe-inline` en `style-src` — los estilos dinámicos van por CSSOM,
  que CSP no restringe. CSP actual del widget desplegado:
  `script-src/style-src atom-whatsapp-buttons.vercel.app · connect-src api.atomchat.io atom-whatsapp-buttons.vercel.app`.
- **El bloqueante de backend (validación de Origin) sigue abierto** y se resolverá con reglas WAF
  desde el panel de Cloudflare (fase F3 del repo standalone), no con un ticket de backend.

## Integraciones verificadas en producción

### WordPress / Elementor (atomchat.io)

Plugin oficial: `atom-whatsapp-buttons/integrations/wordpress/atom-whatsapp-buttons-wp/` (zip
instalable). Config global en Ajustes → WhatsApp Atom (token, cascada de números, flotante,
override de idioma para WP con locale distinto del contenido). Botones puntuales con el widget
**Shortcode** de Elementor:

    [atom_wa_button cta="hablar_asesor" size="l" label="Hablar con un asesor" animated="false"]

Atributos: `cta` (agendar_demo | hablar_asesor | demo_5min | consultar_precio), `variant`
(inline | pill | icon), `size` (xs–xl), `phone` (gana sobre toda la cascada), `label`, `message`,
`lang`, `animated="false"` (además mueve el icono a la izquierda). En el editor de Elementor el
botón NO renderiza (iframe sin loader) — se ve en la página publicada. Botones dentro de Popups
necesitan `AtomWaButtons.refresh()` en el evento `elementor/popup/show`.

### Webflow (new.atomchat.io)

Snippet global en Site Settings → Custom Code → Footer:

    <script
      src="https://atom-whatsapp-buttons.vercel.app/v1/loader.js"
      data-company-token="..."
      data-phone="573142616335"
      data-phone-es="5493364344757"
      data-mode="attach"
      data-cfasync="false"></script>

- **`data-cfasync="false"` es OBLIGATORIO**: el zone corre Rocket Loader, que sin la marca
  reescribe el script (`type="hash-text/javascript"`) y mata la telemetría. Lección de la primera
  instalación real.
- **Sin `data-lang`**: Webflow Localization declara el idioma por página (URL `/en` + `<html
  lang>`); un `data-lang` fijo rompería el ruteo multi-locale.
- Botones: componentes nativos de Webflow (Link Block con custom attributes `data-atom-button` +
  `data-cta`, href de fallback a `wa.me`) — visibles en el Designer, estilados por el sitio, el
  SDK solo aporta comportamiento. También funcionan mounts `data-aa-mount="wa-button"` en Embeds
  (invisibles en el Designer).

### Migración desde el sistema legacy — orden OBLIGATORIO

Activar nuevo → verificar el par `click`+`wci_lead` con el mismo chatId → retirar el viejo.
**Nunca convivencia**: el SDK legacy también engancha `[data-atom-button]` y la convivencia
produce secuestro de botones y leads duplicados con chatIds distintos (verificado en producción).
El legacy del apex vivía en el Slater JS del sitio (archivado en
`atom-whatsapp-buttons/legacy/slater-wci/`), no solo en el plugin. Quedan consumidores legacy:
`n.atomchat.io` y `brazil.atomchat.io` (sirven `/vendor/wci.min.js` propio).

## Why this exists

AtomChat's original WCI integration required loading an external script (~19KB) from a third-party CDN. Adblockers block that domain, breaking the button for ~15-20% of users. This package inlines the essential WCI logic (~4KB) so there is nothing external to block.

## Security Model

### companyToken is public by design

The `data-company-token` is visible in the client's HTML source. This is intentional and follows the same model as Stripe publishable keys, Intercom app IDs, and GA4 measurement IDs. The token is a **write-only, scoped identifier** — it can only be used to send webhook events to AtomChat, not to read or modify data.

**Backend requirements (AtomChat Cloud Functions):**
- Validate `Origin` / `Referer` header against the client's registered domains
- Rate limit by `companyToken` + IP (recommended: 100 req/min/token)
- Reject requests without valid `Origin` in production
- The `companyToken` identifies which customer the lead belongs to, not an auth secret

### CSP (Content-Security-Policy)

If the client's site uses CSP headers, they must allowlist the CDN and the webhook endpoint:

```
script-src 'self' cdn.jsdelivr.net;
connect-src 'self' us-central1-atom-ai.cloudfunctions.net;
style-src 'self' 'unsafe-inline';
```

`unsafe-inline` for styles is required because the floating button injects a `<style>` tag. Document this in the installation guide.

## Architecture

```
auto-init.ts          IIFE entry: reads <script> data-attributes, calls init
     |
button.ts             Orchestrator: initWhatsAppButton()
     |
     +-- config.ts    Types, defaults, data-attribute parser
     +-- i18n.ts      Locale detection, default messages/labels
     +-- render.ts    DOM: injects CSS + creates floating button
     +-- chat-id.ts   Generates 5-char alphanumeric ID (crypto.getRandomValues)
     +-- tracking.ts  Collects URL params, gclid, device type
     +-- strategy.ts  Embeds chatId into WhatsApp message (url or referenceCode)
     +-- webhook.ts   POST to AtomChat backend (fire-and-forget)
```

### Two entry points

| Entry | Format | Consumer | Build |
|-------|--------|----------|-------|
| `src/index.ts` | ESM | npm, bundlers | `dist/index.js` |
| `src/auto-init.ts` | IIFE | CDN, `<script>` tags | `dist/auto-init.iife.js` |

The ESM entry exports functions for programmatic use. The IIFE entry auto-initializes from `document.currentScript.dataset`.

### Two modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| `float` (default) | No `data-mode` or `data-mode="float"` | Renders a floating button + attaches to `[data-atom-button]` elements |
| `attach` | `data-mode="attach"` | Only attaches to existing `[data-atom-button]` elements, no floating button |

## WCI Protocol

WCI (Web Chat Integration) tracks WhatsApp clicks for lead attribution. The protocol is:

1. **Generate chatId** -- 5 alphanumeric characters via `crypto.getRandomValues()` with `Math.random()` fallback. Character set: `A-Za-z0-9`. This ID links the click to the conversation in AtomChat's CRM.

2. **Collect tracking data** -- URL query params, Google Ads click ID (gclid from URL or `_gcl_aw` cookie), device type (UA-based), and current page URL.

3. **Send webhook** -- `POST` to `https://us-central1-atom-ai.cloudfunctions.net/api/webhook/wci` with:
   - Header: `Authorization: Bearer {companyToken}`
   - Header: `Content-Type: application/json`
   - Body: `{ chatId, url, device, gclid, ...urlParams }`
   - Options: `keepalive: true` (survives page navigation)
   - Fire-and-forget: errors are swallowed silently (must never block WhatsApp redirect)

4. **Build enhanced message** -- Appends tracking info to the user's message:
   - `url` strategy: `{message}\n\nEnlace de referencia: {pageUrl}?wci={chatId}`
   - `referenceCode` strategy: `{message}\n\nCodigo de referencia: {chatId}`

5. **Redirect to WhatsApp** -- `window.open('https://wa.me/{phone}?text={encodedMessage}', '_blank')`

### Webhook endpoint

The webhook URL is hardcoded to AtomChat's Cloud Functions endpoint. This is intentional -- it is NOT on adblocker blocklists (Google Cloud Functions domain). The `companyToken` in the Authorization header identifies which AtomChat customer the lead belongs to.

## Data Attributes API

All configuration for CDN/script-tag users is via `data-*` attributes on the `<script>` element:

| Attribute | Required | Default | Type |
|-----------|----------|---------|------|
| `data-company-token` | Yes | -- | string |
| `data-phone` | Yes | -- | string (digits, may include +/spaces) |
| `data-label` | No | "Contactanos" (locale-dependent) | string |
| `data-color` | No | "#25D366" | hex color |
| `data-text-color` | No | "#FFFFFF" | hex color |
| `data-position` | No | "bottom-right" | "bottom-right" or "bottom-left" |
| `data-message` | No | "Hola, quiero mas informacion" (locale-dependent) | string |
| `data-lang` | No | auto-detect from URL/HTML | "es", "en", or "pt" |
| `data-strategy` | No | "url" | "url" or "referenceCode" |
| `data-mode` | No | "float" | "float" or "attach" |

## Programmatic API (ESM)

```ts
import { initWhatsAppButton } from '@atom-uikit/whatsapp';

const cleanup = initWhatsAppButton({
  companyToken: '...',
  phone: '573142616335',
  chatIdStrategy: 'url',
  mode: 'attach',
});

// SPA navigation: remove listeners and DOM
cleanup();
```

### Granular exports

```ts
import { generateChatId } from '@atom-uikit/whatsapp';
import { buildMessage } from '@atom-uikit/whatsapp';
import { sendWebhook } from '@atom-uikit/whatsapp';
import { collectTrackingData } from '@atom-uikit/whatsapp';
```

## Floating Button (render.ts)

Self-contained: injects a `<style>` block and a `<button>` into the DOM. No external CSS dependency.

- WhatsApp SVG icon (inline, 24x24)
- Pill shape (`border-radius: 999px`)
- Fixed position, z-index 9999
- Hover: `scale(1.05)` + deeper shadow
- Active: `scale(0.97)`
- Mobile (<480px): label hidden, icon-only
- `prefers-reduced-motion`: transitions disabled
- Style element ID: `atom-wa-styles` (prevents duplicate injection)

Colors, text, and position are configurable via data-attributes. No design tokens dependency -- the floating button is self-contained so it works on any site without `@atom-uikit/css`.

## Build

```bash
pnpm --filter @atom-uikit/whatsapp build
```

Uses tsup (not tsc) because we need dual output:
- ESM from `src/index.ts` for npm
- IIFE from `src/auto-init.ts` for CDN

The IIFE build is minified and exposes `window.AtomWhatsApp`.

## Command Queue

For async script loading, clients can use a stub that buffers calls:

```html
<script>
  window.AtomWhatsApp = window.AtomWhatsApp || { _q: [] };
  window.AtomWhatsApp.init = function() {
    window.AtomWhatsApp._q.push(['init', [].slice.call(arguments)]);
  };
</script>
<script src="..." async></script>
```

When `auto-init.ts` loads, it drains the queue.

## Conventions

- **Zero hardcoded tracking domains.** All webhook calls go to the AtomChat endpoint, which is NOT on adblocker lists.
- **Fire-and-forget webhooks.** Never block the WhatsApp redirect for tracking. The user always gets to WhatsApp.
- **Sync-first click handling.** `window.open()` MUST fire synchronously in the click handler tick. Webhook and dataLayer push happen AFTER. This prevents popup blockers on iOS Safari.
- **Debounce.** Click handler uses a 2s debounce via `data-atom-pending` attribute to prevent double-click spam.
- **No external dependencies.** No GSAP, no CSS imports, no third-party scripts. The IIFE build is fully self-contained.
- **Cleanup functions.** `initWhatsAppButton()` returns a `CleanupFn` for SPA teardown. All event listeners use `AbortController`.
- **Progressive enhancement.** If `crypto.getRandomValues` is unavailable, falls back to `Math.random`. If `fetch` fails, the webhook is lost but WhatsApp still opens.
- **Error observability.** Pass `onError` callback in config to capture webhook failures without breaking the user flow.
- **`document.currentScript` captured synchronously.** The IIFE entry captures the script reference at parse time, before any async operations, to survive `async`/`defer` loading.

## Testing Checklist

- [ ] CDN: `<script data-company-token="..." data-phone="...">` renders floating button
- [ ] Click: WhatsApp opens with `?wci=XXXXX` in the reference link
- [ ] Webhook: POST visible in Network tab with correct headers and chatId
- [ ] Adblocker (Brave Shields, uBlock): button renders and works
- [ ] Attach mode: `[data-atom-button]` elements get click behavior
- [ ] Mobile: button collapses to icon-only below 480px
- [ ] GA4: `atom_cta_click` event in dataLayer
- [ ] Locale auto-detect: correct message for /pt, /en, /es paths
- [ ] SPA: `cleanup()` removes button, styles, and listeners
- [ ] Multiple clicks: no duplicate webhooks (debounce via wciLoading)
- [ ] ChatId format: exactly 5 alphanumeric characters

## File Map

```
packages/whatsapp/
  CLAUDE.md             This file
  CHANGELOG.md          Version history
  PLAN.md               Iteration roadmap
  package.json          npm config, scripts, exports
  tsconfig.json         TypeScript (extends root)
  tsup.config.ts        Dual build: ESM + IIFE
  src/
    index.ts            Public ESM exports
    auto-init.ts        IIFE entry: data-attributes -> init
    config.ts           Types, defaults, data-attribute parser
    button.ts           initWhatsAppButton() orchestrator
    render.ts           Floating button DOM + inline CSS
    chat-id.ts          5-char ID generator
    tracking.ts         URL params, gclid, device detection
    strategy.ts         chatId -> message embedding
    webhook.ts          POST to AtomChat
    i18n.ts             Locale detection, default strings
```
