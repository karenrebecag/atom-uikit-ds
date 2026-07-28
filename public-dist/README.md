# @atom-uikit/public-dist

Static public channel for the Atom web design system.

## Live URLs

Host: **https://atom-web-ds.vercel.app** (scope personal `karenrebecags-projects`; transfer to `atomchatio` when allowed).

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
# → public-dist/deploy/   (out + headers-only vercel.json)
```

## Deploy

### Automatic (preferred)

Push to `main` touching `packages/tokens/**`, `packages/css/**`, or `public-dist/**`
runs `.github/workflows/deploy-public-dist.yml`:

1. Build tokens + css + public-dist  
2. `vercel deploy public-dist/deploy --prod`  
3. Smoke against https://atom-web-ds.vercel.app  

**GitHub secrets required:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
(from `.vercel/project.json` after `vercel link`).

### Manual emergency

```bash
pnpm --filter @atom-uikit/tokens build
pnpm --filter @atom-uikit/css build
pnpm --filter @atom-uikit/public-dist build
npx vercel deploy public-dist/deploy --prod --yes
node public-dist/smoke.mjs https://atom-web-ds.vercel.app
```

### Rollback

```bash
# List recent deployments, then:
npx vercel rollback <deployment-url-or-id> --yes
# Or redeploy a known-good commit:
git checkout <sha> -- packages/tokens packages/css public-dist
# rebuild + deploy as above, then return to main
```

## Smoke

```bash
node public-dist/smoke.mjs https://atom-web-ds.vercel.app
# local after build:
npx serve public-dist/out -l 4173 &
node public-dist/smoke.mjs http://127.0.0.1:4173
```

## Versioning

Only `/v1/` today. Breaking renames → new `/v2/` folder; never break `/v1/`.
