# @atom-uikit/whatsapp

## 0.1.0 (unreleased)

Initial release. Replaces the external `wci.min.js` script with an inline, self-contained WhatsApp CTA widget.

### Added

- `initWhatsAppButton()` -- main API, returns cleanup function for SPA teardown
- Floating button with inline CSS (no external stylesheet dependency)
  - WhatsApp SVG icon, pill shape, configurable color/text/position
  - Responsive: icon-only on mobile (<480px)
  - Respects `prefers-reduced-motion`
- Inline WCI tracking (no external script to load or get blocked):
  - 5-char chatId generation via `crypto.getRandomValues()`
  - Webhook POST to AtomChat backend with `keepalive: true`
  - URL strategy: appends `?wci={chatId}` as reference link
  - ReferenceCode strategy: appends code text to message
- Tracking data collection: URL params, gclid (URL + cookie), device detection
- GA4 integration: pushes `atom_cta_click` to `dataLayer`
- Locale auto-detection from URL path and `<html lang>`
- Default messages in es/en/pt
- Two modes: `float` (auto-render) and `attach` (existing elements only)
- Dual build: ESM (npm/bundlers) + IIFE (CDN/script tags)
- Auto-init from `<script>` data-attributes (IIFE build)
- Command queue support for async loading
- Granular exports: `generateChatId`, `buildMessage`, `sendWebhook`, `collectTrackingData`

### Removed (vs previous architecture)

- External `wci.min.js` dependency (~19KB, blocked by adblockers)
- Need for first-party proxy (Vercel rewrites, Cloudflare Workers)
- Fallback timeout/onerror logic (no external script to fail)
- Sentry error monitoring (no failure mode to monitor)
- Slater snippet (~300 lines, replaced by one `<script>` tag)
