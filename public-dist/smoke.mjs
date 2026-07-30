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
];

// CDN cache-buster: right after a deploy the edge can serve entries up to
// max-age (300s) old; without this, smoke can validate the PREVIOUS deploy.
const bust = `smoke=${Date.now()}`;
const busted = (href) => `${href}${href.includes('?') ? '&' : '?'}${bust}`;

let failed = 0;
for (const p of paths) {
  const url = busted(new URL(p, base).href);
  const res = await fetch(url, { method: 'HEAD' });
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
