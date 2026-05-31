/**
 * registry-schema.examples.ts
 *
 * Concrete examples of the atom field in action.
 * These are NOT runtime code — they serve as reference for:
 *   - extract-component-metadata.ts (DS build, produces this shape)
 *   - registry-client.ts (MCP, consumes this shape)
 *   - validation tests (assert output matches these structures)
 *
 * DO NOT import in production code.
 */

import type {
  AtomField,
  AtomEnrichedRegistryItem,
  EnrichedIndexEntry,
} from './registry-schema';

// ---------------------------------------------------------------------------
// EXAMPLE 1: button.json with atom field injected
// ---------------------------------------------------------------------------

export const EXAMPLE_BUTTON_JSON: AtomEnrichedRegistryItem = {
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: 'button',
  type: 'registry:component',
  title: 'Button',
  description: '6 variantes, 5 tamanos, text-swap animation',
  registryDependencies: ['tokens', 'foundation'],
  files: [
    {
      path: 'components/atoms/Button.tsx',
      type: 'registry:component',
      content: '/* ... source embebido ... */',
    },
    {
      path: 'styles/components/button.css',
      type: 'registry:file',
      content: '/* ... source embebido ... */',
    },
  ],
  atom: {
    discovery: {
      name: 'Button',
      description: '6 variantes, 5 tamanos, text-swap animation',
      category: 'actions',
      variants: [
        'primary',
        'secondary',
        'tertiary',
        'destructive-primary',
        'destructive-secondary',
        'destructive-tertiary',
      ],
      sizes: ['xs', 's', 'm', 'l', 'xl'],
      defaultVariant: 'primary',
      defaultSize: 'm',
      hasAnimation: true,
      props: [
        { name: 'variant', type: 'ButtonVariant', required: false, default: 'primary' },
        { name: 'size', type: 'ButtonSize', required: false, default: 'm' },
        { name: 'loading', type: 'boolean', required: false, default: 'false' },
        { name: 'disabled', type: 'boolean', required: false, default: 'false' },
        { name: 'iconLeft', type: 'ReactNode', required: false },
        { name: 'iconRight', type: 'ReactNode', required: false },
        { name: 'children', type: 'ReactNode', required: true },
      ],
    },
    implementation: {
      baseClass: 'btn',
      cssClasses: [
        'btn',
        'btn--primary',
        'btn--secondary',
        'btn--tertiary',
        'btn--destructive-primary',
        'btn--destructive-secondary',
        'btn--destructive-tertiary',
        'btn--xs',
        'btn--s',
        'btn--m',
        'btn--l',
        'btn--xl',
        'btn--loading',
        'btn--disabled',
        'btn__icon',
        'btn__label',
      ],
      peerDeps: [],
      hasCss: true,
      hasReact: true,
    },
  },
};

// ---------------------------------------------------------------------------
// EXAMPLE 2: Enriched index.json (MCP bootstrap payload)
// ---------------------------------------------------------------------------

export const EXAMPLE_ENRICHED_INDEX: EnrichedIndexEntry[] = [
  {
    slug: 'button',
    discovery: {
      name: 'Button',
      description: '6 variantes, 5 tamanos, text-swap animation',
      category: 'actions',
      variants: [
        'primary',
        'secondary',
        'tertiary',
        'destructive-primary',
        'destructive-secondary',
        'destructive-tertiary',
      ],
      sizes: ['xs', 's', 'm', 'l', 'xl'],
      defaultVariant: 'primary',
      defaultSize: 'm',
      hasAnimation: true,
      props: [
        { name: 'variant', type: 'ButtonVariant', required: false, default: 'primary' },
        { name: 'size', type: 'ButtonSize', required: false, default: 'm' },
        { name: 'loading', type: 'boolean', required: false, default: 'false' },
        { name: 'disabled', type: 'boolean', required: false, default: 'false' },
        { name: 'iconLeft', type: 'ReactNode', required: false },
        { name: 'iconRight', type: 'ReactNode', required: false },
        { name: 'children', type: 'ReactNode', required: true },
      ],
    },
  },
  {
    slug: 'input',
    discovery: {
      name: 'Input',
      description: 'Text input with label, helper text, and error states',
      category: 'forms',
      variants: ['default', 'ghost'],
      sizes: ['s', 'm', 'l'],
      defaultVariant: 'default',
      defaultSize: 'm',
      hasAnimation: false,
      props: [
        { name: 'size', type: 'InputSize', required: false, default: 'm' },
        { name: 'variant', type: 'InputVariant', required: false, default: 'default' },
        { name: 'error', type: 'boolean', required: false, default: 'false' },
        { name: 'disabled', type: 'boolean', required: false, default: 'false' },
        { name: 'placeholder', type: 'string', required: false },
      ],
    },
  },
  {
    slug: 'checkbox',
    discovery: {
      name: 'Checkbox',
      description: 'Toggle with checked, unchecked, and indeterminate states',
      category: 'forms',
      variants: ['default'],
      sizes: ['s', 'm'],
      defaultVariant: 'default',
      defaultSize: 'm',
      hasAnimation: true,
      props: [
        { name: 'checked', type: 'boolean | "indeterminate"', required: false },
        { name: 'disabled', type: 'boolean', required: false, default: 'false' },
        { name: 'onChange', type: '(checked: boolean) => void', required: false },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// EXAMPLE 3: Isolated atom field (for reference by extract script)
// ---------------------------------------------------------------------------

export const EXAMPLE_ATOM_FIELD: AtomField = EXAMPLE_BUTTON_JSON.atom;
