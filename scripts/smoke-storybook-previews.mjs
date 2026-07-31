/**
 * F11b — Smoke Storybook previews used by the docs ComponentPreview.
 *
 * Storybook's iframe.html is a client-rendered shell — the same HTML always
 * embeds `sb-errordisplay` CSS even for healthy stories. Runtime overlay
 * detection needs a browser. This smoke is therefore:
 *
 *   1. Fetch {base}/index.json — source of truth for which story ids exist
 *   2. Every required id MUST appear in index.entries (exact id named on miss)
 *   3. GET iframe.html?id=… must return HTTP 200
 *
 * Compile-time breakage is gated by `storybook build` (CI job). This smoke
 * catches missing/mismatched ids (docs map drift, deploy lag, renames).
 *
 * Usage:
 *   node scripts/smoke-storybook-previews.mjs [baseUrl]
 *   node scripts/smoke-storybook-previews.mjs [baseUrl] --self-test-missing
 *
 * Env: STORYBOOK_BASE, SMOKE_STORYBOOK_INDEX (local index path override)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE =
  process.argv[2]?.startsWith('http')
    ? process.argv[2]
    : process.env.STORYBOOK_BASE || 'https://atom-uikit-ds-storybook.vercel.app';

/** Mirrors atom-uikit-docs ComponentPreview SLUG_TO_STORY + common defaults (F9b). */
const REQUIRED_STORY_IDS = [
  'atoms-buttons-button--default',
  'atoms-buttons-buttongroup--default',
  'atoms-buttons-iconbutton--default',
  'atoms-buttons-linkbutton--default',
  'atoms-buttons-togglegroup--default',
  'atoms-forms-input--default',
  'atoms-forms-select--default',
  'atoms-forms-checkbox--default',
  'atoms-forms-radio--default',
  'atoms-forms-toggle--default',
  'atoms-forms-textarea--default',
  'atoms-forms-slider--default',
  'atoms-forms-calendar--default',
  'atoms-indicators-chip--default',
  'atoms-indicators-tag--default',
  'atoms-indicators-badge--default',
  'atoms-indicators-avatar--default',
  'atoms-indicators-avatargroup--default',
  'atoms-indicators-spinner--default',
  'atoms-indicators-skeleton--default',
  'atoms-navigation-navlink--default',
  'atoms-navigation-breadcrumb--default',
  'atoms-navigation-pagination--default',
  'atoms-navigation-tabs--default',
  'atoms-layout-accordion--default',
  'atoms-layout-divider--horizontal',
  'atoms-layout-empty--default',
  'atoms-layout-table--default',
  'atoms-layout-item--default',
  'atoms-layout-resizable--default',
  'molecules-dialog--default',
  'molecules-alertdialog--default',
  'molecules-sheet--default',
  'molecules-drawer--default',
  'molecules-dropdownmenu--default',
  'molecules-contextmenu--default',
  'molecules-combobox--default',
  'molecules-marquee--default',
  'molecules-sidebar--default',
  'molecules-toast--default',
  'molecules-userprofile--default',
  'molecules-videoplayer--default',
  'integraciones-whatsapp-button--default',
];

async function loadIndex(base) {
  const local =
    process.env.SMOKE_STORYBOOK_INDEX ||
    path.join(ROOT, 'apps/storybook/storybook-static/index.json');
  if (fs.existsSync(local) && (base.includes('127.0.0.1') || base.includes('localhost'))) {
    return JSON.parse(fs.readFileSync(local, 'utf8'));
  }
  const res = await fetch(`${base.replace(/\/$/, '')}/index.json`, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`index.json HTTP ${res.status} from ${base}`);
  return res.json();
}

async function checkIframe(base, id) {
  const url = `${base.replace(/\/$/, '')}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`;
  const res = await fetch(url, {
    headers: { Accept: 'text/html' },
    signal: AbortSignal.timeout(30_000),
  });
  return res.status;
}

async function main() {
  const selfTest = process.argv.includes('--self-test-missing');
  console.log(`smoke-storybook-previews: base=${BASE}`);

  const index = await loadIndex(BASE);
  const entries = index.entries || {};
  const known = new Set(Object.keys(entries));

  if (selfTest) {
    const fake = 'definitely-not-a-real-story--default';
    if (known.has(fake)) {
      console.error('self-test: fake id unexpectedly present in index');
      process.exit(1);
    }
    console.log(`self-test OK — missing id named: ${fake}`);
    process.exit(0);
  }

  const failures = [];
  for (const id of REQUIRED_STORY_IDS) {
    if (!known.has(id)) {
      console.error(`  FAIL  ${id} — not in storybook index.json`);
      failures.push({ id, reason: 'not in index.json' });
      continue;
    }
    let status;
    try {
      status = await checkIframe(BASE, id);
    } catch (e) {
      console.error(`  FAIL  ${id} — fetch error: ${e?.message || e}`);
      failures.push({ id, reason: `fetch: ${e?.message || e}` });
      continue;
    }
    if (status !== 200) {
      console.error(`  FAIL  ${id} — iframe HTTP ${status}`);
      failures.push({ id, reason: `HTTP ${status}` });
      continue;
    }
    console.log(`  OK    ${id}`);
  }

  if (failures.length) {
    console.error(`\n${failures.length} preview(s) failed:`);
    for (const f of failures) console.error(`  - ${f.id}: ${f.reason}`);
    process.exit(1);
  }
  console.log(`\nsmoke-storybook-previews green (${REQUIRED_STORY_IDS.length} required ids)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
