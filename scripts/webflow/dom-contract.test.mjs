/**
 * F7 — domContract + motion script derivation.
 * Run: node --test scripts/webflow/dom-contract.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getDomContract,
  buildMotionScripts,
  buildConsumeCss,
  validateHtmlAgainstContract,
} from './dom-contract.mjs';

const here = dirname(fileURLToPath(import.meta.url));

describe('dom-contract marquee', () => {
  it('F7-C5: marquee-draggable does not write canonical classes via classList', () => {
    const src = readFileSync(
      join(here, '../../packages/animations/src/marquee-draggable.ts'),
      'utf8',
    );
    assert.equal(/classList\.(add|toggle|remove)/.test(src), false);
    assert.equal(/\bclassName\s*=/.test(src), false);
  });

  it('F7-C1: animated item gets js+init; static gets empty js', () => {
    const animated = {
      atom: { discovery: { hasAnimation: true }, implementation: { peerDeps: ['gsap'] } },
    };
    const staticItem = {
      atom: { discovery: { hasAnimation: false }, implementation: { peerDeps: [] } },
    };
    const m = buildMotionScripts(animated, 'marquee');
    assert.ok(m.js.some((u) => u.includes('gsap.min.js')));
    assert.ok(m.js.some((u) => u.includes('Observer.min.js')));
    assert.ok(m.js.some((u) => u.includes('ScrollTrigger.min.js')));
    assert.ok(m.js.some((u) => u.includes('animations.js')));
    assert.match(m.init, /AtomMotion\.initAll/);

    const b = buildMotionScripts(staticItem, 'badge');
    assert.deepEqual(b.js, []);
    assert.equal(b.init, '');
  });

  it('consume includes webflow.css only when hasAnimation', () => {
    const withMotion = buildConsumeCss({ atom: { discovery: { hasAnimation: true } } });
    const staticCss = buildConsumeCss({ atom: { discovery: { hasAnimation: false } } });
    assert.ok(withMotion.some((u) => u.includes('webflow.css')));
    assert.ok(!staticCss.some((u) => u.includes('webflow.css')));
  });

  it('F7-C2: pilot marquee satisfies contract; mutilated fails naming hook', () => {
    const contract = getDomContract('marquee');
    assert.ok(contract);
    const html = readFileSync(join(here, 'pilots/marquee.html'), 'utf8');
    const ok = validateHtmlAgainstContract(html, contract);
    assert.equal(ok.ok, true);

    const broken = html.replace('data-draggable-marquee-list', 'data-broken-list');
    const fail = validateHtmlAgainstContract(broken, contract);
    assert.equal(fail.ok, false);
    assert.ok(
      fail.missing.some((m) => m.includes('data-draggable-marquee-list')),
      `expected missing hook in ${JSON.stringify(fail.missing)}`,
    );
  });

  it('statesWrittenAsClasses true would fail validation', () => {
    const bad = {
      hooks: ['data-x'],
      anatomy: [],
      statesWrittenAsClasses: true,
    };
    const r = validateHtmlAgainstContract('<div data-x=""></div>', bad);
    assert.equal(r.ok, false);
    assert.ok(r.missing.some((m) => m.includes('statesWrittenAsClasses')));
  });
});
