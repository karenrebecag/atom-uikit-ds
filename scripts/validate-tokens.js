#!/usr/bin/env node

/**
 * Pre-build token validator.
 * Ensures all token files follow W3C DTCG format and layer rules:
 * - Primitives: only literal values
 * - Semantic: only references to primitives
 * - Components: only references to semantic tokens
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const TOKENS_DIR = join(import.meta.dirname, '..', 'packages', 'tokens', 'src');

let errors = 0;

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (entry.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

function isReference(value) {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

function validateToken(path, obj, layer) {
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if ('$value' in val) {
        const ref = isReference(val.$value);
        if (layer === 'primitives' && ref) {
          console.error(`  ERROR: ${path} > ${key}: primitives must use literal values, not references`);
          errors++;
        }
        if (layer === 'semantic' && !ref) {
          console.error(`  ERROR: ${path} > ${key}: semantic tokens must reference primitives, not literals`);
          errors++;
        }
        if (layer === 'components' && !ref) {
          console.error(`  ERROR: ${path} > ${key}: component tokens must reference semantic tokens, not literals`);
          errors++;
        }
      } else {
        validateToken(`${path} > ${key}`, val, layer);
      }
    }
  }
}

console.log('Validating tokens...\n');

for (const layer of ['primitives', 'semantic', 'components']) {
  const dir = join(TOKENS_DIR, layer);
  try {
    const files = walk(dir);
    if (files.length === 0) {
      console.log(`  ${layer}/: (empty — skipping)`);
      continue;
    }
    for (const file of files) {
      const rel = relative(TOKENS_DIR, file);
      try {
        const content = JSON.parse(readFileSync(file, 'utf-8'));
        validateToken(rel, content, layer);
        console.log(`  ${rel}: OK`);
      } catch (e) {
        console.error(`  ERROR: ${rel}: Invalid JSON — ${e.message}`);
        errors++;
      }
    }
  } catch {
    console.log(`  ${layer}/: (not found — skipping)`);
  }
}

console.log(`\n${errors === 0 ? 'All tokens valid.' : `${errors} error(s) found.`}`);
process.exit(errors > 0 ? 1 : 0);
