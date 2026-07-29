#!/usr/bin/env node
/**
 * Bidirectional style-leak test for dist/embed.css, in a real browser.
 *
 * The static gate (validate-embed-scope.mjs) proves every selector is prefixed.
 * This proves the thing that actually matters: that prefixing is ENOUGH — the
 * host keeps its own look, and the embed resists the host's global CSS.
 *
 * The fixture (../embed-leak-test.html) is a deliberately hostile host page:
 * `* { line-height: 3; margin: 0 }`, Times serif, red buttons — the kind of
 * global CSS WordPress themes and Webflow's normalize ship.
 *
 * Requires Playwright + chromium (installed for the visual-regression suite).
 * Skips with exit 0 when unavailable so it never blocks a machine without it.
 *
 * Usage: node scripts/test-embed-leak.mjs
 */
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const FIXTURE = resolve(import.meta.dirname, '../embed-leak-test.html');
const BUILT = resolve(import.meta.dirname, '../dist/embed.css');

if (!existsSync(BUILT)) {
  console.error('Missing dist/embed.css — run: pnpm --filter @atom-uikit/css build');
  process.exit(1);
}

/**
 * Playwright reaches this repo as a transitive dep of @storybook/test-runner,
 * so a bare specifier does not resolve under pnpm's strict layout. Fall back to
 * the store path rather than adding a dependency just for this check.
 */
async function loadChromium() {
  try {
    return (await import('playwright')).chromium;
  } catch {
    const store = resolve(import.meta.dirname, '../../../node_modules/.pnpm');
    if (!existsSync(store)) return null;
    const dir = readdirSync(store).find((d) => d.startsWith('playwright@'));
    if (!dir) return null;
    const entry = resolve(store, dir, 'node_modules/playwright/index.mjs');
    if (!existsSync(entry)) return null;
    return (await import(pathToFileURL(entry).href)).chromium;
  }
}

const chromium = await loadChromium();
if (!chromium) {
  console.log('SKIP  playwright not installed — run `pnpm install` at the repo root');
  process.exit(0);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(FIXTURE).href);
await page.evaluate(() => document.fonts.ready);

const style = (selector, prop) =>
  page.evaluate(
    ([s, p]) => {
      const el = document.querySelector(s);
      return el ? getComputedStyle(el)[p] : null;
    },
    [selector, prop]
  );

const checks = [
  {
    name: 'host heading keeps its own font (no outward leak)',
    actual: await style('h1', 'fontFamily'),
    ok: (v) => /Times/i.test(v ?? ''),
  },
  {
    name: 'host keeps line-height: 3 (no outward leak)',
    actual: await style('h1', 'lineHeight'),
    ok: (v) => v === '132px', // 3 × 44px default h1
  },
  {
    name: 'host button keeps its red (no outward leak)',
    actual: await style('button', 'backgroundColor'),
    ok: (v) => v === 'rgb(204, 0, 0)',
  },
  {
    name: 'embed heading uses Inter Tight (DS applied)',
    actual: await style('.atom-embed .h1', 'fontFamily'),
    ok: (v) => /Inter Tight/i.test(v ?? ''),
  },
  {
    name: 'embed resists the host line-height (no inward leak)',
    actual: await style('.atom-embed .h1', 'lineHeight'),
    ok: (v) => v !== '132px' && v !== 'normal',
  },
  {
    name: 'embed component styles are present',
    actual: await style('.atom-embed .button--primary', 'backgroundColor'),
    ok: (v) => v === 'rgb(10, 10, 10)',
  },
  {
    name: 'dark embed paints its own surface',
    actual: await style('.atom-embed[data-theme="dark"]', 'backgroundColor'),
    ok: (v) => v === 'rgb(10, 10, 10)',
  },
  {
    name: 'state attr on inner element still styles (burger X morph)',
    actual: await style('[data-menu-button="close"] .burger-icon__line', 'transform'),
    ok: (v) => v !== null && v !== 'none',
  },
];

let failed = 0;
for (const c of checks) {
  const pass = c.ok(c.actual);
  if (!pass) failed++;
  console.log(`${pass ? 'OK  ' : 'FAIL'}  ${c.name} → ${c.actual}`);
}

await browser.close();
process.exit(failed ? 1 : 0);
