/**
 * build-registry.mjs
 *
 * Reads registry.json (internal AtomRegistryItem schema),
 * resolves source files, embeds content, extracts component metadata,
 * and writes enriched shadcn-compatible per-item JSONs to public/r/.
 *
 * The `atom` field (discovery + implementation) is injected into each
 * item by extract-component-metadata.ts — see plan-registry-consolidation.md Wave 1.
 *
 * Usage: node scripts/build-registry.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('..', import.meta.url).pathname;
const REGISTRY_PATH = path.join(ROOT, 'registry.json');
const OUT_DIR = path.join(ROOT, 'public', 'r');
const SCHEMA_URL = 'https://ui.shadcn.com/schema/registry-item.json';

// Internal kind → shadcn type mapping
const KIND_TO_TYPE = {
  component: 'registry:component',
  foundation: 'registry:file',
  layout: 'registry:block', // composiciones, igual que los blocks de shadcn
  hook: 'registry:file',
};

// ---------------------------------------------------------------------------
// Layout enrichment — un layout se publica AUTODESCRIPTIVO:
//   files:  el módulo .ts + su html y css PLANOS (para consumidores no-code
//           que nunca van a abrir un template literal de TypeScript)
//   atom.layout: contrato de slots/repeats extraído del html, para que un
//           consumidor (o el MCP) arme el mapa de contenido sin parsear HTML
// ---------------------------------------------------------------------------

const SLOT_RE = /\{\{([\w-]+)\}\}/g;
const REPEAT_RE = /<(\w+)[^>]*data-repeat="([\w-]+)"[^>]*>([\s\S]*?)<\/\1>/g;

function extractSlots(html) {
  const repeats = {};
  let stripped = html;
  for (const [, , key, inner] of html.matchAll(REPEAT_RE)) {
    repeats[key] = [...new Set([...inner.matchAll(SLOT_RE)].map((m) => m[1]))];
  }
  stripped = html.replace(REPEAT_RE, '');
  const slots = [...new Set([...stripped.matchAll(SLOT_RE)].map((m) => m[1]))];
  return { slots, repeats };
}

/**
 * Evalúa el módulo del layout (son JS plano sin imports, la extensión .ts es
 * cosmética) para leer su { html, css, components }. Import por archivo
 * temporal: la única forma de ejecutar ESM desde un string en Node sin loader.
 */
async function evalLayoutModule(source) {
  const tmpDir = path.join(ROOT, 'node_modules', '.registry-tmp');
  await fs.mkdir(tmpDir, { recursive: true });
  const tmp = path.join(tmpDir, `layout-${process.pid}-${Math.random().toString(36).slice(2)}.mjs`);
  await fs.writeFile(tmp, source, 'utf8');
  try {
    const mod = await import(pathToFileURL(tmp).href);
    return Object.values(mod)[0];
  } finally {
    await fs.rm(tmp, { force: true });
  }
}

async function enrichLayout(item, output) {
  const moduleFile = output.files.find((f) => f.path.endsWith('.ts'));
  if (!moduleFile) return;

  const mod = await evalLayoutModule(moduleFile.content);
  if (!mod?.html) {
    console.warn(`  [WARN] ${item.name}: module has no html — skipping layout enrichment`);
    return;
  }

  const slug = item.name.split('/').pop();
  output.files.push({
    path: `layouts/${slug}.html`,
    type: 'registry:file',
    content: mod.html.trim() + '\n',
  });
  if (mod.css) {
    output.files.push({
      path: `layouts/${slug}.css`,
      type: 'registry:file',
      content: mod.css.trim() + '\n',
    });
  }

  output.atom ??= {};
  output.atom.layout = { ...extractSlots(mod.html), components: mod.components ?? [] };
}

// Dynamic import of the extraction module (TypeScript via tsx)
let extractAllMetadata;
try {
  const mod = await import('./extract-component-metadata.ts');
  extractAllMetadata = mod.extractAllMetadata;
} catch (err) {
  console.warn(`  [WARN] Could not load extract-component-metadata: ${err.message}`);
  console.warn('  Falling back to registry build without atom field enrichment.\n');
  extractAllMetadata = null;
}

import { validateAgentMeta } from './validate-agent-meta.mjs';
import { emitShadcnChannel } from './emit-shadcn-registry.mjs';
import { deriveItemDoc, loadResolvedTokens, getSourceCommit } from './derive-doc.mjs';

async function main() {
  const registry = JSON.parse(await fs.readFile(REGISTRY_PATH, 'utf8'));
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Extract metadata for all items (Wave 1 enrichment)
  let metadataMap = new Map();
  if (extractAllMetadata) {
    console.log('  Extracting component metadata...');
    const report = extractAllMetadata(registry.items, ROOT);
    metadataMap = report.results;
    if (report.errors.length > 0) {
      for (const e of report.errors) {
        console.warn(`  [WARN] metadata extraction failed for ${e.slug}: ${e.error}`);
      }
    }
    console.log(`  Metadata extracted: ${metadataMap.size} items\n`);
  }

  // F3: fail the build on invalid meta.agent (slug + prop in messages)
  let agentMetaErrors = 0;
  for (const item of registry.items) {
    if (!item.meta?.agent) continue;
    const atom = metadataMap.get(item.name);
    const knownProps = (atom?.discovery?.props ?? []).map((p) => p.name);
    const result = validateAgentMeta(item.name, item.meta.agent, knownProps);
    if (!result.ok) {
      for (const msg of result.errors) {
        console.error(`  [ERROR] meta.agent: ${msg}`);
      }
      agentMetaErrors += result.errors.length;
    }
  }
  if (agentMetaErrors > 0) {
    console.error(`\n  meta.agent validation failed (${agentMetaErrors} error(s)). Aborting build.\n`);
    process.exit(1);
  }

  let built = 0;
  let enriched = 0;
  let errors = 0;
  let derivedCount = 0;
  let derivedPartial = 0;

  // F12a — mechanical doc layer (meta.derived). Fail soft if tokens missing.
  let resolvedTokens = null;
  let sourceCommit = 'unknown';
  try {
    resolvedTokens = loadResolvedTokens();
    sourceCommit = getSourceCommit();
  } catch (e) {
    console.warn(`  [WARN] F12a derive-doc unavailable: ${e.message}`);
  }
  const derivedAt = new Date().toISOString();

  for (const item of registry.items) {
    try {
      const filesWithContent = await Promise.all(
        item.files.map(async (file) => {
          const absPath = path.join(ROOT, file.sourcePath);
          const content = await fs.readFile(absPath, 'utf8');
          return {
            path: file.outputPath,
            type: file.type,
            content,
          };
        })
      );

      // Compile to shadcn-compatible output
      const output = {
        $schema: SCHEMA_URL,
        name: item.name,
        type: KIND_TO_TYPE[item.kind] || 'registry:file',
        title: item.title,
        description: item.description,
        ...(item.registryDependencies?.length && {
          registryDependencies: item.registryDependencies,
        }),
        ...(item.dependencies?.length && {
          dependencies: item.dependencies,
        }),
        files: filesWithContent,
      };

      // Inject atom field if metadata was extracted
      const atom = metadataMap.get(item.name);
      if (atom) {
        output.atom = atom;
        enriched++;
      }

      // F3: passthrough meta (shadcn free-form) including meta.agent
      if (item.meta && typeof item.meta === 'object') {
        output.meta = { ...item.meta };
      }

      // Layouts first so F14 can read extracted plain CSS from files[]
      if (item.kind === 'layout') {
        await enrichLayout(item, output);
      }

      // F12a/F14: meta.derived — after layout enrich so CSS content is available
      if (resolvedTokens) {
        try {
          const derived = deriveItemDoc(
            { name: item.name, atom: output.atom, files: output.files },
            { tokens: resolvedTokens, sourceCommit, now: derivedAt },
          );
          output.meta = { ...(output.meta || {}), derived };
          derivedCount++;
          if (derived.degraded) derivedPartial++;
        } catch (derr) {
          output.meta = {
            ...(output.meta || {}),
            derived: {
              generatedAt: derivedAt,
              sourceCommit,
              degraded: true,
              degradeReasons: [`derive-error:${derr.message}`],
              install: { peerDeps: [], cssImports: [] },
              anatomy: { bem: '', classes: [] },
              tokens: { resolved: [], sizes: [] },
              motion: [],
            },
          };
          derivedCount++;
          derivedPartial++;
        }
      }

      // Flatten slashes in name for output filename (layout/hero-centered → layout--hero-centered)
      const safeName = item.name.replace(/\//g, '--');
      const outPath = path.join(OUT_DIR, `${safeName}.json`);
      await fs.writeFile(outPath, JSON.stringify(output, null, 2), 'utf8');
      built++;
    } catch (err) {
      console.error(`  [ERROR] ${item.name}: ${err.message}`);
      errors++;
    }
  }

  // Generate enriched index (discovery metadata for MCP bootstrap)
  const index = registry.items.map((item) => {
    const entry = {
      name: item.name,
      kind: item.kind,
      framework: item.framework,
      installGroup: item.installGroup,
      title: item.title,
      description: item.description,
      ...(item.registryDependencies?.length && { registryDependencies: item.registryDependencies }),
    };

    // Inject lightweight discovery into index for MCP warm start.
    // Excludes props[] to keep index under 50KB budget.
    // Full props available via per-item JSON fetch.
    const atom = metadataMap.get(item.name);
    if (atom) {
      const { props, ...discoveryWithoutProps } = atom.discovery;
      entry.discovery = discoveryWithoutProps;
    }

    return entry;
  });

  await fs.writeFile(
    path.join(OUT_DIR, 'index.json'),
    JSON.stringify(index, null, 2),
    'utf8'
  );

  // Anti-drift: public/r/ es un ESPEJO de registry.json, no un acumulador.
  // Sin esto los items borrados del registry siguen sirviéndose para siempre
  // (pasó: 60 huérfanos comp-N vivieron meses en el canal).
  const expected = new Set([
    ...registry.items.map((i) => `${i.name.replace(/\//g, '--')}.json`),
    'index.json',
    'tokens-nested.json',
  ]);
  let removed = 0;
  for (const file of await fs.readdir(OUT_DIR)) {
    if (file.endsWith('.json') && !expected.has(file)) {
      await fs.rm(path.join(OUT_DIR, file));
      console.log(`  Removed orphan: ${file}`);
      removed++;
    }
  }
  if (removed) console.log(`  Orphans removed: ${removed}`);

  // Publish resolved design tokens for the MCP (single source of truth).
  // Raw nested file (not a registry item, not in index.json). The MCP fetches
  // /api/r/tokens-nested.json and overlays these values onto its local skeleton.
  const TOKENS_NESTED = path.join(ROOT, 'packages/tokens/build/json/tokens-nested.json');
  try {
    const tokensNested = await fs.readFile(TOKENS_NESTED, 'utf8');
    JSON.parse(tokensNested); // fail fast if the build output is malformed
    await fs.writeFile(path.join(OUT_DIR, 'tokens-nested.json'), tokensNested, 'utf8');
    console.log('  Published: tokens-nested.json');
  } catch (e) {
    console.error(`  ERROR: could not publish tokens-nested.json: ${e.message}`);
    console.error('  Run `pnpm --filter @atom-uikit/tokens build` first (build:registry chains it).');
    process.exit(1);
  }

  // F12c — editorial markdown → public/r/docs/{slug}.md (MCP + docs loadEditorialMarkdown)
  const editorialCopied = await emitEditorialDocs(ROOT, OUT_DIR);

  console.log(`\n  Registry built: ${built} items (${enriched} enriched), ${errors} errors`);
  if (resolvedTokens) {
    console.log(
      `  [F12a] meta.derived: ${derivedCount} items (${derivedPartial} partial/degraded), sourceCommit=${sourceCommit}`,
    );
  }
  if (editorialCopied >= 0) {
    console.log(`  [F12c] editorial: ${editorialCopied} markdown file(s) → public/r/docs/`);
  }
  console.log(`  Output: ${OUT_DIR}/`);

  // F5: derive official shadcn channel from canónico (no second source of truth)
  try {
    await emitShadcnChannel(OUT_DIR, { log: console.log });
  } catch (err) {
    console.error(`  [ERROR] shadcn channel: ${err.message}`);
    process.exit(1);
  }

  // F6: derive Webflow XscpData artifacts from canónico (generator lives here only)
  try {
    const { emitWebflowChannel } = await import('./emit-webflow-channel.mjs');
    await emitWebflowChannel(OUT_DIR, { log: console.log });
  } catch (err) {
    console.error(`  [ERROR] webflow channel: ${err.message}`);
    process.exit(1);
  }

  console.log('');

  if (errors > 0) process.exit(1);

  // Trigger docs site rebuild so it syncs fresh registry data
  const hookUrl = process.env.DOCS_DEPLOY_HOOK;
  if (hookUrl) {
    try {
      const res = await fetch(hookUrl, { method: 'POST' });
      console.log(`  Deploy hook: ${res.ok ? 'triggered docs rebuild' : `failed (${res.status})`}`);
    } catch (e) {
      console.warn(`  Deploy hook: failed (${e.message})`);
    }
  }
}

/**
 * F12c — copy editorial markdown into the published registry channel.
 * Sources (first wins per slug):
 *   1. docs/editorial/{slug}.md
 *   2. packages/**\/docs/{slug}.md
 */
async function emitEditorialDocs(root, outDir) {
  const destDir = path.join(outDir, 'docs');
  await fs.mkdir(destDir, { recursive: true });

  /** @type {Map<string, string>} slug → abs path */
  const found = new Map();

  const editorialRoot = path.join(root, 'docs', 'editorial');
  try {
    for (const f of await fs.readdir(editorialRoot)) {
      if (!f.endsWith('.md')) continue;
      found.set(f.replace(/\.md$/, ''), path.join(editorialRoot, f));
    }
  } catch {
    // optional directory
  }

  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name === '.git') continue;
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'docs') {
          for (const f of await fs.readdir(p)) {
            if (!f.endsWith('.md')) continue;
            const slug = f.replace(/\.md$/, '');
            if (!found.has(slug)) found.set(slug, path.join(p, f));
          }
        } else {
          await walk(p);
        }
      }
    }
  }
  await walk(path.join(root, 'packages'));

  let n = 0;
  for (const [slug, src] of found) {
    const safe = slug.replace(/\//g, '--');
    const body = await fs.readFile(src, 'utf8');
    await fs.writeFile(path.join(destDir, `${safe}.md`), body, 'utf8');
    n++;
  }
  return n;
}

main();
