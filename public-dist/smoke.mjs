#!/usr/bin/env node
/**
 * Smoke-test a public /v1 channel (production or local serve of out/).
 * Usage: node smoke.mjs https://atom-web-ds.vercel.app
 *        node smoke.mjs http://127.0.0.1:4173
 */
const base = process.argv[2];
if (!base) {
  console.error('Usage: node smoke.mjs https://<host>');
  process.exit(1);
}

const paths = [
  '/v1/tokens.css',
  '/v1/foundation.css',
  '/v1/atom.css',
  '/v1/embed.css',
  '/v1/tokens.json',
  '/v1/tokens-nested.json',
  '/v1/animations.js',
  '/v1/webflow.css',
];

// CDN cache-buster: right after a deploy the edge can serve entries up to
// max-age (300s) old; without this, smoke can validate the PREVIOUS deploy.
const bust = `smoke=${Date.now()}`;
const busted = (href) => `${href}${href.includes('?') ? '&' : '?'}${bust}`;

/**
 * Un artefacto NUEVO puede tardar en aparecer en todos los edges: el smoke de
 * CI corre justo despues del deploy y un 404 ahi es propagacion, no un fallo
 * real (paso el 2026-07-31 con webflow.css). Reintento acotado solo para 404/5xx
 * — un 200 con headers mal NO se reintenta, eso si es un fallo de verdad.
 */
async function fetchWithRetry(url, init, { attempts = 6, delayMs = 5000 } = {}) {
  for (let i = 1; ; i++) {
    const res = await fetch(url, init);
    if (res.status === 200 || i === attempts) return res;
    if (res.status !== 404 && res.status < 500) return res;
    console.log(`  … ${res.status} en ${url.split('?')[0]} — reintento ${i}/${attempts - 1}`);
    await new Promise((r) => setTimeout(r, delayMs));
  }
}

let failed = 0;
for (const p of paths) {
  const url = busted(new URL(p, base).href);
  const res = await fetchWithRetry(url, { method: 'HEAD' });
  const acao = res.headers.get('access-control-allow-origin');
  const cache = res.headers.get('cache-control') || '';
  // Local serve may omit CORS headers — only require ACAO on non-localhost
  const isLocal = /localhost|127\.0\.0\.1/.test(base);
  const corsOk = isLocal || acao === '*';
  const ok = res.status === 200 && corsOk;
  console.log(
    `${ok ? 'OK' : 'FAIL'} ${res.status} ${p}  ACAO=${acao ?? '(none)'}  cache=${cache || '(none)'}`
  );
  if (!ok) failed++;
}

// Body checks on tokens.css (OSMO markers + AA link token when present)
const cssUrl = busted(new URL('/v1/tokens.css', base).href);
const css = await fetch(cssUrl).then((r) => r.text());
for (const marker of ['green-electric', 'neutral-150', 'Inter Tight', 'easing-osmo']) {
  if (!css.includes(marker)) {
    console.log(`FAIL tokens.css missing OSMO marker: ${marker}`);
    failed++;
  } else {
    console.log(`OK  tokens.css has ${marker}`);
  }
}
if (css.includes('--link:') || css.includes('--link ')) {
  console.log('OK  --link present (AA link token)');
} else {
  console.log('WARN --link not found (redeploy after W1 link fix if unexpected)');
}

// animations.js: the global must exist, GSAP must NOT be inlined (it is a peer),
// and motion values must still come from the tokens at runtime.
const anim = await fetch(busted(new URL('/v1/animations.js', base).href)).then((r) => r.text());
if (!anim.includes('root.AtomMotion = api')) {
  console.log('FAIL animations.js does not expose the AtomMotion global');
  failed++;
} else if (/gsap\.registerPlugin\s*=|function gsap\s*\(/.test(anim)) {
  console.log('FAIL animations.js inlines GSAP (must stay a peer dependency)');
  failed++;
} else if (!anim.includes('--easing-osmo')) {
  console.log('FAIL animations.js no longer reads motion tokens at runtime');
  failed++;
} else {
  console.log('OK  animations.js exposes AtomMotion, GSAP stays external, reads tokens');
}

// webflow.css carries ONLY what Webflow's style panel cannot express, under the
// ds- namespace. A global rule or an unprefixed class here would restyle the
// host site — the exact failure the namespace exists to prevent.
const wf = await fetch(busted(new URL('/v1/webflow.css', base).href)).then((r) => r.text());
if (/(^|})(body|:root|html)\s*\{/.test(wf)) {
  console.log('FAIL webflow.css leaks a global body/:root/html rule');
  failed++;
} else if (!wf.includes('var(--char)')) {
  console.log('FAIL webflow.css lost the per-character animation');
  failed++;
} else if (/(^|[,}])\.(?!ds-|button__split-char)[a-zA-Z]/.test(wf)) {
  console.log('FAIL webflow.css has a class outside the ds- namespace');
  failed++;
} else {
  console.log('OK  webflow.css is ds-namespaced, no global rules, keeps the char animation');
}

// embed.css must never restyle a host page: a bare `body{` or `:root{` here is
// the exact failure this artifact exists to prevent.
const embed = await fetch(busted(new URL('/v1/embed.css', base).href)).then((r) => r.text());
if (!embed.includes('.atom-embed')) {
  console.log('FAIL embed.css is not scoped (.atom-embed absent)');
  failed++;
} else if (/(^|})(body|:root|html)\s*\{/.test(embed)) {
  console.log('FAIL embed.css leaks a global body/:root/html rule');
  failed++;
} else {
  console.log('OK  embed.css scoped to .atom-embed, no global rules');
}

const mapRes = await fetch(new URL('/v1/tokens.css.map', base).href, { method: 'HEAD' });
if (mapRes.status === 200) {
  console.log('FAIL sourcemap tokens.css.map is publicly reachable');
  failed++;
} else {
  console.log(`OK  sourcemap not exposed (${mapRes.status})`);
}

process.exit(failed ? 1 : 0);
