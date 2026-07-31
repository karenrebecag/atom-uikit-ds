/**
 * F5 — Derive public/r/shadcn/* from canónico public/r items.
 * Pure mapping; never a second authoring source.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';

const SCHEMA_ITEM = 'https://ui.shadcn.com/schema/registry-item.json';
const SCHEMA_REGISTRY = 'https://ui.shadcn.com/schema/registry.json';

const ITEM_TYPES = new Set([
  'registry:lib',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:theme',
  'registry:page',
  'registry:file',
  'registry:style',
  'registry:base',
  'registry:font',
  'registry:item',
]);

const FILE_TYPES = new Set([
  'registry:lib',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:theme',
  'registry:page',
  'registry:file',
  'registry:style',
  'registry:base',
  'registry:item',
]);

const BEM_DOCS =
  'ATOM UIKit ships global BEM classes. CSS files MUST be imported in a global stylesheet ' +
  '(e.g. app/globals.css) — do not convert them to CSS Modules. ' +
  'Foundations (tokens/foundation) are not installed via this shadcn channel; use the Atom MCP ' +
  'or full DS setup for design tokens. Tuning ranges and gotchas: see meta.agent when present.';

/**
 * Lightweight validation against the official registry-item required shape
 * (fixture: scripts/fixtures/shadcn-registry-item.schema.json). No AJV dep.
 * @param {Record<string, unknown>} item
 * @returns {string[]}
 */
export function validateShadcnItem(item) {
  const errors = [];
  if (typeof item.name !== 'string' || !item.name) errors.push('name required');
  if (typeof item.type !== 'string' || !ITEM_TYPES.has(item.type)) {
    errors.push(`type must be one of shadcn item types (got ${JSON.stringify(item.type)})`);
  }
  if (item.files != null) {
    if (!Array.isArray(item.files)) errors.push('files must be an array');
    else {
      item.files.forEach((f, i) => {
        if (!f || typeof f !== 'object') {
          errors.push(`files[${i}] must be object`);
          return;
        }
        if (typeof f.path !== 'string' || !f.path) errors.push(`files[${i}].path required`);
        if (typeof f.type !== 'string' || !FILE_TYPES.has(f.type)) {
          errors.push(`files[${i}].type invalid`);
        }
        if (f.type === 'registry:file' || f.type === 'registry:page') {
          if (typeof f.target !== 'string' || !f.target) {
            errors.push(`files[${i}].target required for type ${f.type}`);
          }
        }
      });
    }
  }
  if (item.dependencies != null && !Array.isArray(item.dependencies)) {
    errors.push('dependencies must be an array');
  }
  if (item.registryDependencies != null && !Array.isArray(item.registryDependencies)) {
    errors.push('registryDependencies must be an array');
  }
  if (item.meta != null && (typeof item.meta !== 'object' || Array.isArray(item.meta))) {
    errors.push('meta must be an object');
  }
  return errors;
}

/**
 * @param {Record<string, unknown>} canonical — published public/r/{name}.json
 * @param {{ kind?: string, name: string }} indexEntry
 * @param {Set<string>} emittedNames — names that will exist on the shadcn channel
 * @returns {{ ok: true, item: Record<string, unknown> } | { ok: false, reason: string }}
 */
export function mapCanonicalToShadcn(canonical, indexEntry, emittedNames) {
  const kind = indexEntry.kind ?? canonical.kind;
  const name = indexEntry.name ?? canonical.name;

  if (kind === 'foundation') {
    return { ok: false, reason: 'foundation — not a shadcn UI install unit in wave 1' };
  }
  if (kind === 'layout') {
    return { ok: false, reason: 'layout — use MCP layout/* channel; block emission deferred' };
  }
  if (kind === 'hook') {
    return { ok: false, reason: 'hook — registry:hook emission deferred' };
  }
  if (kind !== 'component') {
    return { ok: false, reason: `kind ${kind ?? 'unknown'} not mapped` };
  }

  const filesIn = Array.isArray(canonical.files) ? canonical.files : [];
  const hasReact = filesIn.some(
    (f) => typeof f.path === 'string' && (f.path.endsWith('.tsx') || f.path.endsWith('.jsx')),
  );
  if (!hasReact) {
    return { ok: false, reason: 'component without React source' };
  }

  const files = [];
  for (const f of filesIn) {
    if (!f?.path) continue;
    const isCss = f.path.endsWith('.css');
    const isReact = f.path.endsWith('.tsx') || f.path.endsWith('.jsx');
    if (isCss) {
      const base = path.posix.basename(f.path);
      files.push({
        path: f.path,
        type: 'registry:file',
        target: `styles/atom-uikit/${base}`,
        ...(typeof f.content === 'string' ? { content: f.content } : {}),
      });
    } else if (isReact) {
      files.push({
        path: f.path,
        type: 'registry:component',
        ...(typeof f.content === 'string' ? { content: f.content } : {}),
      });
    } else if (f.path.endsWith('.ts') && f.path.includes('animation')) {
      files.push({
        path: f.path,
        type: 'registry:lib',
        ...(typeof f.content === 'string' ? { content: f.content } : {}),
      });
    }
  }

  if (!files.some((f) => f.type === 'registry:component')) {
    return { ok: false, reason: 'no mappable React file after filter' };
  }

  const peerDeps = canonical.atom?.implementation?.peerDeps ?? [];
  const npmDeps = [
    ...new Set([...(canonical.dependencies ?? []), ...peerDeps].filter((d) => typeof d === 'string')),
  ];

  const rawRegDeps = canonical.registryDependencies ?? [];
  const registryDependencies = rawRegDeps.filter((d) => emittedNames.has(d));

  const category = canonical.atom?.discovery?.category;
  const categories = category ? [String(category)] : undefined;

  /** @type {Record<string, unknown>} */
  const item = {
    $schema: SCHEMA_ITEM,
    name,
    type: 'registry:component',
    title: canonical.title ?? name,
    description: canonical.description ?? '',
    ...(categories ? { categories } : {}),
    ...(npmDeps.length ? { dependencies: npmDeps } : {}),
    ...(registryDependencies.length ? { registryDependencies } : {}),
    files,
    docs: BEM_DOCS,
  };

  if (canonical.meta && typeof canonical.meta === 'object') {
    item.meta = canonical.meta;
  }

  const errors = validateShadcnItem(item);
  if (errors.length) {
    return { ok: false, reason: `schema validation: ${errors.join('; ')}` };
  }

  return { ok: true, item };
}

/**
 * @param {string} publicRDir
 * @param {{ log?: Function }} [opts]
 */
export async function emitShadcnChannel(publicRDir, opts = {}) {
  const log = opts.log ?? console.log;
  const outDir = path.join(publicRDir, 'shadcn');
  await fs.mkdir(outDir, { recursive: true });

  const indexPath = path.join(publicRDir, 'index.json');
  const index = JSON.parse(await fs.readFile(indexPath, 'utf8'));

  // Precompute which component names have React (can be registryDependencies targets)
  const withReact = new Set();
  for (const entry of index) {
    if (entry.kind !== 'component') continue;
    const safe = String(entry.name).replace(/\//g, '--');
    const itemPath = path.join(publicRDir, `${safe}.json`);
    if (!existsSync(itemPath)) continue;
    const canonical = JSON.parse(await fs.readFile(itemPath, 'utf8'));
    const hasReact = (canonical.files ?? []).some(
      (f) => typeof f.path === 'string' && (f.path.endsWith('.tsx') || f.path.endsWith('.jsx')),
    );
    if (hasReact) withReact.add(entry.name);
  }

  const emitted = [];
  const excluded = [];

  for (const entry of index) {
    const safe = String(entry.name).replace(/\//g, '--');
    const itemPath = path.join(publicRDir, `${safe}.json`);
    let canonical = {};
    if (existsSync(itemPath)) {
      canonical = JSON.parse(await fs.readFile(itemPath, 'utf8'));
    }

    const result = mapCanonicalToShadcn(canonical, entry, withReact);
    if (!result.ok) {
      excluded.push({ name: entry.name, reason: result.reason });
      continue;
    }
    emitted.push(result.item);
    await fs.writeFile(
      path.join(outDir, `${safe}.json`),
      JSON.stringify(result.item, null, 2) + '\n',
      'utf8',
    );
  }

  const catalogItems = emitted.map((item) => {
    const { files, ...rest } = item;
    return {
      ...rest,
      files: (files ?? []).map(({ content: _c, ...f }) => f),
    };
  });

  const registry = {
    $schema: SCHEMA_REGISTRY,
    name: '@atom-uikit',
    homepage: 'https://uikit.atomchat.io',
    items: catalogItems,
  };

  await fs.writeFile(path.join(outDir, 'registry.json'), JSON.stringify(registry, null, 2) + '\n', 'utf8');

  const expected = new Set([
    'registry.json',
    ...emitted.map((i) => `${String(i.name).replace(/\//g, '--')}.json`),
  ]);
  for (const file of await fs.readdir(outDir)) {
    if (file.endsWith('.json') && !expected.has(file)) {
      await fs.rm(path.join(outDir, file));
      log(`  [shadcn] removed orphan ${file}`);
    }
  }

  log(`  [shadcn] emitted ${emitted.length} items → ${outDir}/`);
  for (const e of excluded) {
    log(`  [shadcn] excluded ${e.name}: ${e.reason}`);
  }
  log(
    `  [shadcn] summary: canónico=${index.length} emitted=${emitted.length} excluded=${excluded.length}`,
  );

  if (index.length !== emitted.length + excluded.length) {
    throw new Error(
      `shadcn emit accounting error: ${index.length} !== ${emitted.length}+${excluded.length}`,
    );
  }

  // Fail build if any emitted item fails re-validation (belt + suspenders)
  for (const item of emitted) {
    const errs = validateShadcnItem(item);
    if (errs.length) {
      throw new Error(`shadcn item ${item.name} invalid: ${errs.join('; ')}`);
    }
  }

  return { emitted, excluded, registry };
}

// CLI
const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.dirname, 'emit-shadcn-registry.mjs');
if (isMain) {
  const root = path.resolve(import.meta.dirname, '..');
  await emitShadcnChannel(path.join(root, 'public', 'r'));
}
