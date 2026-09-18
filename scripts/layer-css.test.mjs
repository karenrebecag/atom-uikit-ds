/**
 * components.layered.css tests (ADR 014). Run: node --test scripts/layer-css.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {
  LAYER,
  wrapInLayer,
  isWrappedInLayer,
  splitStateRules,
  layerWithStates,
  isLayeredWithStates,
} from '../packages/css/scripts/layer-css.mjs';

// lightningcss es dependencia de @atom-uikit/css, no de la raiz: se resuelve desde ahi.
const { transform } = createRequire(new URL('../packages/css/package.json', import.meta.url))('lightningcss');

const css = '.ds-card{padding:8px}@keyframes ds-spin{to{rotate:1turn}}';

describe('wrapInLayer', () => {
  it('envuelve todo el CSS en un solo @layer atom-ds', () => {
    const out = wrapInLayer(css);
    assert.equal(LAYER, 'atom-ds');
    assert.ok(out.startsWith('@layer atom-ds{'));
    assert.ok(out.includes('.ds-card{padding:8px}'));
    assert.ok(out.includes('@keyframes ds-spin'));
  });

  it('produce CSS que LightningCSS acepta sin warnings', () => {
    const { warnings } = transform({ filename: 'x.css', code: Buffer.from(wrapInLayer(css)), minify: true });
    assert.deepEqual(warnings, []);
  });

  it('rechaza un CSS que ya trae @import o @charset: no pueden ir dentro de un layer', () => {
    assert.throws(() => wrapInLayer('@import "a.css";.x{}'), /@import|@charset/);
    assert.throws(() => wrapInLayer('@charset "utf-8";.x{}'), /@import|@charset/);
  });
});

describe('isWrappedInLayer', () => {
  it('reconoce la salida de wrapInLayer', () => {
    assert.equal(isWrappedInLayer(wrapInLayer(css)), true);
  });

  it('no confunde una comilla escapada con el cierre del string', () => {
    assert.equal(isWrappedInLayer(wrapInLayer('.x::before{content:"\\""}')), true);
    assert.equal(isWrappedInLayer(wrapInLayer(".x::before{content:'\\''}")), true);
  });

  it('una barra escapada antes de la comilla si cierra el string', () => {
    assert.equal(isWrappedInLayer(wrapInLayer('.x::before{content:"\\\\"}.y{color:red}')), true);
    assert.equal(isWrappedInLayer(`${wrapInLayer('.x::before{content:"\\\\"}')}.fuera{color:red}`), false);
  });

  it('rechaza CSS sin layer o con reglas fuera del bloque', () => {
    assert.equal(isWrappedInLayer(css), false);
    assert.equal(isWrappedInLayer(`${wrapInLayer(css)}.fuera{color:red}`), false);
  });
});

describe('splitStateRules', () => {
  it('saca del layer las reglas de estado y deja la base', () => {
    const { base, state } = splitStateRules(".t{color:gray}.t[aria-expanded='true']{color:black}");
    assert.equal(base, '.t{color:gray}');
    assert.equal(state, ".t[aria-expanded='true']{color:black}");
  });

  it('reparte una lista de selectores mixta entre base y estado', () => {
    const { base, state } = splitStateRules('.a,.b:hover{color:red}');
    assert.equal(base, '.a{color:red}');
    assert.equal(state, '.b:hover{color:red}');
  });

  it('no parte en las comas de dentro de :not()', () => {
    const { base, state } = splitStateRules('.p:not([data-active],.x){opacity:0}');
    assert.equal(base, '');
    assert.equal(state, '.p:not([data-active],.x){opacity:0}');
  });

  it('conserva el @media alrededor de la parte que mueve', () => {
    const { base, state } = splitStateRules('@media (width<=767px){.a{gap:0}.a:focus-visible{outline:0}}');
    assert.equal(base, '@media (width<=767px){.a{gap:0}}');
    assert.equal(state, '@media (width<=767px){.a:focus-visible{outline:0}}');
  });

  it('deja @keyframes y @font-face en la base', () => {
    const src = '@keyframes k{0%{opacity:0}to{opacity:1}}@font-face{font-family:X;src:url(x.woff2)}';
    assert.deepEqual(splitStateRules(src), { base: src, state: '' });
  });

  it('falla en vez de perder una sentencia sin bloque', () => {
    assert.throws(() => splitStateRules('@layer a;.x{gap:0}'), /sin bloque/);
    assert.throws(() => splitStateRules('.x{gap:0}@layer a;'), /sin bloque/);
  });

  it('no toma por estado un nombre que solo empieza igual', () => {
    for (const sel of ['[data-active-tab]', '[data-state-x]', '.x:disabled-ish']) {
      assert.equal(splitStateRules(`${sel}{gap:0}`).state, '', sel);
    }
    assert.equal(splitStateRules("[data-state=open]{gap:0}").base, '');
  });

  it('ignora ; y { dentro de un string del selector', () => {
    assert.deepEqual(splitStateRules('.a[data-x="a;b"]{color:red}'), { base: '.a[data-x="a;b"]{color:red}', state: '' });
    assert.deepEqual(splitStateRules('[data-x="a{b"]{color:red}.y{color:blue}'), {
      base: '[data-x="a{b"]{color:red}.y{color:blue}',
      state: '',
    });
  });

  it('no confunde un atributo con nombre parecido con un estado', () => {
    const { base } = splitStateRules('[data-bouncy-tabs-button]{cursor:pointer}');
    assert.equal(base, '[data-bouncy-tabs-button]{cursor:pointer}');
  });
});

describe('layerWithStates', () => {
  const src = ".t{color:gray}.t[aria-expanded='true']{color:black}";

  it('layer con la base y los estados despues, fuera del layer', () => {
    const out = layerWithStates(src);
    assert.ok(out.startsWith('@layer atom-ds{.t{color:gray}}'));
    assert.ok(out.trim().endsWith(".t[aria-expanded='true']{color:black}"));
    assert.equal(isLayeredWithStates(out), true);
  });

  it('produce CSS que LightningCSS acepta sin warnings', () => {
    const { warnings } = transform({ filename: 'x.css', code: Buffer.from(layerWithStates(src)), minify: true });
    assert.deepEqual(warnings, []);
  });

  it('rechaza una regla base que quedo fuera del layer', () => {
    assert.equal(isLayeredWithStates(`${wrapInLayer('.a{gap:0}')}.fuera{color:red}`), false);
    assert.equal(isLayeredWithStates('.t:hover{color:red}'), false);
  });
});
