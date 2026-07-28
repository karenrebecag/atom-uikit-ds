#!/usr/bin/env node
/**
 * sync-webflow.mjs
 *
 * Upserts Atom DS semantic tokens + scales into Webflow native Variables
 * from packages/tokens/build/json/tokens-nested.json.
 *
 * Env (never hardcode):
 *   WEBFLOW_TOKEN    — site or OAuth token with variables scopes
 *   WEBFLOW_SITE_ID  — target site (staging for first runs)
 *
 * Usage:
 *   node scripts/sync-webflow.mjs --dry-run              # default; no writes
 *   node scripts/sync-webflow.mjs --site <id>            # dry-run against site
 *   node scripts/sync-webflow.mjs --site <id> --apply    # write
 *
 * API base: https://api.webflow.com/v2
 * Endpoints used (Data API v2 Variables — verify if 404 with --dry-run offline):
 *   GET/POST  /sites/{siteId}/variable_collections
 *   GET/POST  /sites/{siteId}/variable_collections/{collectionId}/variables
 *   PATCH     /sites/{siteId}/variable_collections/{collectionId}/variables/{variableId}
 *   POST      /sites/{siteId}/variable_collections/{collectionId}/modes
 *
 * If Webflow renames these routes, update PATHS below only.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const NESTED = resolve(ROOT, 'packages/tokens/build/json/tokens-nested.json');
const DARK_SRC = resolve(ROOT, 'packages/tokens/src/semantic/dark.json');
const API = 'https://api.webflow.com/v2';
const COLLECTION_NAME = 'Atom DS v1';
const DARK_MODE_NAME = 'dark';

const PATHS = {
  listCollections: (siteId) => `${API}/sites/${siteId}/variable_collections`,
  createCollection: (siteId) => `${API}/sites/${siteId}/variable_collections`,
  listVariables: (siteId, colId) =>
    `${API}/sites/${siteId}/variable_collections/${colId}/variables`,
  createVariable: (siteId, colId) =>
    `${API}/sites/${siteId}/variable_collections/${colId}/variables`,
  updateVariable: (siteId, colId, varId) =>
    `${API}/sites/${siteId}/variable_collections/${colId}/variables/${varId}`,
  createMode: (siteId, colId) =>
    `${API}/sites/${siteId}/variable_collections/${colId}/modes`,
};

// Semantic color keys (string top-level in nested) — exclude non-colors
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
  const args = { dryRun: true, siteId: process.env.WEBFLOW_SITE_ID || null, apply: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--apply') {
      args.apply = true;
      args.dryRun = false;
    } else if (a === '--dry-run') {
      args.dryRun = true;
      args.apply = false;
    } else if (a === '--site') {
      args.siteId = argv[++i];
    } else if (a === '--help' || a === '-h') {
      args.help = true;
    }
  }
  return args;
}

function loadNested() {
  if (!existsSync(NESTED)) {
    console.error(`FATAL: missing ${NESTED}`);
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

/** Parse CSS size like "16px" | "1.5rem" | "0.02em" → { value, unit } for Webflow Size */
function parseSize(raw) {
  if (typeof raw !== 'string') return null;
  const m = raw.trim().match(/^(-?[\d.]+)(px|rem|em|%|vh|vw)?$/i);
  if (!m) return null;
  return { value: Number(m[1]), unit: (m[2] || 'px').toLowerCase() };
}

/**
 * Build the desired Webflow variable set from tokens-nested.
 * Naming: color/background, type/font-size-base, space/section-padding-l, radius/md, stroke/thin
 */
function buildDesired(nested, darkSrc) {
  const desired = [];

  // Semantic colors
  for (const [key, val] of Object.entries(nested)) {
    if (typeof val !== 'string') continue;
    if (COLOR_SEMANTIC_SKIP.has(key)) continue;
    if (SIZE_PREFIXES.some((p) => key.startsWith(p))) continue;
    // skip non-hex-ish (dimensions already skipped)
    if (!val.startsWith('#') && !val.startsWith('rgb') && !val.startsWith('hsl')) continue;

    const darkRef = darkSrc[key]?.$value;
    const darkVal = darkRef ? resolveRef(nested, darkRef) : null;

    desired.push({
      name: `color/${key}`,
      type: 'color',
      value: val,
      darkValue: darkVal,
    });
  }

  // Font families
  const ff = nested['font-family'] || {};
  for (const [k, v] of Object.entries(ff)) {
    if (typeof v !== 'string') continue;
    // Webflow Font Family vars typically want family name, not full stack
    const primary = v.split(',')[0].replace(/['"]/g, '').trim();
    desired.push({ name: `type/font-family-${k}`, type: 'fontFamily', value: primary });
  }

  // Font sizes
  const fs = nested['font-size'] || {};
  for (const [k, v] of Object.entries(fs)) {
    const size = parseSize(v);
    if (!size) continue;
    desired.push({ name: `type/font-size-${k}`, type: 'size', value: size });
  }

  // Line heights as number (unitless) when possible
  const lh = nested['line-height'] || {};
  for (const [k, v] of Object.entries(lh)) {
    const n = Number(v);
    if (!Number.isFinite(n)) continue;
    desired.push({ name: `type/line-height-${k}`, type: 'number', value: n });
  }

  // Section padding + gap
  for (const [key, val] of Object.entries(nested)) {
    if (typeof val !== 'string') continue;
    if (!SIZE_PREFIXES.some((p) => key.startsWith(p))) continue;
    const size = parseSize(val);
    if (!size) continue;
    desired.push({ name: `space/${key}`, type: 'size', value: size });
  }

  // Radius
  const radius = nested.radius || {};
  for (const [k, v] of Object.entries(radius)) {
    const size = parseSize(v);
    if (!size) continue;
    desired.push({ name: `radius/${k}`, type: 'size', value: size });
  }

  // Stroke
  const stroke = nested.stroke || {};
  for (const [k, v] of Object.entries(stroke)) {
    const size = parseSize(v);
    if (!size) continue;
    desired.push({ name: `stroke/${k}`, type: 'size', value: size });
  }

  return desired;
}

function valuesEqual(type, a, b) {
  if (type === 'size') {
    return a?.value === b?.value && a?.unit === b?.unit;
  }
  return String(a) === String(b);
}

function toApiBody(item) {
  // Body shape follows Webflow Variables REST conventions; adjust if API rejects.
  switch (item.type) {
    case 'color':
      return { name: item.name, type: 'color', value: { static: item.value } };
    case 'fontFamily':
      return { name: item.name, type: 'font-family', value: { static: item.value } };
    case 'size':
      return {
        name: item.name,
        type: 'size',
        value: { static: { value: item.value.value, unit: item.value.unit } },
      };
    case 'number':
      return { name: item.name, type: 'number', value: { static: item.value } };
    default:
      throw new Error(`unknown type ${item.type}`);
  }
}

async function api(token, method, url, body) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`${method} ${url} → ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function printPlan(desired, existingByName) {
  let create = 0;
  let update = 0;
  let same = 0;
  for (const item of desired) {
    const ex = existingByName.get(item.name);
    if (!ex) {
      create++;
      console.log(`  + create  ${item.name}  (${item.type})`);
    } else if (!valuesEqual(item.type, item.value, ex.value)) {
      update++;
      console.log(`  ~ update  ${item.name}  (${item.type})`);
    } else {
      same++;
    }
  }
  const orphan = [...existingByName.keys()].filter(
    (n) => n.startsWith('color/') || n.startsWith('type/') || n.startsWith('space/') || n.startsWith('radius/') || n.startsWith('stroke/')
  ).filter((n) => !desired.some((d) => d.name === n));
  for (const n of orphan) console.log(`  ? orphan  ${n}  (exists in Webflow, not in tokens — not deleted)`);
  console.log(`\nPlan: ${create} create, ${update} update, ${same} unchanged, ${orphan.length} orphan`);
  return { create, update, same, orphan: orphan.length };
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(`Usage: node scripts/sync-webflow.mjs [--site ID] [--dry-run|--apply]
Env: WEBFLOW_TOKEN, WEBFLOW_SITE_ID`);
    process.exit(0);
  }

  const nested = loadNested();
  const darkSrc = loadDarkRefs();
  const desired = buildDesired(nested, darkSrc);

  console.log(`Source: ${NESTED}`);
  console.log(`Desired variables: ${desired.length}`);
  console.log(`Mode: ${args.dryRun ? 'DRY-RUN (no writes)' : 'APPLY'}`);
  console.log(`Collection: "${COLLECTION_NAME}"`);

  // Offline dry-run (no token / no site): print plan only
  if (args.dryRun && (!args.siteId || !process.env.WEBFLOW_TOKEN)) {
    console.log('\nOffline dry-run (no WEBFLOW_TOKEN or site). Sample payload:');
    for (const item of desired.slice(0, 8)) {
      console.log(' ', JSON.stringify(toApiBody(item)));
    }
    console.log(`  ... (${desired.length - 8} more)`);
    const byGroup = desired.reduce((acc, d) => {
      const g = d.name.split('/')[0];
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});
    console.log('\nBy group:', byGroup);
    console.log('\nTo sync for real: export WEBFLOW_TOKEN + WEBFLOW_SITE_ID, then:');
    console.log('  node scripts/sync-webflow.mjs --site $WEBFLOW_SITE_ID --apply');
    process.exit(0);
  }

  const token = process.env.WEBFLOW_TOKEN;
  if (!token) {
    console.error('FATAL: WEBFLOW_TOKEN required for site operations');
    process.exit(1);
  }
  if (!args.siteId) {
    console.error('FATAL: --site or WEBFLOW_SITE_ID required');
    process.exit(1);
  }

  // 1. Collection
  let collections;
  try {
    collections = await api(token, 'GET', PATHS.listCollections(args.siteId));
  } catch (e) {
    console.error('Failed to list variable collections.', e.message, e.data);
    console.error(
      'If 404: Variables Data API path may differ — check developers.webflow.com Data API > Variables and update PATHS in this script.'
    );
    process.exit(1);
  }

  const list = collections.variableCollections || collections.collections || collections || [];
  let col = (Array.isArray(list) ? list : []).find((c) => c.displayName === COLLECTION_NAME || c.name === COLLECTION_NAME);

  if (!col && !args.dryRun) {
    console.log(`Creating collection "${COLLECTION_NAME}"...`);
    col = await api(token, 'POST', PATHS.createCollection(args.siteId), {
      displayName: COLLECTION_NAME,
      name: COLLECTION_NAME,
    });
  } else if (!col && args.dryRun) {
    console.log(`Would create collection "${COLLECTION_NAME}"`);
  }

  const colId = col?.id;
  let existingByName = new Map();

  if (colId) {
    const varsRes = await api(token, 'GET', PATHS.listVariables(args.siteId, colId));
    const vars = varsRes.variables || varsRes || [];
    for (const v of Array.isArray(vars) ? vars : []) {
      // Normalize existing value for comparison (best-effort)
      const name = v.name || v.displayName;
      let value = v.value?.static ?? v.value;
      if (v.type === 'size' && value && typeof value === 'object') {
        value = { value: value.value, unit: value.unit };
      }
      existingByName.set(name, { id: v.id, type: v.type, value });
    }
  }

  const plan = printPlan(desired, existingByName);

  if (args.dryRun) {
    console.log('\nDry-run complete — no writes.');
    process.exit(0);
  }

  // 2. Upsert
  let created = 0;
  let updated = 0;
  let unchanged = 0;
  for (const item of desired) {
    const ex = existingByName.get(item.name);
    const body = toApiBody(item);
    try {
      if (!ex) {
        await api(token, 'POST', PATHS.createVariable(args.siteId, colId), body);
        created++;
      } else if (!valuesEqual(item.type, item.value, ex.value)) {
        await api(token, 'PATCH', PATHS.updateVariable(args.siteId, colId, ex.id), body);
        updated++;
      } else {
        unchanged++;
      }
    } catch (e) {
      console.error(`FAIL ${item.name}:`, e.message, e.data);
    }
  }

  // 3. Dark mode — best effort
  try {
    await api(token, 'POST', PATHS.createMode(args.siteId, colId), { name: DARK_MODE_NAME });
    console.log(`Mode "${DARK_MODE_NAME}" ensured (or already exists).`);
  } catch (e) {
    if (e.status === 409 || e.status === 400) {
      console.log(`Mode "${DARK_MODE_NAME}": skipped (${e.status})`);
    } else {
      console.warn(
        `Could not create dark mode (${e.status}). Light values synced; set dark mode values in Designer or extend script when API shape is confirmed.`
      );
    }
  }

  console.log(`\nDone: ${created} created, ${updated} updated, ${unchanged} unchanged (plan was ${plan.create}/${plan.update}/${plan.same}).`);
  console.log('Orphans listed above were NOT deleted.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
