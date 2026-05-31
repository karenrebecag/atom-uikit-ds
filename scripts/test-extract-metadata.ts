/**
 * test-extract-metadata.ts
 *
 * Unit tests for extract-component-metadata.ts
 * Uses Node assert (no external deps). Run: npx tsx scripts/test-extract-metadata.ts
 *
 * Tests each extraction function against known fixtures to catch regressions.
 */

import { strict as assert } from 'node:assert';
import { resolve } from 'node:path';
import { extractMetadataForItem } from './extract-component-metadata';
import type { AtomRegistryItem } from './registry-schema';

const DS_ROOT = resolve(import.meta.dirname, '..');
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (err) {
    failed++;
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  FAIL  ${name}`);
    console.log(`        ${msg}`);
  }
}

// --- Fixtures ---

const BUTTON_ITEM: AtomRegistryItem = {
  name: 'button',
  kind: 'component',
  framework: 'react',
  installGroup: 'components',
  title: 'Button',
  description: '6 variantes, 5 tamanos, text-swap animation',
  registryDependencies: ['tokens', 'foundation'],
  files: [
    { sourcePath: 'packages/components-react/src/atoms/Button.tsx', outputPath: 'components/atoms/Button.tsx', type: 'registry:component' },
    { sourcePath: 'packages/css/src/components/buttons/button.css', outputPath: 'styles/components/button.css', type: 'registry:file' },
  ],
};

const INPUT_ITEM: AtomRegistryItem = {
  name: 'input',
  kind: 'component',
  framework: 'react',
  installGroup: 'components',
  title: 'Input',
  description: 'Text input with label, helper text, and error states',
  files: [
    { sourcePath: 'packages/components-react/src/atoms/Input.tsx', outputPath: 'components/atoms/Input.tsx', type: 'registry:component' },
    { sourcePath: 'packages/css/src/components/forms/input.css', outputPath: 'styles/components/input.css', type: 'registry:file' },
  ],
};

const TABS_ITEM: AtomRegistryItem = {
  name: 'tabs',
  kind: 'component',
  framework: 'react',
  installGroup: 'components',
  title: 'Tabs',
  description: 'Tabbed navigation with animated indicator',
  files: [
    { sourcePath: 'packages/components-react/src/atoms/Tabs.tsx', outputPath: 'components/atoms/Tabs.tsx', type: 'registry:component' },
    { sourcePath: 'packages/css/src/components/navigation/tabs.css', outputPath: 'styles/components/tabs.css', type: 'registry:file' },
  ],
};

const TOKENS_ITEM: AtomRegistryItem = {
  name: 'tokens',
  kind: 'foundation',
  framework: 'css',
  installGroup: 'foundations',
  title: 'Design Tokens',
  description: '3-layer tokens',
  files: [
    { sourcePath: 'packages/tokens/build/css/tokens.css', outputPath: 'styles/foundations/tokens.css', type: 'registry:file' },
  ],
};

// --- Tests ---

console.log('\n=== Extract Component Metadata Tests ===\n');

// Button tests
console.log('Button:');

test('button: extracts 6 variants', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.ok(result, 'Should produce AtomField');
  assert.deepStrictEqual(result.discovery.variants, [
    'primary', 'secondary', 'tertiary',
    'destructive-primary', 'destructive-secondary', 'destructive-tertiary',
  ]);
});

test('button: extracts 5 sizes', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.deepStrictEqual(result.discovery.sizes, ['xs', 's', 'm', 'l', 'xl']);
});

test('button: default variant is primary', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.defaultVariant, 'primary');
});

test('button: default size is m', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.defaultSize, 'm');
});

test('button: hasAnimation is true', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.hasAnimation, true);
});

test('button: peerDeps includes gsap', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.ok(result.implementation.peerDeps.includes('gsap'));
});

test('button: baseClass is "button"', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.strictEqual(result.implementation.baseClass, 'button');
});

test('button: cssClasses contain only button-prefixed classes', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  for (const cls of result.implementation.cssClasses) {
    assert.ok(
      cls.startsWith('button'),
      `Class "${cls}" doesn't start with "button"`,
    );
  }
});

test('button: cssClasses include modifiers and elements', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.ok(result.implementation.cssClasses.includes('button--primary'));
  assert.ok(result.implementation.cssClasses.includes('button__label'));
  assert.ok(result.implementation.cssClasses.includes('button--xl'));
});

test('button: no noise classes (is--, link-button, toggle-group)', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  const noise = result.implementation.cssClasses.filter(
    (c) => c.startsWith('is--') || c.includes('link-button') || c.includes('toggle-group'),
  );
  assert.deepStrictEqual(noise, [], `Noise classes found: ${noise.join(', ')}`);
});

test('button: props resolve type aliases to unions', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  const variantProp = result.discovery.props.find((p) => p.name === 'variant');
  assert.ok(variantProp, 'variant prop should exist');
  assert.ok(variantProp!.type.includes("'primary'"), `Type should contain 'primary', got: ${variantProp!.type}`);
  assert.ok(!variantProp!.type.includes('ButtonVariant'), 'Type should be resolved, not alias');
});

test('button: props include children as required', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  const children = result.discovery.props.find((p) => p.name === 'children');
  assert.ok(children, 'children prop should exist');
  assert.strictEqual(children!.required, true);
});

test('button: category is "actions"', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.category, 'actions');
});

// Input tests
console.log('\nInput:');

test('input: category is "forms"', () => {
  const result = extractMetadataForItem(INPUT_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.category, 'forms');
});

test('input: baseClass starts with "input"', () => {
  const result = extractMetadataForItem(INPUT_ITEM, DS_ROOT)!;
  assert.ok(
    result.implementation.baseClass.startsWith('input'),
    `Expected baseClass starting with "input", got "${result.implementation.baseClass}"`,
  );
});

test('input: hasCss and hasReact are true', () => {
  const result = extractMetadataForItem(INPUT_ITEM, DS_ROOT)!;
  assert.strictEqual(result.implementation.hasCss, true);
  assert.strictEqual(result.implementation.hasReact, true);
});

test('input: hasAnimation is false', () => {
  const result = extractMetadataForItem(INPUT_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.hasAnimation, false);
});

// Tabs tests
console.log('\nTabs:');

test('tabs: category is "navigation"', () => {
  const result = extractMetadataForItem(TABS_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.category, 'navigation');
});

test('tabs: has variants', () => {
  const result = extractMetadataForItem(TABS_ITEM, DS_ROOT)!;
  assert.ok(result.discovery.variants.length > 0, 'Tabs should have variants');
});

test('tabs: baseClass is "tabs"', () => {
  const result = extractMetadataForItem(TABS_ITEM, DS_ROOT)!;
  assert.strictEqual(result.implementation.baseClass, 'tabs');
});

// Foundation tests
console.log('\nFoundation:');

test('tokens: category is "foundation"', () => {
  const result = extractMetadataForItem(TOKENS_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.category, 'foundation');
});

test('tokens: variants and sizes are empty', () => {
  const result = extractMetadataForItem(TOKENS_ITEM, DS_ROOT)!;
  assert.deepStrictEqual(result.discovery.variants, []);
  assert.deepStrictEqual(result.discovery.sizes, []);
});

test('tokens: hasCss is true, hasReact is false', () => {
  const result = extractMetadataForItem(TOKENS_ITEM, DS_ROOT)!;
  assert.strictEqual(result.implementation.hasCss, true);
  assert.strictEqual(result.implementation.hasReact, false);
});

// cssClassPrefixes tests
console.log('\ncssClassPrefixes:');

const INPUT_WITH_PREFIXES: AtomRegistryItem = {
  ...INPUT_ITEM,
  cssClassPrefixes: ['input', 'input-group'],
};

test('input with cssClassPrefixes: captures input-group classes', () => {
  const result = extractMetadataForItem(INPUT_WITH_PREFIXES, DS_ROOT)!;
  assert.ok(
    result.implementation.cssClasses.includes('input-group'),
    'Should include input-group',
  );
  assert.ok(
    result.implementation.cssClasses.includes('input-group__icon'),
    'Should include input-group__icon',
  );
  assert.ok(
    result.implementation.cssClasses.includes('input-group--error'),
    'Should include input-group--error',
  );
});

test('input with cssClassPrefixes: baseClass is still "input" (slug priority)', () => {
  const result = extractMetadataForItem(INPUT_WITH_PREFIXES, DS_ROOT)!;
  assert.strictEqual(result.implementation.baseClass, 'input');
});

test('input with cssClassPrefixes: same result as auto-discovery (slug is prefix)', () => {
  // When slug is already a prefix of the compound block name,
  // auto-discovery produces the same result as explicit prefixes.
  // cssClassPrefixes is mainly for cases where blocks DON'T share a prefix with slug.
  const withPrefixes = extractMetadataForItem(INPUT_WITH_PREFIXES, DS_ROOT)!;
  const without = extractMetadataForItem(INPUT_ITEM, DS_ROOT)!;
  assert.strictEqual(
    withPrefixes.implementation.cssClasses.length,
    without.implementation.cssClasses.length,
    'Auto-discovery captures same classes when slug is prefix',
  );
});

test('input without cssClassPrefixes: auto-discovers both blocks', () => {
  // Without explicit prefixes, auto-discovery should still find input-group
  // because it starts with the slug "input"
  const result = extractMetadataForItem(INPUT_ITEM, DS_ROOT)!;
  assert.ok(
    result.implementation.cssClasses.includes('input-group'),
    'Auto-discovery should find input-group (starts with slug)',
  );
});

// --- Wave 4 Phase 1 fixtures ---

const ICON_BUTTON_ITEM: AtomRegistryItem = {
  name: 'icon-button',
  kind: 'component',
  framework: 'react',
  installGroup: 'components',
  title: 'IconButton',
  description: 'Icon-only button with required aria-label',
  files: [
    { sourcePath: 'packages/components-react/src/atoms/IconButton.tsx', outputPath: 'components/atoms/IconButton.tsx', type: 'registry:component' },
    { sourcePath: 'packages/css/src/components/buttons/icon-button.css', outputPath: 'styles/components/icon-button.css', type: 'registry:file' },
  ],
};

const TAG_ITEM: AtomRegistryItem = {
  name: 'tag',
  kind: 'component',
  framework: 'react',
  installGroup: 'components',
  title: 'Tag',
  description: 'Status label with string children',
  files: [
    { sourcePath: 'packages/components-react/src/atoms/Tag.tsx', outputPath: 'components/atoms/Tag.tsx', type: 'registry:component' },
    { sourcePath: 'packages/css/src/components/indicators/tag.css', outputPath: 'styles/components/tag.css', type: 'registry:file' },
  ],
};

const LINK_BUTTON_ITEM: AtomRegistryItem = {
  name: 'link-button',
  kind: 'component',
  framework: 'react',
  installGroup: 'components',
  title: 'LinkButton',
  description: 'Anchor styled as button with string children',
  files: [
    { sourcePath: 'packages/components-react/src/atoms/LinkButton.tsx', outputPath: 'components/atoms/LinkButton.tsx', type: 'registry:component' },
    { sourcePath: 'packages/css/src/components/buttons/link-button.css', outputPath: 'styles/components/link-button.css', type: 'registry:file' },
  ],
};

const BADGE_ITEM: AtomRegistryItem = {
  name: 'badge',
  kind: 'component',
  framework: 'react',
  installGroup: 'components',
  title: 'Badge',
  description: 'Status indicator with string children',
  files: [
    { sourcePath: 'packages/components-react/src/atoms/Badge.tsx', outputPath: 'components/atoms/Badge.tsx', type: 'registry:component' },
    { sourcePath: 'packages/css/src/components/indicators/badge.css', outputPath: 'styles/components/badge.css', type: 'registry:file' },
  ],
};

// --- Wave 4 Phase 1 tests: ariaRequired ---

console.log('\nWave 4 — ariaRequired:');

test('icon-button: extracts ariaRequired [aria-label]', () => {
  const result = extractMetadataForItem(ICON_BUTTON_ITEM, DS_ROOT)!;
  assert.ok(result, 'icon-button should have metadata');
  assert.deepStrictEqual(result.discovery.ariaRequired, ['aria-label']);
});

test('button: ariaRequired is undefined (no required aria props)', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.ariaRequired, undefined);
});

// --- Wave 4 Phase 1 tests: childrenType ---

console.log('\nWave 4 — childrenType:');

test('tag: childrenType is string', () => {
  const result = extractMetadataForItem(TAG_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.childrenType, 'string');
});

test('link-button: childrenType is string', () => {
  const result = extractMetadataForItem(LINK_BUTTON_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.childrenType, 'string');
});

test('badge: childrenType is string', () => {
  const result = extractMetadataForItem(BADGE_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.childrenType, 'string');
});

test('button: childrenType is undefined (uses ReactNode)', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.childrenType, undefined);
});

// --- Wave 4 Phase 2+3 fixtures ---

const BUTTON_GROUP_ITEM: AtomRegistryItem = {
  name: 'button-group',
  kind: 'component',
  framework: 'react',
  installGroup: 'components',
  title: 'ButtonGroup',
  description: 'Group of buttons with separator',
  composable: ['ButtonGroup', 'ButtonGroupSeparator', 'ButtonGroupText'],
  files: [
    { sourcePath: 'packages/components-react/src/atoms/ButtonGroup.tsx', outputPath: 'components/atoms/ButtonGroup.tsx', type: 'registry:component' },
    { sourcePath: 'packages/css/src/components/buttons/button-group.css', outputPath: 'styles/components/button-group.css', type: 'registry:file' },
  ],
};

const SELECT_ITEM: AtomRegistryItem = {
  name: 'select',
  kind: 'component',
  framework: 'react',
  installGroup: 'components',
  title: 'Select',
  description: 'Select dropdown with trigger, content, items',
  composable: ['Select', 'SelectTrigger', 'SelectContent', 'SelectItem', 'SelectGroup', 'SelectSeparator'],
  files: [
    { sourcePath: 'packages/components-react/src/atoms/Select.tsx', outputPath: 'components/atoms/Select.tsx', type: 'registry:component' },
    { sourcePath: 'packages/css/src/components/forms/select.css', outputPath: 'styles/components/select.css', type: 'registry:file' },
  ],
};

const CHIP_ITEM: AtomRegistryItem = {
  name: 'chip',
  kind: 'component',
  framework: 'react',
  installGroup: 'components',
  title: 'Chip',
  description: 'Chip with type prop (not variant)',
  variantProp: 'type',
  files: [
    { sourcePath: 'packages/components-react/src/atoms/Chip.tsx', outputPath: 'components/atoms/Chip.tsx', type: 'registry:component' },
    { sourcePath: 'packages/css/src/components/indicators/chip.css', outputPath: 'styles/components/chip.css', type: 'registry:file' },
  ],
};

// --- Wave 4 Phase 2 tests: composable ---

console.log('\nWave 4 — composable:');

test('button-group: composable has 3 sub-components', () => {
  const result = extractMetadataForItem(BUTTON_GROUP_ITEM, DS_ROOT)!;
  assert.deepStrictEqual(result.discovery.composable, ['ButtonGroup', 'ButtonGroupSeparator', 'ButtonGroupText']);
});

test('select: composable has 6 sub-components', () => {
  const result = extractMetadataForItem(SELECT_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.composable!.length, 6);
  assert.ok(result.discovery.composable!.includes('SelectTrigger'));
});

test('button: composable is undefined (not composable)', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.composable, undefined);
});

// --- Wave 4 Phase 3 tests: variantProp ---

console.log('\nWave 4 — variantProp:');

test('chip: variantProp is type', () => {
  const result = extractMetadataForItem(CHIP_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.variantProp, 'type');
});

test('button: variantProp is undefined (uses standard variant)', () => {
  const result = extractMetadataForItem(BUTTON_ITEM, DS_ROOT)!;
  assert.strictEqual(result.discovery.variantProp, undefined);
});

// Summary
console.log(`\n${'='.repeat(40)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(40)}\n`);

if (failed > 0) process.exit(1);
