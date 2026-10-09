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

export const FOUNDATION_NAME = 'atom-foundation';
export const TOKENS_NAME = 'atom-tokens';
export const FONT_CDN = 'https://atom-web-ds.vercel.app/v1/fonts/';

// Canonical foundation items all ship inside the built foundation.css, so one node covers them.
export const FOUNDATION_ALIASES = new Set(['tokens', 'foundation', 'utilities', 'tokens-dark']);

const BEM_DOCS =
  'ATOM UIKit ships global BEM classes. CSS files MUST be imported in a global stylesheet ' +
  '(e.g. app/globals.css) — do not convert them to CSS Modules. ' +
  `Tokens and foundation come from the ${FOUNDATION_NAME} node this item depends on: import ` +
  'styles/atom-uikit/foundation.css once, before the component CSS (skip it if the page already ' +
  'loads /v1/foundation.css). Tuning ranges and gotchas: see meta.agent when present.';

const FOUNDATION_DOCS =
  'Import it ONCE in the global styles entry, before any component CSS. Dark mode: set ' +
  'data-theme="dark" on the root element. Do not convert it to CSS Modules. If the page already ' +
  'loads https://atom-web-ds.vercel.app/v1/foundation.css, do not install this node.';

const TOKENS_DOCS =
  'Variables only (light and dark), no fonts or utilities. Use it instead of ' +
  `${FOUNDATION_NAME}, never together. Import it once in the global styles entry.`;

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
 * Canonical registryDependencies → shadcn channel names. Foundation aliases collapse into one
 * node (listed first so the CLI installs it before the components); anything not emitted is
 * returned in `unresolved` so the caller can log it and name it in docs instead of losing it.
 * @param {string[]} rawDeps
 * @param {Set<string>} emittedNames
 * @param {Map<string, string>} reasons — why a name is not emitted
 */
export function translateRegistryDeps(rawDeps, emittedNames, reasons = new Map()) {
  const deps = [];
  const unresolved = [];
  for (const d of rawDeps) {
    if (FOUNDATION_ALIASES.has(d)) {
      if (!deps.includes(FOUNDATION_NAME)) deps.unshift(FOUNDATION_NAME);
    } else if (emittedNames.has(d)) {
      if (!deps.includes(d)) deps.push(d);
    } else {
      unresolved.push({ dep: d, reason: reasons.get(d) ?? 'not in the canonical index' });
    }
  }
  return { deps, unresolved };
}

/** @param {{ kind?: string }} entry @param {boolean} hasSource */
export function exclusionReason(kind, hasSource) {
  if (kind === 'foundation') return `foundation — shipped inside ${FOUNDATION_NAME}`;
  if (kind === 'layout') return 'layout — use MCP layout/* channel; block emission deferred';
  if (kind === 'component' && !hasSource) return 'component without React source';
  if (kind === 'hook' && !hasSource) return 'hook without .ts source';
  return `kind ${kind ?? 'unknown'} not mapped`;
}

const unresolvedDocs = (unresolved) =>
  unresolved.length
    ? ` Not installed by this channel (use the Atom MCP): ${unresolved
        .map((u) => `${u.dep} (${u.reason})`)
        .join('; ')}.`
    : '';

/**
 * @param {Record<string, unknown>} canonical — published public/r/{name}.json
 * @param {{ kind?: string, name: string }} indexEntry
 * @param {Set<string>} emittedNames — names that will exist on the shadcn channel
 * @param {Map<string, string>} [reasons] — exclusion reason per non-emitted name
 * @returns {{ ok: true, item: Record<string, unknown>, unresolved: {dep: string, reason: string}[] } | { ok: false, reason: string }}
 */
export function mapCanonicalToShadcn(canonical, indexEntry, emittedNames, reasons) {
  const kind = indexEntry.kind ?? canonical.kind;
  const name = indexEntry.name ?? canonical.name;

  if (kind === 'hook') return mapHook(canonical, name, emittedNames, reasons);
  if (kind !== 'component') return { ok: false, reason: exclusionReason(kind, false) };

  const filesIn = Array.isArray(canonical.files) ? canonical.files : [];
  const hasReact = filesIn.some(
    (f) => typeof f.path === 'string' && (f.path.endsWith('.tsx') || f.path.endsWith('.jsx')),
  );
  if (!hasReact) {
    return { ok: false, reason: exclusionReason('component', false) };
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

  const { deps: registryDependencies, unresolved } = translateRegistryDeps(
    canonical.registryDependencies ?? [],
    emittedNames,
    reasons,
  );

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
    docs: BEM_DOCS + unresolvedDocs(unresolved),
  };

  if (canonical.meta && typeof canonical.meta === 'object') {
    item.meta = canonical.meta;
  }

  const errors = validateShadcnItem(item);
  if (errors.length) {
    return { ok: false, reason: `schema validation: ${errors.join('; ')}` };
  }

  return { ok: true, item, unresolved };
}

function mapHook(canonical, name, emittedNames, reasons) {
  const src = (canonical.files ?? []).find((f) => typeof f?.path === 'string' && f.path.endsWith('.ts'));
  if (!src) return { ok: false, reason: exclusionReason('hook', false) };

  const peerDeps = canonical.atom?.implementation?.peerDeps ?? [];
  const npmDeps = [
    ...new Set([...(canonical.dependencies ?? []), ...peerDeps].filter((d) => typeof d === 'string')),
  ];
  const { deps: registryDependencies, unresolved } = translateRegistryDeps(
    canonical.registryDependencies ?? [],
    emittedNames,
    reasons,
  );

  const item = {
    $schema: SCHEMA_ITEM,
    name,
    type: 'registry:lib',
    title: canonical.title ?? name,
    description: canonical.description ?? '',
    ...(npmDeps.length ? { dependencies: npmDeps } : {}),
    ...(registryDependencies.length ? { registryDependencies } : {}),
    files: [
      {
        path: src.path,
        type: 'registry:lib',
        ...(typeof src.content === 'string' ? { content: src.content } : {}),
      },
    ],
    ...(unresolved.length ? { docs: unresolvedDocs(unresolved).trim() } : {}),
  };

  const errors = validateShadcnItem(item);
  if (errors.length) return { ok: false, reason: `schema validation: ${errors.join('; ')}` };
  return { ok: true, item, unresolved };
}

/**
 * Foundation nodes come from the BUILT css, never from the canonical foundation items: those
 * point at packages/css/src/** and @import sibling packages by relative path, which breaks once
 * copied to a foreign project. Fails when the dist is missing rather than ship a dangling node.
 * @param {string} cssDistDir — packages/css/dist
 * @returns {Promise<Record<string, unknown>[]>}
 */
export async function buildFoundationItems(cssDistDir) {
  const read = async (file) => {
    const p = path.join(cssDistDir, file);
    if (!existsSync(p)) {
      throw new Error(`${file} missing in ${cssDistDir} — run: pnpm --filter @atom-uikit/css build`);
    }
    return fs.readFile(p, 'utf8');
  };

  const fontUrl = /url\((['"]?)\.{1,2}\/fonts\//g;
  const foundationCss = (await read('foundation.css')).replace(fontUrl, `url($1${FONT_CDN}`);
  const tokensCss = await read('tokens.css');

  const node = (name, title, description, file, content, docs) => ({
    $schema: SCHEMA_ITEM,
    name,
    type: 'registry:item',
    title,
    description,
    files: [
      {
        path: `packages/css/dist/${file}`,
        type: 'registry:file',
        target: `styles/atom-uikit/${file}`,
        content,
      },
    ],
    docs,
  });

  return [
    node(
      FOUNDATION_NAME,
      'Atom UIKit foundation',
      'Tokens (light and dark), fonts, foundation and utilities of the Atom UIKit in a single CSS.',
      'foundation.css',
      foundationCss,
      FOUNDATION_DOCS,
    ),
    node(
      TOKENS_NAME,
      'Atom UIKit tokens',
      'Atom UIKit design tokens as CSS variables (light and dark), without fonts or utilities.',
      'tokens.css',
      tokensCss,
      TOKENS_DOCS,
    ),
  ];
}

/**
 * @param {string} publicRDir
 * @param {{ log?: Function, cssDistDir?: string }} [opts]
 */
export async function emitShadcnChannel(publicRDir, opts = {}) {
  const log = opts.log ?? console.log;
  const cssDistDir = opts.cssDistDir ?? path.resolve(publicRDir, '..', '..', 'packages', 'css', 'dist');
  const outDir = path.join(publicRDir, 'shadcn');

  // Before touching outDir: a missing dist must fail the build, not leave a half-written channel.
  const foundationItems = await buildFoundationItems(cssDistDir);

  await fs.mkdir(outDir, { recursive: true });

  const indexPath = path.join(publicRDir, 'index.json');
  const index = JSON.parse(await fs.readFile(indexPath, 'utf8'));

  const readCanonical = async (entry) => {
    const safe = String(entry.name).replace(/\//g, '--');
    const itemPath = path.join(publicRDir, `${safe}.json`);
    return existsSync(itemPath) ? JSON.parse(await fs.readFile(itemPath, 'utf8')) : {};
  };

  // Precompute which names will exist on the channel (valid registryDependencies targets) and
  // why the rest will not, so a dropped dep can be reported with its reason.
  const emittable = new Set([FOUNDATION_NAME, TOKENS_NAME]);
  const reasons = new Map();
  for (const entry of index) {
    const canonical = await readCanonical(entry);
    const sourceExt = entry.kind === 'hook' ? ['.ts'] : ['.tsx', '.jsx'];
    const hasSource = (canonical.files ?? []).some(
      (f) => typeof f.path === 'string' && sourceExt.some((ext) => f.path.endsWith(ext)),
    );
    if ((entry.kind === 'component' || entry.kind === 'hook') && hasSource) emittable.add(entry.name);
    else reasons.set(entry.name, exclusionReason(entry.kind, hasSource));
  }

  const emitted = [];
  const excluded = [];
  const unresolvedByItem = [];

  for (const entry of index) {
    const canonical = await readCanonical(entry);
    const result = mapCanonicalToShadcn(canonical, entry, emittable, reasons);
    if (!result.ok) {
      excluded.push({ name: entry.name, reason: result.reason });
      continue;
    }
    emitted.push(result.item);
    for (const u of result.unresolved) unresolvedByItem.push({ item: entry.name, ...u });
  }

  const nodes = [...foundationItems, ...emitted];
  for (const item of nodes) {
    await fs.writeFile(
      path.join(outDir, `${String(item.name).replace(/\//g, '--')}.json`),
      JSON.stringify(item, null, 2) + '\n',
      'utf8',
    );
  }

  const catalogItems = nodes.map((item) => {
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
    ...nodes.map((i) => `${String(i.name).replace(/\//g, '--')}.json`),
  ]);
  for (const file of await fs.readdir(outDir)) {
    if (file.endsWith('.json') && !expected.has(file)) {
      await fs.rm(path.join(outDir, file));
      log(`  [shadcn] removed orphan ${file}`);
    }
  }

  log(`  [shadcn] emitted ${nodes.length} items → ${outDir}/`);
  for (const e of excluded) {
    log(`  [shadcn] excluded ${e.name}: ${e.reason}`);
  }
  for (const u of unresolvedByItem) {
    log(`  [shadcn] dep not installable ${u.item} → ${u.dep}: ${u.reason}`);
  }
  log(
    `  [shadcn] summary: canónico=${index.length} emitted=${emitted.length} excluded=${excluded.length} foundation-nodes=${foundationItems.length}`,
  );

  if (index.length !== emitted.length + excluded.length) {
    throw new Error(
      `shadcn emit accounting error: ${index.length} !== ${emitted.length}+${excluded.length}`,
    );
  }

  // Fail build if any emitted item fails re-validation (belt + suspenders)
  for (const item of nodes) {
    const errs = validateShadcnItem(item);
    if (errs.length) {
      throw new Error(`shadcn item ${item.name} invalid: ${errs.join('; ')}`);
    }
  }

  return { emitted: nodes, excluded, registry };
}

// CLI
const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.dirname, 'emit-shadcn-registry.mjs');
if (isMain) {
  const root = path.resolve(import.meta.dirname, '..');
  await emitShadcnChannel(path.join(root, 'public', 'r'));
}
