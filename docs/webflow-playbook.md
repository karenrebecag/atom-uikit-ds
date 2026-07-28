# Webflow / Relume playbook — Atom DS

How to consume the Atom design system on Webflow sites (atomchat / marketing)
without making Webflow the source of truth.

## Source of truth

| Layer | Where it lives | How it reaches Webflow |
|---|---|---|
| Tokens (JSON) | `packages/tokens/src/**` in `atom-uikit-ds` | Build → `tokens-nested.json` → `sync-webflow.mjs --plan` → **Webflow MCP** → Variables nativas |
| CSS foundation | `packages/css` → `dist/foundation.css` | Public CDN `/v1/foundation.css` in **Custom Code → Head** (W3) |
| Fonts | `packages/css/src/fonts` + dist | CDN `./fonts/*.woff2` **and** upload to Project Settings → Fonts (canvas) |

**Never** edit Variable values by hand in the Designer. The next sync overwrites them.

## Why the sync goes through the Webflow MCP (verified 2026-07-28)

Webflow Variables are **not** on the REST Data API (`api.webflow.com/v2`) — they only
exist on the Designer API surface, which the official Webflow MCP wraps
(`data_variable_tool`: collections, variables, **modes**, `query_variables`).
So the flow is: script compiles a typed plan → an MCP session (Claude Code with the
Webflow MCP connected and the target site authorized) applies it.

Apply protocol for the MCP session, per plan run:

1. `query_variables` scoped to collection "Atom DS v1" → map existing name → id/value.
2. Create the collection and the `dark` mode if missing.
3. For each plan variable: missing → `create_*_variable`; value differs → `update_*_variable`;
   colors with `dark` → additional `update_color_variable` with the dark `mode_id`.
4. Report created / updated / unchanged / orphans. **Never delete orphans automatically.**
5. Second consecutive apply must report ~100% unchanged (idempotency gate).

## One-time setup per site

1. **Access** (Karen): the Webflow MCP authorized on the target site. Staging first.
2. **Build tokens + compile plan**
   ```bash
   pnpm --filter @atom-uikit/tokens build
   node scripts/sync-webflow.mjs --plan wf-plan.json
   ```
3. **Apply via MCP session** following the protocol above (hand `wf-plan.json` to the session).
4. **Custom fonts in Project Settings**  
   Upload Inter Tight, Grift, Interval, Gantol (woff2 from `packages/css/src/fonts`).  
   Needed for canvas preview; published pages can also load `@font-face` from foundation.css.
6. **Head custom code** (after W3 public channel is live)
   ```html
   <link rel="stylesheet" href="https://<atom-web-ds-host>/v1/foundation.css" />
   ```
   Optional: if the site does not load foundation, paste the scaling snippet from
   `packages/css/src/foundation/scaling.css` (`:root` size-unit block only).

## Designer rules (Relume / Client-First)

1. Style **only** with Variables from collection **Atom DS v1**.
2. Naming mirror of tokens:
   - `color/background`, `color/primary`, `color/brand`, …
   - `type/font-family-sans`, `type/font-size-base`, `type/line-height-base`
   - `space/section-padding-l`, `space/gap-m`
   - `radius/md`, `stroke/thin`
3. **Zero hex** in the Style panel. If you need a new value → JSON PR → sync.
4. Relume classes keep Client-First names; bind their colors/spacing to Atom variables.

## Two channels (why both)

| Channel | Visible in canvas? | Role |
|---|---|---|
| Native Variables (this sync) | Yes | Design-time tokens for Relume styling |
| External CSS `/v1/foundation.css` | No (published only) | Typography classes, utilities, exact OSMO parity, fonts |

## Token change workflow

```
edit packages/tokens/src/**.json
  → PR + merge
  → pnpm --filter @atom-uikit/tokens build
  → node scripts/sync-webflow.mjs --plan wf-plan.json
  → MCP session applies the plan (protocol above)
  → (optional) redeploy public CSS channel
```

## Dark mode

Light values are the collection default. The MCP supports variable modes
(`create_variable_mode` + per-mode updates), so dark lives as a `dark` mode on the
same collection — never a separate collection.

## Security

- Site access happens through the authorized MCP connection; no API tokens in code or env needed for this flow.
- Prefer staging site for first sync; production after visual QA.

## Related waves

- W1 — token language (source JSON)
- W2 — foundation.css artifacts
- W3 — public Vercel channel `/v1/*`
- W4 — this sync + playbook
- W6 — motion / interactions (deferred)
