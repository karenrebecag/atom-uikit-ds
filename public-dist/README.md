# @atom-uikit/public-dist

Static public channel for the Atom web design system.

## URLs (after Vercel project `atom-web-ds` is linked)

| Path | Content | Cache |
|---|---|---|
| `/v1/tokens.css` | CSS variables light + dark | 5 min, revalidate |
| `/v1/foundation.css` | tokens + fonts + foundation + utilities | 5 min |
| `/v1/atom.css` | full DS | 5 min |
| `/v1/tokens.json` | flat tokens | 5 min |
| `/v1/tokens-nested.json` | nested tokens | 5 min |
| `/v1/fonts/*.woff2` | self-hosted webfonts | 1 year immutable |

CORS: `Access-Control-Allow-Origin: *` on all of the above.

## Local build

```bash
pnpm --filter @atom-uikit/tokens build
pnpm --filter @atom-uikit/css build
pnpm --filter @atom-uikit/public-dist build
# → public-dist/out/v1/
```

## Deploy

1. Create Vercel project `atom-web-ds`, root directory `public-dist`.
2. **No** Deployment Protection (public by design).
3. Confirm F1 font licenses before first production deploy.
4. Smoke: `node public-dist/smoke.mjs https://<host>`

Versioning: only `/v1/` today. Breaking renames → new `/v2/` folder; never break `/v1/`.
