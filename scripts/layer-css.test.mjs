/**
 * components.layered.css tests (ADR 014). Run: node --test scripts/layer-css.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { LAYER, wrapInLayer, isWrappedInLayer } from '../packages/css/scripts/layer-css.mjs';

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
