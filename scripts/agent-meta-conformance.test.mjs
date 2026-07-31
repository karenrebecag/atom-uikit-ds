/**
 * F4-C1..C4 (synthetic fixtures) for agent-meta conformance.
 * Run: node --test scripts/agent-meta-conformance.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkConformance,
  parseReactProps,
  normalizeDefault,
} from './agent-meta-conformance.mjs';

const BADGE_SRC = `
export function Badge({
  variant = 'neutral',
  state = 'enabled',
  children,
  className,
}: BadgeProps) {
  return null;
}
`;

const BUTTON_SRC = `
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'm',
      disabled = false,
      loading = false,
      animated = false,
      children,
      ...props
    },
    ref,
  ) => {
    return null;
  },
);
`;

describe('parseReactProps', () => {
  it('parses export function destructuring (badge pattern)', () => {
    const props = parseReactProps(BADGE_SRC);
    assert.ok(props);
    assert.equal(props.get('variant'), 'neutral');
    assert.equal(props.get('state'), 'enabled');
    assert.equal(props.get('children'), undefined);
  });

  it('parses forwardRef destructuring (button pattern)', () => {
    const props = parseReactProps(BUTTON_SRC);
    assert.ok(props);
    assert.equal(props.get('variant'), 'primary');
    assert.equal(props.get('animated'), 'false');
    assert.equal(props.get('size'), 'm');
  });

  it('returns null when unparseable', () => {
    assert.equal(parseReactProps('const x = () => null;'), null);
  });
});

describe('checkConformance', () => {
  it('F4-C3 clean: badge pilot shape matches', () => {
    const r = checkConformance(
      'badge',
      [
        { prop: 'variant', type: 'select', default: 'neutral' },
        { prop: 'state', type: 'select', default: 'enabled' },
      ],
      BADGE_SRC,
    );
    assert.equal(r.unparseable, false);
    assert.deepEqual(r.missing, []);
    assert.deepEqual(r.mismatched, []);
  });

  it('F4-C1 mismatched default detected with both values', () => {
    const r = checkConformance(
      'badge',
      [{ prop: 'variant', type: 'select', default: 'inbox' }],
      BADGE_SRC,
    );
    assert.equal(r.unparseable, false);
    assert.deepEqual(r.mismatched, [
      { prop: 'variant', manifest: 'inbox', source: 'neutral' },
    ]);
  });

  it('F4-C2 missing prop when renamed in source', () => {
    const src = `export function Accordion({ speed = 0.4 }) { return null; }`;
    const r = checkConformance(
      'accordion',
      [{ prop: 'duration', type: 'number', default: '0.4' }],
      src,
    );
    assert.deepEqual(r.missing, ['duration']);
  });

  it('F4-C4 unparseable is explicit fail signal', () => {
    const r = checkConformance('weird', [{ prop: 'x', default: '1' }], 'const x = () => null;');
    assert.equal(r.unparseable, true);
  });

  it('normalizeDefault strips quotes', () => {
    assert.equal(normalizeDefault("'primary'"), 'primary');
    assert.equal(normalizeDefault('false'), 'false');
  });
});
