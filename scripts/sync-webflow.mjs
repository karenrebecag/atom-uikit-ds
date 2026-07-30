#!/usr/bin/env node
/**
 * sync-webflow.mjs — compiles the DESIRED Webflow Variables state from
 * packages/tokens/build/json/tokens-nested.json into an MCP-ready plan.
 *
 * IMPORTANT — API surface (verified 2026-07-28):
 * Webflow Variables are NOT exposed on the REST Data API (api.webflow.com/v2).
 * They exist only on the Designer API surface, which the official Webflow MCP
 * wraps (data_variable_tool: create/update/query variables, collections and
 * modes). This script therefore performs NO network calls. It emits a typed
 * plan; a Webflow-MCP session applies it (diff vs existing via query_variables,
 * then create/update actions). See docs/webflow-playbook.md.
 *
 * Usage:
 *   node scripts/sync-webflow.mjs                 # print summary + sample
 *   node scripts/sync-webflow.mjs --plan out.json # write full MCP-ready plan
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const NESTED = resolve(ROOT, 'packages/tokens/build/json/tokens-nested.json');
const DARK_SRC = resolve(ROOT, 'packages/tokens/src/semantic/dark.json');
const COLLECTION_NAME = 'Atom DS v1';
const DARK_MODE_NAME = 'dark';

// Semantic keys that are dimensions, not colors (string top-level in nested)
const COLOR_SEMANTIC_SKIP = new Set([
  'ring-width',
  'ring-offset',
  'section-padding-xxl',
  'section-padding-xl',
  'section-padding-l',
  'section-padding-m',
  'section-padding-s',
  'gap-xl',
  'gap-l',
  'gap-m',
  'gap-s',
  'gap-xs',
]);

const SIZE_PREFIXES = ['section-padding-', 'gap-'];

function parseArgs(argv) {
  const args = { plan: null, help: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--plan') args.plan = argv[++i] ?? null;
    else if (argv[i] === '--help' || argv[i] === '-h') args.help = true;
  }
  return args;
}

function loadNested() {
  if (!existsSync(NESTED)) {
    console.error(`Missing ${NESTED}`);
    console.error('Run: pnpm --filter @atom-uikit/tokens build');
    process.exit(1);
  }
  return JSON.parse(readFileSync(NESTED, 'utf8'));
}

function loadDarkRefs() {
  if (!existsSync(DARK_SRC)) return {};
  return JSON.parse(readFileSync(DARK_SRC, 'utf8'));
}

function resolvePath(obj, path) {
  return path.split('.').reduce((cur, p) => (cur == null ? undefined : cur[p]), obj);
}

function resolveRef(nested, value) {
  if (typeof value !== 'string') return null;
  if (value.startsWith('{') && value.endsWith('}')) {
    const v = resolvePath(nested, value.slice(1, -1));
    return typeof v === 'string' ? v : null;
  }
  return value;
}

/** Parse CSS size like "16px" | "1.5rem" → { value, unit } for Webflow Size */
function parseSize(raw) {
  if (typeof raw !== 'string') return null;
  const m = raw.trim().match(/^(-?[\d.]+)(px|rem|em|vh|vw)?$/i);
  if (!m) return null;
  return { value: Number(m[1]), unit: (m[2] || 'px').toLowerCase() };
}

/**
 * Build the desired Webflow variable set from tokens-nested.
 * Naming: color/background, type/font-size-base, space/section-padding-l,
 * radius/md, stroke/thin. Colors carry a dark value when semantic/dark.json
 * defines one (applied to the collection's "dark" mode).
 */
function buildDesired(nested, darkSrc) {
  const desired = [];

  // Semantic colors
  for (const [key, val] of Object.entries(nested)) {
    if (typeof val !== 'string') continue;
    if (COLOR_SEMANTIC_SKIP.has(key)) continue;
    if (SIZE_PREFIXES.some((p) => key.startsWith(p))) continue;
    if (!val.startsWith('#') && !val.startsWith('rgb') && !val.startsWith('hsl')) continue;

    const darkRef = darkSrc[key]?.$value;
    const darkVal = darkRef ? resolveRef(nested, darkRef) : null;

    desired.push({ name: `color/${key}`, type: 'color', light: val, dark: darkVal });
  }

  // Font families — Webflow Font Family vars want the family name, not the stack
  const ff = nested['font-family'] || {};
  for (const [k, v] of Object.entries(ff)) {
    if (typeof v !== 'string') continue;
    const primary = v.split(',')[0].replace(/['"]/g, '').trim();
    desired.push({ name: `type/font-family-${k}`, type: 'fontFamily', light: primary });
  }

  // Font sizes
  const fs = nested['font-size'] || {};
  for (const [k, v] of Object.entries(fs)) {
    const size = parseSize(v);
    if (!size) continue;
    desired.push({ name: `type/font-size-${k}`, type: 'size', light: size });
  }

  // Line heights as unitless numbers
  const lh = nested['line-height'] || {};
  for (const [k, v] of Object.entries(lh)) {
    const n = Number(v);
    if (!Number.isFinite(n)) continue;
    desired.push({ name: `type/line-height-${k}`, type: 'number', light: n });
  }

  // Section padding + gap
  for (const [key, val] of Object.entries(nested)) {
    if (typeof val !== 'string') continue;
    if (!SIZE_PREFIXES.some((p) => key.startsWith(p))) continue;
    const size = parseSize(val);
    if (!size) continue;
    desired.push({ name: `space/${key}`, type: 'size', light: size });
  }

  // Spacing primitives — retícula base-4. Webflow no tiene capa de component tokens,
  // así que la retícula ES ahí la escala de composición (ver la ley en rhythm.$description).
  const spacing = nested.spacing || {};
  for (const [k, v] of Object.entries(spacing)) {
    const size = parseSize(v);
    if (!size) continue;
    desired.push({ name: `space/spacing-${k}`, type: 'size', light: size });
  }

  // Radius
  const radius = nested.radius || {};
  for (const [k, v] of Object.entries(radius)) {
    const size = parseSize(v);
    if (!size) continue;
    desired.push({ name: `radius/${k}`, type: 'size', light: size });
  }

  // Stroke
  const stroke = nested.stroke || {};
  for (const [k, v] of Object.entries(stroke)) {
    const size = parseSize(v);
    if (!size) continue;
    desired.push({ name: `stroke/${k}`, type: 'size', light: size });
  }

  return desired;
}

/**
 * MCP action hint per variable, mirroring data_variable_tool shapes:
 *   color      → create_color_variable { value: { static_value } }
 *   size       → create_size_variable  { value: { static_value: { value, unit } } }
 *   number     → create_number_variable{ value: { static_value } }
 *   fontFamily → create_font_family_variable { value: { static_value } }
 * Dark values → update_color_variable with the dark mode_id after creation.
 */
const MCP_ACTION = {
  color: 'create_color_variable',
  size: 'create_size_variable',
  number: 'create_number_variable',
  fontFamily: 'create_font_family_variable',
};

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(`Usage: node scripts/sync-webflow.mjs [--plan <file>]
Compiles tokens-nested.json into an MCP-ready Webflow Variables plan.
Apply via a Webflow-MCP session — see docs/webflow-playbook.md.`);
    process.exit(0);
  }

  const nested = loadNested();
  const darkSrc = loadDarkRefs();
  const desired = buildDesired(nested, darkSrc);

  const byGroup = desired.reduce((acc, d) => {
    const g = d.name.split('/')[0];
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});
  const withDark = desired.filter((d) => d.dark != null).length;

  console.log(`Source: ${NESTED}`);
  console.log(`Collection: "${COLLECTION_NAME}" · mode "${DARK_MODE_NAME}" for ${withDark} colors`);
  console.log(`Desired variables: ${desired.length}`, byGroup);

  const plan = {
    version: 1,
    collection: COLLECTION_NAME,
    darkMode: DARK_MODE_NAME,
    source: 'packages/tokens/build/json/tokens-nested.json',
    note: 'Apply via Webflow MCP data_variable_tool. Diff first with query_variables; never delete orphans automatically.',
    actions: MCP_ACTION,
    variables: desired,
  };

  if (args.plan) {
    writeFileSync(args.plan, JSON.stringify(plan, null, 2));
    console.log(`\nPlan written: ${args.plan}`);
  } else {
    console.log('\nSample:');
    for (const item of desired.slice(0, 6)) console.log(' ', JSON.stringify(item));
    console.log(`  ... (${desired.length - 6} more). Use --plan <file> for the full plan.`);
  }
}

main();
