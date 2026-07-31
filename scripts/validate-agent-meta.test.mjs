/**
 * F3-C1 — validator rejects invalid meta.agent (4 cases + happy path).
 * Run: node --test scripts/validate-agent-meta.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateAgentMeta } from './validate-agent-meta.mjs';

const PROPS = ['duration', 'ease', 'single', 'variant'];

function baseAgent(overrides = {}) {
  return {
    configurables: [
      {
        prop: 'duration',
        type: 'number',
        default: '0.4',
        min: 0.2,
        max: 1.2,
        step: 0.1,
        unit: 'seconds',
        what: 'Open duration.',
        how: '0.2-0.4 dense UI. Default: 0.4',
      },
    ],
    gotchas: [{ context: 'ssr', note: 'Measure heights after mount.' }],
    usage: '<Accordion />',
    ...overrides,
  };
}

describe('validateAgentMeta', () => {
  it('accepts a valid agent block', () => {
    const r = validateAgentMeta('accordion', baseAgent(), PROPS);
    assert.equal(r.ok, true);
  });

  it('F3-C1: rejects prop that does not exist', () => {
    const agent = baseAgent({
      configurables: [
        {
          prop: 'notARealProp',
          type: 'boolean',
          default: 'true',
          what: 'x',
          how: 'y',
        },
      ],
    });
    const r = validateAgentMeta('accordion', agent, PROPS);
    assert.equal(r.ok, false);
    assert.ok(r.errors.some((e) => e.includes('accordion.notARealProp') && e.includes('does not exist')));
  });

  it('F3-C1: rejects number missing min/max/step/unit', () => {
    const agent = baseAgent({
      configurables: [
        {
          prop: 'duration',
          type: 'number',
          default: '0.4',
          max: 1,
          step: 0.1,
          // min and unit missing
          what: 'x',
          how: 'y',
        },
      ],
    });
    const r = validateAgentMeta('accordion', agent, PROPS);
    assert.equal(r.ok, false);
    assert.ok(r.errors.some((e) => e.includes('accordion.duration') && e.includes('min')));
    assert.ok(r.errors.some((e) => e.includes('accordion.duration') && e.includes('unit')));
  });

  it('F3-C1: rejects select without options', () => {
    const agent = baseAgent({
      configurables: [
        {
          prop: 'ease',
          type: 'select',
          default: 'expo.out',
          what: 'x',
          how: 'y',
        },
      ],
    });
    const r = validateAgentMeta('accordion', agent, PROPS);
    assert.equal(r.ok, false);
    assert.ok(r.errors.some((e) => e.includes('accordion.ease') && e.includes('options')));
  });

  it('F3-C1: rejects default outside options', () => {
    const agent = baseAgent({
      configurables: [
        {
          prop: 'variant',
          type: 'select',
          default: 'nope',
          options: ['primary', 'secondary'],
          what: 'x',
          how: 'y',
        },
      ],
    });
    const r = validateAgentMeta('accordion', agent, PROPS);
    assert.equal(r.ok, false);
    assert.ok(r.errors.some((e) => e.includes('accordion.variant') && e.includes('not in options')));
  });
});
