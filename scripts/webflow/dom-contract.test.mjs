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
  getDomContractSync,
  loadDomContracts,
  buildMotionScripts,
  buildConsumeCss,
  validateHtmlAgainstContract,
  validateHooksCoverSelectors,
  ALL_BEHAVIOR_MODULES,
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

  it('F8b: loadDomContracts from REQUIRED_HOOKS exports', async () => {
    const contracts = await loadDomContracts();
    assert.ok(contracts.marquee);
    assert.ok(contracts.marquee.hooks.includes('data-draggable-marquee'));
    assert.deepEqual(getDomContract('marquee')?.hooks, contracts.marquee.hooks);
  });

  it('F8-C4: querySelector data-* covered by REQUIRED_HOOKS', () => {
    const src = readFileSync(
      join(here, '../../packages/animations/src/marquee-draggable.ts'),
      'utf8',
    );
    const contract = getDomContractSync('marquee');
    assert.ok(contract);
    // Source has REQUIRED_HOOKS — also verify against dist after build
    const inv = validateHooksCoverSelectors(src, contract.hooks);
    // querySelectors in source use [data-draggable-marquee] etc.
    assert.equal(inv.ok, true, JSON.stringify(inv));
    // La invariante NO puede pasar en vacio: debe EXTRAER selectores del source
    // (regresion: la regex sin genericos TS extraia 0 y validaba contra nada).
    assert.ok(inv.found.length >= 3, `extractor vacuo: found=${JSON.stringify(inv.found)}`);
    // Y debe FALLAR si un hook consultado falta en REQUIRED_HOOKS:
    const reduced = contract.hooks.filter((h) => h !== 'data-draggable-marquee-list');
    const bad = validateHooksCoverSelectors(src, reduced);
    assert.equal(bad.ok, false, 'la invariante debe detectar hooks faltantes');
    assert.ok(bad.missing.includes('data-draggable-marquee-list'));
  });

  it('F8 audit: animated slug WITHOUT module contract emits static (motionOmitted)', () => {
    const animatedNoContract = {
      atom: { discovery: { hasAnimation: true }, implementation: { peerDeps: ['gsap'] } },
    };
    // slug not in SLUG_TO_MODULE (button now has a contract under F10b)
    const m = buildMotionScripts(animatedNoContract, 'no-contract-animated');
    assert.deepEqual(m.js, []);
    assert.equal(m.init, '');
    assert.equal(m.motionOmitted, true);
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
    const contract = getDomContractSync('marquee') ?? getDomContract('marquee');
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

  it('F10-C5: every behavior module exports REQUIRED_HOOKS; invariant covers all', async () => {
    const contracts = await loadDomContracts();
    assert.ok(contracts.button, 'button family mapped to button-hover');
    assert.ok(contracts.marquee);
    const srcRoot = join(here, '../../packages/animations/src');
    for (const file of ALL_BEHAVIOR_MODULES) {
      const base = file.replace(/\.js$/, '');
      const srcPath = join(srcRoot, `${base}.ts`);
      const src = readFileSync(srcPath, 'utf8');
      assert.match(src, /export const REQUIRED_HOOKS/, `${file} must export REQUIRED_HOOKS`);
      assert.match(
        src,
        /export const STATES_WRITTEN_AS_CLASSES/,
        `${file} must declare STATES_WRITTEN_AS_CLASSES`,
      );
      const hooksMatch = src.match(/REQUIRED_HOOKS\s*=\s*\[([\s\S]*?)\]/);
      assert.ok(hooksMatch, `${file} REQUIRED_HOOKS array`);
      const hooks = [...hooksMatch[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
      const inv = validateHooksCoverSelectors(src, hooks);
      assert.equal(inv.ok, true, `${file}: ${JSON.stringify(inv)}`);
    }
  });

  it('F10b: button with contract emits motion js (not omitted)', () => {
    const animated = {
      atom: { discovery: { hasAnimation: true }, implementation: { peerDeps: ['gsap'] } },
    };
    const m = buildMotionScripts(animated, 'button');
    assert.ok(m.js.some((u) => u.includes('gsap.min.js')));
    assert.ok(m.js.some((u) => u.includes('animations.js')));
    assert.equal(m.motionOmitted, undefined);
  });
});
