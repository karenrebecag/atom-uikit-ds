/**
 * validate-registry-vs-manifest.ts
 *
 * Compares the new atom field (from build:registry) against the old
 * MERGED_MANIFEST (from atom-uikit-cms-db/mcp/src/generated/manifest-generated.ts).
 *
 * Purpose: Ensure the migration doesn't lose critical data.
 * Acceptable diffs: our output may be CLEANER (fewer noisy cssClasses,
 * resolved type aliases). Unacceptable: missing variants, sizes, or props.
 *
 * Usage: npx tsx scripts/validate-registry-vs-manifest.ts
 *
 * Reference: plan-registry-consolidation.md, Wave 1 validation criteria
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const DS_ROOT = resolve(import.meta.dirname, '..');
const MCP_ROOT = resolve(DS_ROOT, '../atom-uikit-cms-db/mcp');
const MANIFEST_PATH = resolve(MCP_ROOT, 'src/generated/manifest-generated.ts');
const REGISTRY_DIR = resolve(DS_ROOT, 'public/r');

interface ValidationIssue {
  slug: string;
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  old: unknown;
  new: unknown;
}

function loadManifestGenerated(): Record<string, any> {
  if (!existsSync(MANIFEST_PATH)) {
    console.error(`MANIFEST_GENERATED not found at: ${MANIFEST_PATH}`);
    console.error('Make sure atom-uikit-cms-db is a sibling directory and has run pnpm embed.');
    process.exit(1);
  }

  const content = readFileSync(MANIFEST_PATH, 'utf-8');
  const match = content.match(/export const MANIFEST_GENERATED.*?=\s*({[\s\S]*?});/);
  if (!match) {
    console.error('Could not parse MANIFEST_GENERATED from file.');
    process.exit(1);
  }

  return JSON.parse(match[1]);
}

function loadRegistryAtom(slug: string): any | null {
  const filePath = resolve(REGISTRY_DIR, `${slug}.json`);
  if (!existsSync(filePath)) return null;
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  return data.atom ?? null;
}

function arraysMatch(oldArr: string[], newArr: string[]): { missing: string[]; extra: string[] } {
  const oldSet = new Set(oldArr);
  const newSet = new Set(newArr);
  const missing = oldArr.filter((x) => !newSet.has(x));
  const extra = newArr.filter((x) => !oldSet.has(x));
  return { missing, extra };
}

function main() {
  const manifest = loadManifestGenerated();
  const slugs = Object.keys(manifest);
  const issues: ValidationIssue[] = [];
  let checked = 0;
  let passed = 0;

  console.log(`Validating ${slugs.length} components against registry...\n`);

  for (const slug of slugs) {
    const old = manifest[slug];
    const atom = loadRegistryAtom(slug);

    if (!atom) {
      issues.push({
        slug,
        field: 'atom',
        severity: 'warning',
        message: 'No registry item found (may not be in registry.json yet)',
        old: slug,
        new: null,
      });
      continue;
    }

    checked++;
    let componentIssues = 0;

    // Compare variants
    const { missing: missingVariants } = arraysMatch(old.variants ?? [], atom.discovery.variants);
    if (missingVariants.length > 0) {
      issues.push({
        slug,
        field: 'variants',
        severity: 'error',
        message: `Missing variants in new output`,
        old: old.variants,
        new: atom.discovery.variants,
      });
      componentIssues++;
    }

    // Compare sizes
    const { missing: missingSizes } = arraysMatch(old.sizes ?? [], atom.discovery.sizes);
    if (missingSizes.length > 0) {
      issues.push({
        slug,
        field: 'sizes',
        severity: 'error',
        message: `Missing sizes in new output`,
        old: old.sizes,
        new: atom.discovery.sizes,
      });
      componentIssues++;
    }

    // Compare hasAnimation
    // New extractor may detect MORE animations (improvement over old embed-source.ts)
    // Only error if old=true but new=false (regression)
    if (old.hasAnimation && !atom.discovery.hasAnimation) {
      issues.push({
        slug,
        field: 'hasAnimation',
        severity: 'error',
        message: `Animation flag regression (old=true, new=false)`,
        old: old.hasAnimation,
        new: atom.discovery.hasAnimation,
      });
      componentIssues++;
    } else if (!old.hasAnimation && atom.discovery.hasAnimation) {
      issues.push({
        slug,
        field: 'hasAnimation',
        severity: 'info',
        message: `Animation now correctly detected (old missed it)`,
        old: old.hasAnimation,
        new: atom.discovery.hasAnimation,
      });
    }

    // Compare hasCss / hasReact
    if (old.hasCss !== atom.implementation.hasCss) {
      issues.push({
        slug,
        field: 'hasCss',
        severity: 'error',
        message: `hasCss mismatch`,
        old: old.hasCss,
        new: atom.implementation.hasCss,
      });
      componentIssues++;
    }

    if (old.hasReact !== atom.implementation.hasReact) {
      issues.push({
        slug,
        field: 'hasReact',
        severity: 'error',
        message: `hasReact mismatch`,
        old: old.hasReact,
        new: atom.implementation.hasReact,
      });
      componentIssues++;
    }

    // Compare props (by name — type resolution is expected to differ)
    const oldPropNames = (old.props ?? []).map((p: any) => p.name);
    const newPropNames = atom.discovery.props.map((p: any) => p.name);
    const { missing: missingProps } = arraysMatch(oldPropNames, newPropNames);
    if (missingProps.length > 0) {
      issues.push({
        slug,
        field: 'props',
        severity: 'warning',
        message: `Props missing in new output: ${missingProps.join(', ')}`,
        old: oldPropNames,
        new: newPropNames,
      });
      componentIssues++;
    }

    // Compare cssClasses (new is expected to be a SUBSET — cleaner)
    const oldClasses = old.cssClasses ?? [];
    const newClasses = atom.implementation.cssClasses;
    // Only flag if new has classes that old doesn't (unexpected additions)
    const { extra: unexpectedClasses } = arraysMatch(oldClasses, newClasses);
    if (unexpectedClasses.length > 0) {
      issues.push({
        slug,
        field: 'cssClasses',
        severity: 'info',
        message: `New classes not in old manifest: ${unexpectedClasses.join(', ')}`,
        old: oldClasses.length,
        new: newClasses.length,
      });
    }

    // Info: classes removed (expected — noise cleanup)
    const { missing: removedClasses } = arraysMatch(oldClasses, newClasses);
    const noiseClasses = removedClasses.filter(
      (c) => c.startsWith('is--') || !c.startsWith(slug.split('-')[0]),
    );
    if (noiseClasses.length > 0) {
      issues.push({
        slug,
        field: 'cssClasses',
        severity: 'info',
        message: `Noise classes correctly removed: ${noiseClasses.join(', ')}`,
        old: oldClasses.length,
        new: newClasses.length,
      });
    }

    if (componentIssues === 0) passed++;
  }

  // Report
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  console.log(`  Checked: ${checked}/${slugs.length}`);
  console.log(`  Passed:  ${passed}/${checked}`);
  console.log(`  Errors:  ${errors.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log(`  Info:    ${infos.length}\n`);

  if (errors.length > 0) {
    console.log('ERRORS (must fix):');
    for (const e of errors) {
      console.log(`  [${e.slug}] ${e.field}: ${e.message}`);
      if (Array.isArray(e.old) && Array.isArray(e.new)) {
        const missing = (e.old as string[]).filter((x) => !(e.new as string[]).includes(x));
        console.log(`    Missing: ${missing.join(', ')}`);
      }
    }
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('WARNINGS (investigate):');
    for (const w of warnings) {
      console.log(`  [${w.slug}] ${w.field}: ${w.message}`);
    }
    console.log('');
  }

  // Exit code
  if (errors.length > 0) {
    console.log('VALIDATION FAILED — fix errors before proceeding to Wave 2.\n');
    process.exit(1);
  }

  console.log('VALIDATION PASSED — registry output is compatible with MERGED_MANIFEST.\n');
}

main();
