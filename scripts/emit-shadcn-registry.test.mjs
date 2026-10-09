/**
 * F5 generator tests. Run: node --test scripts/emit-shadcn-registry.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  FOUNDATION_NAME,
  buildFoundationItems,
  emitShadcnChannel,
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
    // tokens + foundation collapse into one node, listed before the component deps
    assert.deepEqual(r.item.registryDependencies, [FOUNDATION_NAME, 'icon-button']);
    const css = r.item.files.find((f) => f.path.endsWith('.css'));
    assert.equal(css.type, 'registry:file');
    assert.equal(css.target, 'styles/atom-uikit/button.css');
    assert.deepEqual(r.item.meta.agent, buttonCanonical.meta.agent);
    assert.equal(r.item.files.find((f) => f.path.endsWith('.tsx')).content, 'export function Button() { return null }');
  });

  it('keeps a hook dep and reports an uninstallable one with its reason', () => {
    const canonical = { ...buttonCanonical, registryDependencies: ['tokens', 'x-animation', 'ghost'] };
    const reasons = new Map([['ghost', 'layout — nope']]);
    const r = mapCanonicalToShadcn(canonical, { name: 'button', kind: 'component' }, new Set(['x-animation']), reasons);
    assert.deepEqual(r.item.registryDependencies, [FOUNDATION_NAME, 'x-animation']);
    assert.deepEqual(r.unresolved, [{ dep: 'ghost', reason: 'layout — nope' }]);
    assert.match(r.item.docs, /ghost \(layout — nope\)/);
  });

  it('maps a hook to registry:lib', () => {
    const hook = {
      name: 'accordion-animation',
      files: [{ path: 'animations/accordion.ts', type: 'registry:file', content: 'export {}' }],
      dependencies: ['gsap'],
    };
    const r = mapCanonicalToShadcn(hook, { name: 'accordion-animation', kind: 'hook' }, new Set());
    assert.equal(r.ok, true);
    assert.equal(r.item.type, 'registry:lib');
    assert.equal(r.item.files[0].type, 'registry:lib');
    assert.deepEqual(r.item.dependencies, ['gsap']);
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

describe('foundation nodes and channel emission', () => {
  const FOUNDATION_CSS =
    "@font-face{src:url(./fonts/A-1.woff2)}@font-face{src:url('../fonts/B-2.woff2')}" +
    '[data-theme=dark]{--x:1}';

  async function fixture({ withDist = true } = {}) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'shadcn-emit-'));
    const publicR = path.join(root, 'public', 'r');
    const dist = path.join(root, 'packages', 'css', 'dist');
    await fs.mkdir(publicR, { recursive: true });
    if (withDist) {
      await fs.mkdir(dist, { recursive: true });
      await fs.writeFile(path.join(dist, 'foundation.css'), FOUNDATION_CSS);
      await fs.writeFile(path.join(dist, 'tokens.css'), ':root{--x:1}');
    }
    const write = (name, obj) => fs.writeFile(path.join(publicR, `${name}.json`), JSON.stringify(obj));
    await write('index', [
      { name: 'button', kind: 'component' },
      { name: 'accordion', kind: 'component' },
      { name: 'accordion-animation', kind: 'hook' },
      { name: 'tokens', kind: 'foundation' },
    ]);
    await write('button', buttonCanonical);
    await write('accordion', {
      ...buttonCanonical,
      name: 'accordion',
      registryDependencies: ['tokens', 'foundation', 'accordion-animation'],
    });
    await write('accordion-animation', {
      name: 'accordion-animation',
      files: [{ path: 'animations/accordion.ts', type: 'registry:file', content: 'export {}' }],
    });
    await write('tokens', { name: 'tokens', files: [] });
    return { publicR, dist };
  }

  const quiet = { log: () => {} };

  it('rewrites font urls to the public /v1 channel and keeps dark', async () => {
    const { dist } = await fixture();
    const [foundation] = await buildFoundationItems(dist);
    const css = foundation.files[0].content;
    assert.doesNotMatch(css, /url\(['"]?\.{1,2}\/fonts\//);
    assert.match(css, /url\(https:\/\/atom-web-ds\.vercel\.app\/v1\/fonts\/A-1\.woff2\)/);
    assert.match(css, /\[data-theme=dark\]/);
  });

  it('fails instead of publishing a node with a dangling file', async () => {
    const { publicR, dist } = await fixture({ withDist: false });
    await assert.rejects(emitShadcnChannel(publicR, { ...quiet, cssDistDir: dist }), /foundation\.css missing/);
  });

  it('every emitted item validates, deps close, and the canonical stays byte-identical', async () => {
    const { publicR, dist } = await fixture();
    const read = async () =>
      Promise.all(['index', 'button', 'accordion', 'accordion-animation', 'tokens'].map((n) =>
        fs.readFile(path.join(publicR, `${n}.json`), 'utf8')));
    const before = await read();

    const { emitted } = await emitShadcnChannel(publicR, { ...quiet, cssDistDir: dist });

    const names = new Set(emitted.map((i) => i.name));
    for (const item of emitted) {
      assert.deepEqual(validateShadcnItem(item), [], item.name);
      for (const d of item.registryDependencies ?? []) assert.ok(names.has(d), `${item.name} -> ${d}`);
    }
    const accordion = emitted.find((i) => i.name === 'accordion');
    assert.deepEqual(accordion.registryDependencies, [FOUNDATION_NAME, 'accordion-animation']);
    assert.deepEqual(await read(), before);
  });
});
