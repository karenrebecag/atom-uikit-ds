import fs from 'node:fs';
import path from 'node:path';
import { readConfig } from './config.js';
import { fetchItem, fetchIndex, type RegistryItem } from './registry.js';

const installed = new Set<string>();

export async function add(name: string): Promise<void> {
  if (installed.has(name)) return;
  installed.add(name);

  const config = readConfig();
  if (!config) {
    throw new Error('No atom-uikit.json found. Run: npx atom-uikit init');
  }

  const item = await fetchItem(name);

  // Resolve registry dependencies first
  if (item.registryDependencies?.length) {
    for (const dep of item.registryDependencies) {
      await add(dep);
    }
  }

  // Write files
  for (const file of item.files) {
    const targetPath = resolvePath(file.path, config.aliases);
    const absPath = path.resolve(process.cwd(), targetPath);

    // Skip if already exists
    if (fs.existsSync(absPath)) {
      console.log(`  skip  ${targetPath} (exists)`);
      continue;
    }

    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, file.content, 'utf8');
    console.log(`  add   ${targetPath}`);
  }
}

export async function addAll(): Promise<void> {
  const index = await fetchIndex();
  for (const item of index) {
    await add(item.name);
  }
}

function resolvePath(
  filePath: string,
  aliases: { components: string; styles: string; foundations: string },
): string {
  // Map output paths to aliased paths
  if (filePath.startsWith('components/')) {
    return path.join(aliases.components, filePath.replace('components/', ''));
  }
  if (filePath.startsWith('styles/foundations/')) {
    return path.join(aliases.foundations, filePath.replace('styles/foundations/', ''));
  }
  if (filePath.startsWith('styles/')) {
    return path.join(aliases.styles, filePath.replace('styles/', ''));
  }
  return filePath;
}
