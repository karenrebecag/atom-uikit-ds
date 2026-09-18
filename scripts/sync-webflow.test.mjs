/**
 * sync-webflow plan tests. Run: node --test scripts/sync-webflow.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildDesired } from './sync-webflow.mjs';

const nested = {
  'font-size': { xs: '10.24px', '5xl': '61.04px', rel: '1.5rem' },
  'line-height': { base: '1.5' },
  'section-padding-l': '125px',
  'gap-m': '24px',
  spacing: { 4: '16px' },
  radius: { lg: '12px' },
  stroke: { thin: '1.5px' },
};

const byName = (name) => buildDesired(nested, {}).find((d) => d.name === name);

describe('buildDesired — escala fluida sobre --u', () => {
  it('emite font-size como calc sobre --u con fallback en px para el canvas', () => {
    assert.deepEqual(byName('type/font-size-5xl').light, {
      custom: 'calc(61.04 * var(--u, 1px))',
    });
  });

  it('emite ritmo, gap, spacing y radius fluidos, igual que tokens.css del DS', () => {
    assert.deepEqual(byName('space/section-padding-l').light, { custom: 'calc(125 * var(--u, 1px))' });
    assert.deepEqual(byName('space/gap-m').light, { custom: 'calc(24 * var(--u, 1px))' });
    assert.deepEqual(byName('space/spacing-4').light, { custom: 'calc(16 * var(--u, 1px))' });
    assert.deepEqual(byName('radius/lg').light, { custom: 'calc(12 * var(--u, 1px))' });
  });

  it('deja stroke en px fijos: el DS no lo escala', () => {
    assert.deepEqual(byName('stroke/thin').light, { value: 1.5, unit: 'px' });
  });

  it('deja pasar sin escalar un tamano que no viene en px: rem ya escala solo', () => {
    assert.deepEqual(byName('type/font-size-rel').light, { value: 1.5, unit: 'rem' });
  });

  it('no toca los tipos no dimensionales', () => {
    assert.equal(byName('type/line-height-base').light, 1.5);
  });
});
