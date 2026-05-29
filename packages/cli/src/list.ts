import { fetchIndex } from './registry.js';

export async function list(): Promise<void> {
  const items = await fetchIndex();

  const foundations = items.filter((i) => i.kind === 'foundation');
  const components = items.filter((i) => i.kind === 'component');

  if (foundations.length) {
    console.log('\n  Foundations\n');
    for (const item of foundations) {
      console.log(`    ${item.name.padEnd(20)} ${item.description}`);
    }
  }

  if (components.length) {
    console.log('\n  Components\n');
    for (const item of components) {
      const deps = item.registryDependencies?.length
        ? ` (needs: ${item.registryDependencies.join(', ')})`
        : '';
      console.log(`    ${item.name.padEnd(20)} ${item.title}${deps}`);
    }
  }

  console.log(`\n  ${items.length} items available\n`);
}
