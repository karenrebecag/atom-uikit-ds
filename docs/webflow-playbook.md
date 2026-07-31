# Webflow / Relume playbook — Atom DS

How to consume the Atom design system on Webflow sites (atomchat / marketing)
without making Webflow the source of truth.

**Model (ADR 009): one master site + Shared Library.** The MCP variable sync targets
ONLY the master. Consumer sites never receive direct MCP applies — they install the
Library and accept updates from Webflow's native UI.

## Source of truth

| Layer | Where it lives | How it reaches Webflow |
|---|---|---|
| Tokens (JSON) | `packages/tokens/src/**` in `atom-uikit-ds` | Build → `tokens-nested.json` → `sync-webflow.mjs --plan` → **Webflow MCP** → Variables on MASTER → Shared Library → consumer sites |
| Components (anatomy) | Master site components bound to Variables | Shared Library install/update |
| CSS foundation | `packages/css` → `dist/foundation.css` | Public CDN `/v1/foundation.css` in **Custom Code → Head** (per site) |
| Fonts | `packages/css/src/fonts` + dist | CDN `./fonts/*.woff2` **and** upload to Project Settings → Fonts (per site, canvas preview only) |

**Never** edit Variable values by hand — not in the master (the next sync overwrites
them) and not in consumer sites (the next Library update overwrites them). New value =
JSON PR → sync → Library update.

## Why the sync goes through the Webflow MCP (verified 2026-07-28)

Webflow Variables are **not** on the REST Data API (`api.webflow.com/v2`) — they only
exist on the Designer API surface, which the official Webflow MCP wraps
(`data_variable_tool`: collections, variables, **modes**, `query_variables`).
So the flow is: script compiles a typed plan → an MCP session (Claude Code with the
Webflow MCP connected and the MASTER site authorized) applies it.

Apply protocol for the MCP session, per plan run (master only):

1. `query_variables` scoped to collection "Atom DS v1" → map existing name → id/value.
2. Create the collection and the `dark` mode if missing.
3. For each plan variable: missing → `create_*_variable`; value differs → `update_*_variable`;
   colors with `dark` → additional `update_color_variable` with the dark `mode_id`.
4. Report created / updated / unchanged / orphans. **Never delete orphans automatically.**
5. Second consecutive apply must report ~100% unchanged (idempotency gate).

## Master site setup (one time, Karen)

1. **Create** site "Atom UIKit | Library" in the Atom Workspace. Never attach a
   production domain; it exists to hold the system, not to publish content.
2. **Authorize** the Webflow MCP on the master site.
3. **Sync variables**
   ```bash
   pnpm --filter @atom-uikit/tokens build
   node scripts/sync-webflow.mjs --plan wf-plan.json
   ```
   Apply via MCP session following the protocol above.
4. **Fonts**: upload Inter Tight, Grift, Interval, Gantol (woff2 from
   `packages/css/src/fonts`) to Project Settings → Fonts.
5. **No head custom code on the master.** The master stays on the free site plan
   (no Custom Code) and doesn't need it: the canvas never loads head code on any plan,
   and the master never publishes to a domain. The `/v1/foundation.css` link belongs to
   CONSUMER sites (which have paid plans). If a published style-guide preview with
   foundation.css is ever wanted, use an Embed element in the page body or upgrade the
   master to Basic — optional, blocks nothing.
6. **Build the system pages**: style guide page + core components (button, card,
   section, nav, …) styled ONLY with Variables from "Atom DS v1" — never relying on
   foundation.css classes, so the canvas is faithful without external CSS. Components
   carry the canonical anatomy — they are the Webflow equivalent of `layout/<slug>` in
   the registry. Register them under the group **"Atom DS"**; anything meant for reuse
   MUST be a component (see "What the Library carries").
7. **Publish as Shared Library** named "Atom UIKit" (dashboard action): variables +
   components + assets.

## Consumer site checklist (per new site — no MCP, no scripts)

1. Install the "Atom UIKit" Library → variables, components AND custom fonts arrive.
2. Paste the head snippet (`/v1/foundation.css`) in Custom Code → Head.

That is the whole checklist. Custom fonts travel with the Library, so there is no
per-site font upload.

### ⚠ `foundation.css` is for GREENFIELD or FULLY-MIGRATED sites only

`foundation.css` declares a global `body { font-family; font-size; line-height; color }`
rule plus generic classes (`.container`, `.section`, `.h1`–`.h6`, `.body`, `.label`,
`.blockquote`, `.lead`, `.code`, `.muted`, …). Dropping it into the head of a site that
already has its own system **restyles that site**. Measured on atomchat.io (2026-07-30):
10 direct class collisions — `h1`–`h6`, `body`, `label`, `blockquote`, `text-gradient` —
on top of the global `body` rule.

**For a partial migration — the DS on some pages of a live site — use
`/v1/embed.css` instead** (ADR 006): the same DS scoped under `.atom-embed`, so it paints
only inside that wrapper and cannot reach the host page. Load it as **page-level** custom
code on the page being migrated, and wrap that page's DS content in a `.atom-embed` div.
That gives scoping twice over: by page, and by selector.

## What the Library carries (verified 2026-07-30)

| Item | Travels via Library? |
|---|---|
| Variables — collection "Atom DS v1" + `dark` mode | Yes |
| Custom fonts — Inter Tight, Grift, Interval, Gantol | Yes |
| Components — group "Atom DS" | Yes |
| Assets | Yes |
| Standalone utility classes (`heading-style-h1`, `section`, `container-large`) | **No** |

Library classes are namespaced and travel only as part of a component that uses them.

**Consequence — the rule that governs what the master must publish:** any pattern
designers are meant to reuse has to ship as a **component**, not merely as a class.
A class that no component uses does not exist for consumer sites. Utility/typography
classes still reach *published* consumer pages through `/v1/foundation.css` — that is
precisely why both channels exist (see the two-channel table below).

## Motion (behaviours) on Webflow

Motion splits in two, and each half travels its own way:

| Half | Where it lives | How it reaches Webflow |
|---|---|---|
| **Values** — duration, easing | `packages/tokens` → CSS custom properties | `/v1/tokens.css` (see note below) |
| **Behaviours** — the animations | `packages/animations` → IIFE bundle | `/v1/animations.js`, global `AtomMotion` |

The bridge is `readMotionTokens`: the modules read `--easing-osmo` and `--duration-*`
from the DOM **at runtime**, so a token change re-tunes every consumer without touching
JS. That is why the same behaviours work in React, Astro, Webflow or WordPress.

**Motion tokens are NOT synced as Webflow Variables, on purpose.** Webflow only types
Color / Size / Number / Percentage / FontFamily — there is no duration or easing type,
and a `cubic-bezier()` has nowhere to live. The correct carrier is `tokens.css`, which is
**safe to load site-wide**: it declares only `:root` and `[data-theme="dark"]`, no element
selectors and no generic classes, so unlike `foundation.css` it cannot collide with a
host site's styles.

Setup on a Webflow site (site-wide custom code, before `</body>`):

```html
<link rel="stylesheet" href="https://atom-web-ds.vercel.app/v1/tokens.css">
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
<script src="https://atom-web-ds.vercel.app/v1/animations.js"></script>
<script>AtomMotion.initAll();</script>
```

Then animate by adding **custom attributes** in the Designer — no code per element:

| Attribute | Effect |
|---|---|
| `data-split="heading"` + `data-split-reveal="lines\|words\|chars"` | text reveal |
| `data-button-animate` + two `data-button-text` children | button text swap |
| `data-menu-button-animate` | burger → close morph |
| `data-motion-exempt` | opt this element OUT of motion |

Every module honours `prefers-reduced-motion`, and no-ops when GSAP is missing or its
attributes are absent — so `initAll()` is safe on any page.

**Pending (W6):** only `menu-button` and `nav-autohide` read tokens today.
`button-hover` and `text-reveal` still carry motion literals. Do not map them by eye —
`0.8s` is not `duration-700` and GSAP's `expo.out` is not `easing-out`; that needs the
W6 spec.

## Designer rules (Relume / Client-First)

1. Style **only** with Variables from collection **Atom DS v1** (via the Library).
2. Naming mirror of tokens:
   - `color/background`, `color/primary`, `color/brand`, …
   - `type/font-family-sans`, `type/font-size-base`, `type/line-height-base`
   - `space/section-padding-l`, `space/gap-m`
   - `radius/md`, `stroke/thin`
3. **Zero hex** in the Style panel. If you need a new value → JSON PR → sync → Library update.
4. Relume classes keep Client-First names; bind their colors/spacing to Atom variables.
5. Accept Library updates promptly; a site that defers updates for weeks is in drift.

## Two channels (why both)

| Channel | Visible in canvas? | Role |
|---|---|---|
| Shared Library (variables + components) | Yes | Design-time tokens + canonical anatomy for Relume styling |
| External CSS `/v1/foundation.css` | No (published only) | Typography classes, utilities, exact OSMO parity, fonts |

## Token change workflow

```
edit packages/tokens/src/**.json
  → PR + merge  (→ /v1 redeploys automatically via GitHub Actions)
  → pnpm --filter @atom-uikit/tokens build
  → node scripts/sync-webflow.mjs --plan wf-plan.json
  → MCP session applies the plan to the MASTER (protocol above)
  → publish Library update from the master
  → consumer sites accept the update (native Webflow change management)
```

One sync point per change, regardless of how many consumer sites exist.

## Dark mode

Light values are the collection default. The MCP supports variable modes
(`create_variable_mode` + per-mode updates), so dark lives as a `dark` mode on the
same collection — never a separate collection. Modes travel with the Library.

## Security

- Site access happens through the authorized MCP connection; no API tokens in code or
  env needed for this flow. Only the master needs MCP authorization.
- Master is staging by nature; consumer sites go to production only after visual QA
  against the style guide.

## Related waves / decisions

- W1 — token language (source JSON)
- W2 — foundation.css artifacts
- W3 — public Vercel channel `/v1/*` (live)
- W4 — variable sync + this playbook
- ADR 003 — variables via plan + MCP, no REST
- ADR 009 — master + Shared Library model (supersedes per-site sync)
- W6 — motion / interactions (deferred)

---

## Modos de distribución del paste XscpData (decisión de negocio 2026-07-31)

El modo NO lo decide qué tan técnico es el usuario: lo decide **dónde vive el
loop de iteración**. Donde una AI (o un dev) puede iterar conversacionalmente
("cambia el color de los botones"), necesita OWNERSHIP del código. Donde nadie
itera (Webflow es consumo no-code), la dependencia viva gana: se ve Atom siempre
y se actualiza sola.

| Canal | ¿Quién itera? | Modo |
|---|---|---|
| MCP (Claude Code / Cursor / claude.ai) | La AI, conversacionalmente | Ownership — `atom_uikit_source` entrega código copiado editable |
| CLI `atom-uikit add` / canal shadcn | Dev o AI en el repo | Ownership |
| Paste Webflow (`format: "webflow"`) | Nadie | **`mode: "connected"` (DEFAULT)** — el sitio linkea `/v1/tokens.css` una vez; lo pegado consume tokens VIVOS |
| Paste Webflow en sitio ajeno (sin acceso a custom code global) | Nadie | `mode: "standalone"` — head autocontenido, tokens congelados al build |
| Botón "Copy for Webflow" en la docu (wave 2) | Nadie | connected |

Reglas duras del modo connected (paste-only desde 2026-07-31):

1. Setup por sitio (UNA vez): dos links en el head —
   `/v1/tokens.css` (valores vivos) + `/v1/components.css` (pintura completa
   sin scope: keyframes, selectores compuestos de variante, hijos svg, custom
   props — todo lo que el panel del Designer no puede expresar).
   Tras el setup, TODO componente es copy → paste → publicar. Cero CSS por
   componente, para siempre; un release del DS re-afina lo ya pegado.
2. **NUNCA pegar bloques `:root` ni CSS por componente en un sitio connected** —
   el canal lo cubre; pegarlo congela valores y pisa la escala fluida `--u`
   (verificado en ds-lab 2026-07-31).
3. Los styles nativos del clipboard son el PREVIEW del canvas (el custom code
   no renderiza dentro del Designer); la verdad publicada es el canal. Por eso
   las ediciones del panel sobre propiedades que el canal también declara no se
   ven al publicar — correcto por decisión de negocio: en Webflow nadie itera.
4. `embed.css` es OTRO modo (zona `.atom-embed` para migraciones parciales con
   CSS legacy). No combinar con paste nativo dentro del wrapper.
5. El artefacto (`public/r/webflow/{slug}.json`) trae `headCss` y `tokensCss`
   separados — solo el modo standalone los pega (autocontenido, sitios ajenos);
   connected no pega ninguno.
6. **Aislamiento por namespace (`ds-`), 2026-07-31**: las clases del clipboard
   y `components.css` viajan con el MISMO prefijo `ds-` que ya usa webflow.css
   (transform AST `prefix-webflow.mjs`, ADR 006 — una sola fuente del naming).
   Un sitio sucio no puede colisionar con `ds-badge` → el rename ("divider 2")
   que rompía el contrato con el canal queda imposible por diseño, y el canal
   no puede reestilizar al host. La emisión además es determinista: re-pegar el
   mismo build deduplica sin rename. Nota: los modificadores `--` (ds-badge--neutral)
   entran por paste programático — verificado que publican y pintan; no se
   tipean en el panel (los STATE_RENAMES del canal master no aplican aquí).
7. **Motion en paste: ON por default, off por atributo** (decisión Karen
   2026-07-31): los componentes con behavior contratado pegan con su hook de
   animación presente (`data-button-animate=""` = activado). Desactivar por
   instancia: en el panel del Designer, poner el VALOR del atributo en `false`
   (el DS apaga por valor, no solo por ausencia — mecanismo ya existente).
   Triggers de familia son any-of (TRIGGER_HOOKS); anatomía all-of.
8. **Componentizar siempre** (gobernanza, no aislamiento): el paste va a un
   sitio/página master, se convierte en Webflow Component (`Atom / <Nombre>`)
   y se distribuye como instancias — vía Library del workspace (mismo modelo
   master + Shared Library del ADR 009). Nunca pegar directo en páginas de
   producción: un cambio de anatomía del DS = re-pegar UNA vez en el main
   component y todas las instancias siguen.
