/**
 * build-registry.mjs
 *
 * Reads registry.json (internal AtomRegistryItem schema),
 * resolves source files, embeds content, and writes
 * shadcn-compatible per-item JSONs to public/r/.
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

async function main() {
  const registry = JSON.parse(await fs.readFile(REGISTRY_PATH, 'utf8'));
  await fs.mkdir(OUT_DIR, { recursive: true });

  let built = 0;
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

      const outPath = path.join(OUT_DIR, `${item.name}.json`);
      await fs.writeFile(outPath, JSON.stringify(output, null, 2), 'utf8');
      built++;
    } catch (err) {
      console.error(`  [ERROR] ${item.name}: ${err.message}`);
      errors++;
    }
  }

  // Generate index (no content, just metadata for "list" command)
  const index = registry.items.map(
    ({ name, kind, framework, installGroup, title, description, registryDependencies }) => ({
      name,
      kind,
      framework,
      installGroup,
      title,
      description,
      ...(registryDependencies?.length && { registryDependencies }),
    })
  );

  await fs.writeFile(
    path.join(OUT_DIR, 'index.json'),
    JSON.stringify(index, null, 2),
    'utf8'
  );

  console.log(`\n  Registry built: ${built} items, ${errors} errors`);
  console.log(`  Output: ${OUT_DIR}/\n`);

  if (errors > 0) process.exit(1);
}

main();
