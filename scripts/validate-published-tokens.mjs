/**
 * validate-published-tokens.mjs
 *
 * Validates the published token artifact (public/r/tokens-nested.json) that the
 * MCP consumes. Run after `pnpm build:registry`. Catches token regressions in a
 * DS PR: missing categories, missing semantic palette, or unresolved references.
 *
 * Self-contained — no MCP, no registry, no network.
 *
 * Usage: node scripts/validate-published-tokens.mjs
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FILE = resolve(import.meta.dirname, '../public/r/tokens-nested.json');

// Primitive/foundation categories the MCP overlays onto its token skeleton.
const REQUIRED_CATEGORIES = [
  'radius',
  'spacing',
  'font-size',
  'line-height',
  'font-weight',
  'font-family',
  'letter-spacing',
  'duration',
  'easing',
];

// A sample of semantic tokens that must always exist (string-valued top-level keys).
const REQUIRED_SEMANTIC = ['background', 'foreground', 'primary', 'brand'];

const fail = (msg) => {
  console.error(`  FAIL: ${msg}`);
  process.exitCode = 1;
};

let tokens;
try {
  tokens = JSON.parse(readFileSync(FILE, 'utf8'));
} catch (err) {
  console.error(`FATAL: cannot read/parse ${FILE}: ${err.message}`);
  console.error('Run `pnpm build:registry` first.');
  process.exit(1);
}

// 1. Required categories present, are objects, and non-empty.
for (const cat of REQUIRED_CATEGORIES) {
  const v = tokens[cat];
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    fail(`missing or non-object category: "${cat}"`);
  } else if (Object.keys(v).length === 0) {
    fail(`category "${cat}" is empty`);
  }
}

// 2. Semantic palette present (string-valued top-level keys).
for (const key of REQUIRED_SEMANTIC) {
  if (typeof tokens[key] !== 'string') {
    fail(`missing semantic token: "${key}"`);
  }
}

// 3. No unresolved DTCG references anywhere (e.g. "{color.zinc.950}").
const walk = (node, path) => {
  if (typeof node === 'string') {
    if (node.includes('{') && node.includes('}')) fail(`unresolved reference at ${path}: "${node}"`);
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
  }
};
walk(tokens, '');

if (process.exitCode === 1) {
  console.error('\ntokens-nested.json validation failed.');
  process.exit(1);
}

const catCount = REQUIRED_CATEGORIES.length;
const semCount = Object.values(tokens).filter((v) => typeof v === 'string').length;
console.log(`tokens-nested.json valid — ${catCount} required categories, ${semCount} semantic tokens, no unresolved refs.`);
