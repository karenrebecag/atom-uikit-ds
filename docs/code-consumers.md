# Code consumers — OSMO language

How apps that **install packages or fetch the registry** pick up the new web language
without contract changes.

## Channels

| Channel | URL / package | Updates when |
|---|---|---|
| **Registry + MCP** | `uikit.atomchat.io/api/r/*` incl. `tokens-nested.json` | Commit `public/r/` → deploy docs hook. MCP caches **5 min**. |
| **Public fetch** | `https://atom-web-ds.vercel.app/v1/tokens.css` · `/v1/foundation.css` · `/v1/atom.css` · `/v1/tokens.json` · `/v1/tokens-nested.json` | W3 Vercel project; CORS `*`; CSS max-age 300. |

**npm NO es canal** (decisión 2026-07-28, sin autorización de consumo público). Paquetes
`private: true`; `pnpm release` bloqueado. Apps que antes instalaban `@atom-uikit/*` de
npm migran a: copiar via registry/CLI, o fetch de `/v1/tokens.{css,json}` en build.

Prefer semantic CSS variables (`--background`, `--primary`, `--brand`) over primitive ramps.
Primitives that remain: `neutral`, `orange`, `amber`, `coral`, `green-electric`, `forest`, `sky`.

## Vanilla / Mount Point (no package install)

```html
<link rel="stylesheet" href="https://<atom-web-ds>/v1/foundation.css" />
<!-- or full component CSS: /v1/atom.css -->
```

Programmatic tokens:

```js
const tokens = await fetch('https://<atom-web-ds>/v1/tokens.json').then((r) => r.json());
```

Replace `<atom-web-ds>` with the Vercel host from W3 (e.g. `atom-web-ds.vercel.app`).

## MCP verification (after merge + cache TTL)

1. Wait ≥5 min or restart MCP so `getTokens()` refetches.
2. `atom_uikit_context` / get tokens → expect:
   - `background` `#fafafa`, `primary` `#0a0a0a`, `success` `#25d366`
   - `font-family.sans` contains `Inter Tight`
   - `easing.osmo` present; no `color.zinc`
3. Export `DESIGN.md` → should list OSMO type stack and neutral ramp.

## Storybook local QA checklist

```bash
pnpm --filter @atom-uikit/tokens build
pnpm --filter @atom-uikit/css build   # optional; storybook imports css src
pnpm --filter @atom-uikit/storybook dev
```

Walk: Button, IconButton, LinkButton, ButtonGroup, Input, Textarea, Select, Checkbox, Tabs.
Record contrast/focus regressions as issues — do not redesign components in W5.

## Release checklist (human)

- [ ] F4: pin any product that must **not** reskin yet
- [ ] `pnpm changeset version` (applies W1/W2 minors)
- [ ] Review CHANGELOGs
- [ ] `pnpm build:registry` + commit `public/r/` (dispara deploy hook docs)
- [ ] Redeploy canal `/v1` si cambió tokens/css (`public-dist/README.md`)
- [ ] Confirm `uikit.atomchat.io` after deploy hook

## Related

- `docs/webflow-playbook.md` — no-code Variables channel (W4)
- `public-dist/README.md` — public `/v1` contract (W3)
