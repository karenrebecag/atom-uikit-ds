#!/usr/bin/env node
/**
 * Assemble the public /v1/ channel from package build outputs.
 * Major version is a folder name — never break /v1/ in place with renames.
 */
import { cpSync, mkdirSync, rmSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MAJOR = 'v1';
const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(import.meta.dirname, 'out', MAJOR);

const cssDist = resolve(ROOT, 'packages/css/dist');
const tokensJson = resolve(ROOT, 'packages/tokens/build/json');
const fontsSrc = resolve(ROOT, 'packages/css/src/fonts');
const fontsDist = resolve(cssDist, 'fonts');

function requireFile(path, hint) {
  if (!existsSync(path)) {
    console.error(`Missing ${path}`);
    console.error(hint);
    process.exit(1);
  }
}

requireFile(join(cssDist, 'tokens.css'), 'Run: pnpm --filter @atom-uikit/css build');
requireFile(join(cssDist, 'foundation.css'), 'Run: pnpm --filter @atom-uikit/css build');
requireFile(join(cssDist, 'atom.css'), 'Run: pnpm --filter @atom-uikit/css build');
requireFile(join(tokensJson, 'tokens.json'), 'Run: pnpm --filter @atom-uikit/tokens build');
requireFile(join(tokensJson, 'tokens-nested.json'), 'Run: pnpm --filter @atom-uikit/tokens build');

rmSync(resolve(import.meta.dirname, 'out'), { recursive: true, force: true });
mkdirSync(join(OUT, 'fonts'), { recursive: true });

cpSync(join(cssDist, 'tokens.css'), join(OUT, 'tokens.css'));
cpSync(join(cssDist, 'foundation.css'), join(OUT, 'foundation.css'));
cpSync(join(cssDist, 'atom.css'), join(OUT, 'atom.css'));
cpSync(join(tokensJson, 'tokens.json'), join(OUT, 'tokens.json'));
cpSync(join(tokensJson, 'tokens-nested.json'), join(OUT, 'tokens-nested.json'));

// Prefer hashed dist fonts (what foundation.css urls reference); fallback to src tree
if (existsSync(fontsDist)) {
  for (const f of readdirSync(fontsDist)) {
    if (f.endsWith('.woff2')) {
      cpSync(join(fontsDist, f), join(OUT, 'fonts', f));
    }
  }
} else {
  // Flatten src/fonts/**/*.woff2
  const walk = (dir) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name.endsWith('.woff2')) cpSync(p, join(OUT, 'fonts', ent.name));
    }
  };
  walk(fontsSrc);
}

// Manifest for operators (not a secret)
writeFileSync(
  join(OUT, 'manifest.json'),
  JSON.stringify(
    {
      major: MAJOR,
      generatedAt: new Date().toISOString(),
      files: readdirSync(OUT).filter((f) => f !== 'fonts'),
      fonts: readdirSync(join(OUT, 'fonts')),
    },
    null,
    2
  )
);

console.log(`public-dist: wrote out/${MAJOR}/ (${readdirSync(join(OUT, 'fonts')).length} fonts)`);
