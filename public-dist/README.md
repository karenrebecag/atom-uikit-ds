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
| `/v1/animations.js` | motion behaviours, IIFE, global `AtomMotion` | 5 min |
| `/v1/forms.js` | motor de formularios, IIFE, global `AtomForms` | 5 min |
| `/v1/fonts/*.woff2` | self-hosted webfonts | 1 year immutable |

CORS: `Access-Control-Allow-Origin: *` on all of the above.

## Local build

```bash
pnpm --filter @atom-uikit/tokens build
pnpm --filter @atom-uikit/css build
pnpm --filter @atom-uikit/animations build
pnpm --filter @atom-uikit/forms build
pnpm --filter @atom-uikit/public-dist build
# → public-dist/out/v1/
# → public-dist/deploy/   (out + headers-only vercel.json)
```

## `animations.js` — comportamientos de motion

Bundle IIFE de `packages/animations` que expone el global **`AtomMotion`** con los
9 `init*` del DS más `initAll()`. Se arma sin bundler externo
(`packages/animations/scripts/build-browser.mjs`): los módulos son auto-contenidos, así
que basta con aislar cada uno en su propio scope — obligatorio, porque hay helpers
homónimos con firmas distintas entre módulos (`readMotionTokens`).

**GSAP no viaja en el bundle**: es peer dependency y se carga aparte. Sin él, cada
`init*` avisa por consola y hace no-op en lugar de romper la página.

Los valores de motion NO están hardcodeados: los módulos leen `--easing-osmo` y
`--duration-*` del DOM en runtime, así que **hay que cargar `tokens.css`** para que la
animación use los tokens. Un cambio de token re-afina el motion sin tocar este archivo.

Consumo mínimo (sirve en Webflow, WordPress o cualquier host):

```html
<link rel="stylesheet" href="https://atom-web-ds.vercel.app/v1/tokens.css">
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
<script src="https://atom-web-ds.vercel.app/v1/animations.js"></script>
<script>AtomMotion.initAll();</script>
```

`initAll()` es seguro en cualquier página: cada `init*` hace no-op si no encuentra sus
`data-*`. Devuelve un cleanup que revierte todo lo que se haya inicializado.

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

## `forms.js` — motor de formularios

Bundle IIFE de `packages/forms` que expone el global **`AtomForms`**. 79 KB, 21 KB
servidos con gzip.

**A diferencia de `animations.js`, la dependencia SÍ viaja dentro**: zod es la validación
misma, no una pieza que el host pueda cargar aparte. Un formulario sin su schema no
degrada, miente.

El endpoint (`forms.atomchat.io/api/submit`) va horneado en el bundle: es el único punto
que sabe a dónde se envía y por eso vive en un archivo propio, trivial de auditar.

**Orden de carga, no opcional.** El motor descarta los listeners que Webflow engancha a
su Form Block, así que tiene que correr DESPUÉS de la inicialización de Webflow:

```html
<script src="https://atom-web-ds.vercel.app/v1/forms.js" defer></script>
<script>
  window.Webflow = window.Webflow || [];
  window.Webflow.push(function () { AtomForms.initAll(); });
</script>
```

Si corriera antes, Webflow bindearía después y cada lead se enviaría por duplicado: al
endpoint propio y al store de formularios de Webflow.

`initAll()` no hace nada en una página sin `[data-atom-form]`, así que el snippet puede
vivir en una plantilla compartida por landings con y sin formulario.
