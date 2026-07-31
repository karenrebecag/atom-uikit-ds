/**
 * F5 generator tests. Run: node --test scripts/emit-shadcn-registry.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  mapCanonicalToShadcn,
  validateShadcnItem,
} from './emit-shadcn-registry.mjs';

const buttonCanonical = {
  name: 'button',
  title: 'Button',
  description: 'Press and the label swaps.',
  registryDependencies: ['tokens', 'foundation', 'icon-button'],
  dependencies: [],
  files: [
    {
      path: 'components/atoms/Button.tsx',
      type: 'registry:component',
      content: 'export function Button() { return null }',
    },
    {
      path: 'styles/components/button.css',
      type: 'registry:file',
      content: '.button {}',
    },
  ],
  atom: {
    discovery: { category: 'actions' },
    implementation: { peerDeps: ['gsap'] },
  },
  meta: {
    agent: {
      configurables: [{ prop: 'variant', type: 'select', default: 'primary', what: 'w', how: 'h' }],
      gotchas: [],
      usage: '<Button />',
    },
  },
};

describe('validateShadcnItem', () => {
  it('accepts a minimal valid item', () => {
    const errs = validateShadcnItem({
      name: 'x',
      type: 'registry:component',
      files: [{ path: 'a.tsx', type: 'registry:component', content: 'x' }],
    });
    assert.deepEqual(errs, []);
  });

  it('requires target on registry:file', () => {
    const errs = validateShadcnItem({
      name: 'x',
      type: 'registry:component',
      files: [{ path: 'a.css', type: 'registry:file', content: 'x' }],
    });
    assert.ok(errs.some((e) => e.includes('target')));
  });
});

describe('mapCanonicalToShadcn', () => {
  it('maps button with gsap, CSS target, meta.agent intact', () => {
    const emitted = new Set(['button', 'icon-button']);
    const r = mapCanonicalToShadcn(buttonCanonical, { name: 'button', kind: 'component' }, emitted);
    assert.equal(r.ok, true);
    assert.equal(r.item.type, 'registry:component');
    assert.deepEqual(r.item.dependencies, ['gsap']);
    // tokens/foundation not on shadcn channel → dropped; icon-button kept
    assert.deepEqual(r.item.registryDependencies, ['icon-button']);
    const css = r.item.files.find((f) => f.path.endsWith('.css'));
    assert.equal(css.type, 'registry:file');
    assert.equal(css.target, 'styles/atom-uikit/button.css');
    assert.deepEqual(r.item.meta.agent, buttonCanonical.meta.agent);
    assert.equal(r.item.files.find((f) => f.path.endsWith('.tsx')).content, 'export function Button() { return null }');
  });

  it('excludes foundation with reason', () => {
    const r = mapCanonicalToShadcn({}, { name: 'tokens', kind: 'foundation' }, new Set());
    assert.equal(r.ok, false);
    assert.match(r.reason, /foundation/);
  });

  it('excludes layout with reason', () => {
    const r = mapCanonicalToShadcn({}, { name: 'layout/hero', kind: 'layout' }, new Set());
    assert.equal(r.ok, false);
    assert.match(r.reason, /layout/);
  });

  it('F5-C5 meta.agent deep-equal passthrough', () => {
    const agent = buttonCanonical.meta.agent;
    const r = mapCanonicalToShadcn(buttonCanonical, { name: 'button', kind: 'component' }, new Set(['button']));
    assert.deepEqual(r.item.meta.agent, agent);
  });
});
