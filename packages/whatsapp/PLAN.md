# Iteration Plan: @atom-uikit/whatsapp

## Blocker: Backend Origin Validation

**This blocks production go-live.** The webhook endpoint at `cloudfunctions.net/api/webhook/wci` accepts any request with a valid Bearer token. Since the token is public (visible in the client's HTML), an attacker can spam the webhook with fake leads.

**Required backend changes (AtomChat Cloud Functions repo):**
- Validate `Origin` / `Referer` header against the client's registered domains in DB
- Rate limit by `companyToken` + IP (100 req/min/token recommended)
- Return 403 for requests from unregistered origins

This is a backend ticket, not an SDK change. The SDK already sends the correct `Origin` header automatically via `fetch`.

**Also needed: webhook idempotency.** If the same `chatId` arrives twice (network retry, edge case past debounce), the backend should upsert by `chatId`, not blindly insert. This prevents duplicate leads in the CRM.

---

## Phase 1: Core SDK (current)

Build the functional core. One script tag renders a button that opens WhatsApp with WCI tracking.

### Deliverables
- [x] Package scaffolding (package.json, tsconfig, tsup)
- [x] Source modules: config, chat-id, tracking, strategy, webhook, i18n, render, button, auto-init
- [x] CLAUDE.md, CHANGELOG.md, PLAN.md
- [x] Security audit fixes: sync currentScript, debounce, window.open order, onError, locale guard
- [x] exports field + unpkg entry in package.json
- [ ] Install tsup, verify `pnpm build` compiles ESM + IIFE
- [ ] Manual test: open `dist/auto-init.iife.js` in a test HTML page
- [ ] Verify webhook POST reaches AtomChat endpoint (Network tab)
- [ ] Verify WhatsApp opens with chatId in reference link
- [ ] Test with Brave Shields / uBlock Origin active
- [ ] Publish v0.1.0 to npm

### Success criteria
A single `<script>` tag with data-attributes renders a floating WhatsApp button, sends the WCI webhook, and opens WhatsApp. Works with adblockers active.

---

## Phase 2: Hardening + SPA Support

Production hardening, SPA lifecycle, and security features identified in industry audit.

### Deliverables
- [ ] Attach mode: verify `[data-atom-button]` elements get WCI behavior
- [ ] Verify debounce: instance-level flag blocks all buttons for 2s
- [ ] Cleanup function: verify SPA teardown removes button + styles + listeners
- [ ] `AtomWhatsApp.update({ message })` method for SPA route changes (Intercom pattern)
- [ ] CSP nonce support: accept `data-nonce` and apply to injected `<style>` tag
- [ ] SRI hash documentation: document jsDelivr integrity hash for enterprise clients
- [ ] Locale detection: test /pt, /en, /es URL paths
- [ ] Gclid extraction: test URL param + `_gcl_aw` cookie
- [ ] Device detection: verify mobile/tablet/desktop across UAs
- [ ] Edge cases: multiple buttons on same page, missing required attrs, malformed phone
- [ ] Publish v0.1.1

### Success criteria
Both float and attach modes work reliably across locales, devices, and edge cases.

---

## Phase 3: Documentation + GTM Template

Interactive docs page + GTM template. Same audience: non-technical clients.

### Docs configurator
- [ ] Explore UIKitDocumentation_ATOM project structure (Fumadocs? Astro? MDX?)
- [ ] Create WhatsApp Button docs page
- [ ] Live preview: renders the actual floating button with current config
- [ ] Customize controls: color picker, text input, position selector, phone, message
- [ ] Code output: snippet updates in real-time as controls change
- [ ] Copy button: copies ready-to-paste snippet to clipboard
- [ ] Usage section: npm install + ESM import example
- [ ] Attach mode documentation with examples
- [ ] SRI hash + CSP section in docs

### GTM template
- [ ] Create official GTM custom template for @atom-uikit/whatsapp
- [ ] Template fields: companyToken, phone, label, color, position, message
- [ ] Template injects the IIFE script tag with data-attributes from fields
- [ ] Submit to GTM Community Template Gallery (high ROI for non-tech clients)

### Success criteria
A non-technical user can either: (a) visit the docs page, customize visually, copy snippet, or (b) add the GTM template from the gallery and configure via GTM UI.

---

## Phase 4: Migration + Cleanup

Migrate Atom's own sites from Slater to the npm package. Clean up legacy infrastructure.

### Deliverables
- [ ] ATOMWebsite_2026: replace Slater snippet with `@atom-uikit/whatsapp` npm import
- [ ] AtomBrasilLP: replace Slater snippet with npm import
- [ ] Remove Sentry loader from Layout.astro (both projects)
- [ ] Remove `/vendor/sentry.min.js` rewrite from vercel.json (both projects)
- [ ] Remove `/vendor/wci.min.js` rewrite from vercel.json (both projects)
- [ ] Delete `atom-button-slater.js` from SoftwareDevProjects
- [ ] Verify both sites: button works, webhook fires, WhatsApp opens
- [ ] Deploy both sites to production

### Success criteria
Atom's own sites use the npm package. No Slater, no WCI proxy, no Sentry loader. Same button behavior, simpler infrastructure.

---

## Phase 5: Scale (future)

Only if the package grows beyond ~15KB or client needs diverge significantly.

### Potential work
- [ ] Split into `@atom-uikit/whatsapp-core` + `@atom-uikit/whatsapp-button`
- [ ] Server-side rendering support (React component wrapper)
- [ ] A/B testing for messages via data-attributes
- [ ] Analytics dashboard (aggregate webhook data)
- [ ] Custom webhook endpoints (for clients who want their own backend)
- [ ] Invisible chatId strategy (Unicode encoding -- complex, deferred)
- [ ] chatId length increase to 6-7 chars (requires backend migration)
- [ ] Visibility API: hide button when tab inactive
- [ ] Badge/notification dot on floating button
- [ ] Backend webhook idempotency: upsert by chatId, not insert

---

## Industry audit notes

### Patterns validated (matching Segment, Meta Pixel, Intercom, Crisp)
- Command queue (`_q` array drained on init) -- Segment canonical pattern
- Fire-and-forget webhook (fetch + keepalive) -- Meta Pixel Conversions API pattern
- Script tag API with data-attributes -- Crisp / BusinessChat pattern
- SPA cleanup via returned function -- Intercom shutdown equivalent
- CDN versioned URL via jsDelivr -- standard widget distribution

### Gaps vs mature SDKs (by phase)
| Gap | SDK reference | Phase |
|-----|--------------|-------|
| `update()` method for SPA route changes | Intercom | 2 |
| CSP nonce on injected styles | Crisp | 2 |
| SRI integrity hash docs | enterprise standard | 2 |
| GTM custom template | Intercom, Crisp | 3 |
| Visibility API hide/show | Crisp, Drift | 5 |
| Badge notification dot | Intercom, Crisp | 5 |
| Backend webhook idempotency (upsert) | Segment delivery ID | backend ticket |

---

## Timeline guidance

| Phase | Complexity | Dependencies |
|-------|-----------|-------------|
| Phase 1 | Low | None |
| Phase 2 | Medium | Phase 1 |
| Phase 3 | Medium | Phase 1, UIKitDocumentation_ATOM project |
| Phase 4 | Low | Phase 1 + Phase 2 verified |
| Phase 5 | High | Product decision based on usage data |
