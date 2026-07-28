#!/usr/bin/env node
/**
 * CI gate for dist/embed.css.
 *
 * The build already fails on unscoped selectors, but this runs standalone so
 * CI can assert the shipped artifact independently of who built it. The visual
 * regression baselines only cover the light-DOM artifacts, so without this gate
 * a scoping regression would ship a stylesheet that restyles every host page.
 *
 * Usage: node scripts/validate-embed-scope.mjs [path/to/embed.css]
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { findUnscopedSelectors, SCOPE_CLASS } from './scope-embed.mjs';

const target = resolve(
  process.argv[2] ?? resolve(import.meta.dirname, '../dist/embed.css')
);

if (!existsSync(target)) {
  console.error(`Missing ${target}`);
  console.error('Run: pnpm --filter @atom-uikit/css build');
  process.exit(1);
}

const css = readFileSync(target, 'utf8');
let failed = 0;

const offenders = findUnscopedSelectors(css);
if (offenders.length > 0) {
  console.error(`FAIL  ${offenders.length} selector(s) not scoped to .${SCOPE_CLASS}:`);
  for (const s of offenders.slice(0, 20)) console.error(`        ${s}`);
  failed++;
} else {
  console.log(`OK    every selector scoped to .${SCOPE_CLASS}`);
}

// @font-face must survive: it registers families without applying them, which
// is why it is the one thing allowed to stay global.
const faces = (css.match(/@font-face/g) ?? []).length;
if (faces === 0) {
  console.error('FAIL  no @font-face survived — embedded text would fall back');
  failed++;
} else {
  console.log(`OK    ${faces} @font-face preserved`);
}

// The scope root must carry the design tokens; without this the whole artifact
// is inert even if every selector looks correctly prefixed.
if (!/\.atom-embed\{[^}]*--color-brand/.test(css)) {
  console.error('FAIL  tokens are not declared on the scope root');
  failed++;
} else {
  console.log('OK    tokens declared on .atom-embed');
}

process.exit(failed > 0 ? 1 : 0);
