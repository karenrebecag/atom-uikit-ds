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

const ROOT = new URL('..', import.meta.url).pathname;
const REGISTRY_PATH = path.join(ROOT, 'registry.json');
const OUT_DIR = path.join(ROOT, 'public', 'r');
const SCHEMA_URL = 'https://ui.shadcn.com/schema/registry-item.json';

// Internal kind → shadcn type mapping
const KIND_TO_TYPE = {
  component: 'registry:component',
  foundation: 'registry:file',
  hook: 'registry:file',
};

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

  let built = 0;
  let enriched = 0;
  let errors = 0;

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

  console.log(`\n  Registry built: ${built} items (${enriched} enriched), ${errors} errors`);
  console.log(`  Output: ${OUT_DIR}/\n`);

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

main();
