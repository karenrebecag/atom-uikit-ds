import { DEFAULT_CONFIG, writeConfig, findConfigPath } from './config.js';
import { add } from './add.js';

export async function init(): Promise<void> {
  if (findConfigPath()) {
    console.log('  atom-uikit.json already exists. Skipping.\n');
    return;
  }

  writeConfig(DEFAULT_CONFIG);
  console.log('  Created atom-uikit.json\n');

  // Install foundations
  console.log('  Installing foundations...\n');
  await add('tokens');
  await add('tokens-dark');
  await add('foundation');

  console.log('  Ready. Run: npx atom-uikit add button\n');
}
