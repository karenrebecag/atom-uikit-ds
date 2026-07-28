# Webflow / Relume playbook — Atom DS

How to consume the Atom design system on Webflow sites (atomchat / marketing)
without making Webflow the source of truth.

## Source of truth

| Layer | Where it lives | How it reaches Webflow |
|---|---|---|
| Tokens (JSON) | `packages/tokens/src/**` in `atom-uikit-ds` | Build → `tokens-nested.json` → `scripts/sync-webflow.mjs` → **Variables nativas** |
| CSS foundation | `packages/css` → `dist/foundation.css` | Public CDN `/v1/foundation.css` in **Custom Code → Head** (W3) |
| Fonts | `packages/css/src/fonts` + dist | CDN `./fonts/*.woff2` **and** upload to Project Settings → Fonts (canvas) |

**Never** edit Variable values by hand in the Designer. The next sync overwrites them.

## One-time setup per site

1. **Credentials** (Karen): `WEBFLOW_SITE_ID` + `WEBFLOW_TOKEN` with Variables write access. Staging site first.
2. **Build tokens**
   ```bash
   pnpm --filter @atom-uikit/tokens build
   ```
3. **Dry-run sync**
   ```bash
   export WEBFLOW_TOKEN=...
   export WEBFLOW_SITE_ID=...
   node scripts/sync-webflow.mjs --site "$WEBFLOW_SITE_ID" --dry-run
   ```
4. **Apply sync**
   ```bash
   node scripts/sync-webflow.mjs --site "$WEBFLOW_SITE_ID" --apply
   ```
5. **Custom fonts in Project Settings**  
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
  → node scripts/sync-webflow.mjs --apply
  → (optional) redeploy public CSS channel
```

Second consecutive `--apply` should report ~100% unchanged (idempotency).

## Dark mode

Light values are the collection default. Script attempts a `dark` mode when the API supports it.
If mode create fails, keep a separate collection **Atom DS v1 dark** only as a temporary fallback — prefer one collection + modes.

## Security

- Tokens and site IDs live in env / CI secrets only.
- Never commit `WEBFLOW_TOKEN`.
- Prefer staging site for first sync; production after visual QA.

## Related waves

- W1 — token language (source JSON)
- W2 — foundation.css artifacts
- W3 — public Vercel channel `/v1/*`
- W4 — this sync + playbook
- W6 — motion / interactions (deferred)
