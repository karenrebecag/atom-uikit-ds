#!/usr/bin/env node
/**
 * WCAG AA contrast gate for semantic surface/foreground pairs.
 * Reads resolved light values from tokens-nested.json and resolves dark
 * mappings from src/semantic/dark.json against nested color primitives.
 *
 * Usage: node scripts/check-contrast.mjs
 * Requires: pnpm --filter @atom-uikit/tokens build (tokens-nested.json present)
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const NESTED = resolve(ROOT, 'packages/tokens/build/json/tokens-nested.json');
const DARK_SRC = resolve(ROOT, 'packages/tokens/src/semantic/dark.json');

const PAIRS = [
  ['background', 'foreground'],
  ['card', 'card-foreground'],
  ['popover', 'popover-foreground'],
  ['primary', 'primary-foreground'],
  ['secondary', 'secondary-foreground'],
  ['muted', 'muted-foreground'],
  ['accent', 'accent-foreground'],
  ['destructive', 'destructive-foreground'],
  ['brand', 'brand-foreground'],
  ['success', 'success-foreground'],
  ['warning', 'warning-foreground'],
  ['info', 'info-foreground'],
  ['ai', 'ai-foreground'],
  // Text-on-background tokens (not a surface pair, same AA rule applies)
  ['background', 'link'],
  // Texto de intent sobre la pagina. El acento puro (success, warning, info…) es
  // color de SUPERFICIE: como texto falla en uno de los dos temas — forest da
  // 1.3:1 en dark y green-electric 1.9:1 en light. Por eso cada intent tiene su
  // paso legible, igual que link.
  ['background', 'success-text'],
  ['background', 'warning-text'],
  ['background', 'destructive-text'],
  ['background', 'info-text'],
  ['background', 'brand-text'],
  ['background', 'ai-text'],
  // prose pone `code` a contraste pleno sobre la superficie muted (el par
  // muted/muted-foreground se ve apagado dentro de un parrafo de texto normal).
  ['muted', 'foreground'],
];

const AA_NORMAL = 4.5;
// Large text only (≥24px) may use 3:1 — document in PR if any pair uses this
const AA_LARGE = 3;

/** Pairs allowed to pass at large-text ratio (display over brand-like fills). */
const LARGE_TEXT_PAIRS = new Set([
  // none by default; add "brand/brand-foreground" if marketing uses display-only on brand
]);

function normalizeHex(hex) {
  if (typeof hex !== 'string') return null;
  let h = hex.trim().toLowerCase();
  if (h.startsWith('rgba') || h.startsWith('rgb') || h.startsWith('hsl')) return null;
  if (!h.startsWith('#')) return null;
  // strip alpha suffix if 8-digit (#rrggbbaa)
  if (h.length === 9) h = h.slice(0, 7);
  if (h.length === 4) {
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  if (!/^#[0-9a-f]{6}$/.test(h)) return null;
  return h;
}

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Navigate nested object by dotted path (e.g. color.neutral.950). */
function resolvePath(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

/** Resolve a DTCG reference like {color.neutral.950} against nested tokens. */
function resolveRef(nested, value) {
  if (typeof value !== 'string') return null;
  if (value.startsWith('{') && value.endsWith('}')) {
    const path = value.slice(1, -1);
    const resolved = resolvePath(nested, path);
    if (typeof resolved === 'string') return normalizeHex(resolved);
    return null;
  }
  return normalizeHex(value);
}

let nested;
try {
  nested = JSON.parse(readFileSync(NESTED, 'utf8'));
} catch (err) {
  console.error(`FATAL: cannot read ${NESTED}: ${err.message}`);
  console.error('Run `pnpm --filter @atom-uikit/tokens build` first.');
  process.exit(1);
}

let darkSrc;
try {
  darkSrc = JSON.parse(readFileSync(DARK_SRC, 'utf8'));
} catch (err) {
  console.error(`FATAL: cannot read ${DARK_SRC}: ${err.message}`);
  process.exit(1);
}

const failures = [];

function checkMode(mode, getHex) {
  for (const [surface, fg] of PAIRS) {
    const a = getHex(surface);
    const b = getHex(fg);
    if (!a || !b) {
      failures.push(`${mode}: ${surface}/${fg} — unresolved (${a ?? '?'} / ${b ?? '?'})`);
      continue;
    }
    const r = ratio(a, b);
    const key = `${surface}/${fg}`;
    const min = LARGE_TEXT_PAIRS.has(key) ? AA_LARGE : AA_NORMAL;
    if (r < min) {
      failures.push(
        `${mode}: ${key} = ${r.toFixed(2)}:1 < ${min}:1 (${a} / ${b})`
      );
    } else {
      console.log(`  OK  ${mode.padEnd(5)} ${key.padEnd(36)} ${r.toFixed(2)}:1`);
    }
  }
}

console.log('Checking WCAG AA contrast (surface/foreground pairs)...\n');

checkMode('light', (name) => {
  const v = nested[name];
  return typeof v === 'string' ? normalizeHex(v) : null;
});

checkMode('dark', (name) => {
  const token = darkSrc[name];
  if (!token || token.$value == null) return null;
  return resolveRef(nested, token.$value);
});

if (failures.length) {
  console.error('\nContrast failures:');
  for (const f of failures) console.error(`  FAIL: ${f}`);
  process.exit(1);
}

console.log('\nAll surface/foreground pairs pass WCAG AA.');
