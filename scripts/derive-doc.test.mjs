/**
 * F12a — TDD for derive-doc.
 * Run: node --test scripts/derive-doc.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadResolvedTokens,
  resolveComponentTokens,
  deriveItemDoc,
  normalizeColor,
  extractBemAnatomy,
  extractMotion,
  slugToTokenPrefix,
  extractTokensFromCss,
  parseBemSelector,
  resolveCssVar,
} from './derive-doc.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('derive-doc token resolution', () => {
  it('F12-C2: button primary bg resolves to a hex (chain complete)', () => {
    const tokens = loadResolvedTokens();
    const { resolved } = resolveComponentTokens('button', tokens, {
      variants: ['primary', 'secondary'],
      sizes: ['m'],
    });
    const primaryBg = resolved.find((r) => r.variant === 'primary' && r.prop === 'bg');
    assert.ok(primaryBg, `expected primary bg in ${JSON.stringify(resolved.slice(0, 5))}`);
    assert.match(primaryBg.hex, /^#([0-9a-f]{6}|[0-9a-f]{8})$/i);
    // Current DS (neutral-950) — CMS CLAUDE still documents zinc-900 #18181b = known drift
    assert.equal(primaryBg.hex, '#0a0a0a');
  });

  it('button sizes include height/padding for m', () => {
    const tokens = loadResolvedTokens();
    const { sizes } = resolveComponentTokens('button', tokens, {
      variants: ['primary'],
      sizes: ['xs', 's', 'm', 'l', 'xl'],
    });
    const m = sizes.find((s) => s.size === 'm');
    assert.ok(m);
    assert.equal(m.height, '40px');
    assert.equal(m.paddingX, '16px');
  });

  it('slugToTokenPrefix maps kebab to camel', () => {
    assert.equal(slugToTokenPrefix('icon-button'), 'iconButton');
    assert.equal(slugToTokenPrefix('button'), 'button');
  });

  it('normalizeColor expands #rgb', () => {
    assert.equal(normalizeColor('#abc'), '#aabbcc');
  });
});

describe('derive-doc anatomy + motion', () => {
  it('extracts BEM classes for base', () => {
    const css = `
      .button { color: red; }
      .button--primary { }
      .button__label { }
    `;
    const a = extractBemAnatomy(css, 'button');
    assert.ok(a.classes.some((c) => c.class === 'button'));
    assert.ok(a.classes.some((c) => c.class === 'button--primary'));
    assert.ok(a.classes.some((c) => c.class === 'button__label'));
  });

  it('extracts transition motion', () => {
    const css = `.x { transition: background-color 300ms ease-out, color 300ms ease-out; }`;
    const m = extractMotion(css);
    assert.ok(m.length >= 2);
    assert.equal(m[0].property, 'background-color');
  });
});

describe('deriveItemDoc degradation (F12-C4)', () => {
  it('broken CSS → partial derived with reason, no throw, no invented hex', () => {
    const tokens = loadResolvedTokens();
    const d = deriveItemDoc(
      {
        name: 'button',
        atom: {
          discovery: { variants: ['primary'], sizes: ['m'] },
          implementation: { baseClass: 'button', peerDeps: ['gsap'], hasCss: true },
        },
      },
      { tokens, cssOverride: '__BROKEN__', sourceCommit: 'testsha', now: '2026-08-02T00:00:00.000Z' },
    );
    assert.equal(d.sourceCommit, 'testsha');
    assert.equal(d.degraded, true);
    assert.ok(d.degradeReasons.includes('css-unparseable'));
    // tokens still resolved from tokens.json — not invented
    assert.ok(d.tokens.resolved.some((r) => r.hex === '#0a0a0a'));
    // no fake anatomy prose
    assert.equal(d.anatomy.bem, '');
  });

  it('every emission has sourceCommit (F12-C3 shape)', () => {
    const d = deriveItemDoc(
      { name: 'badge', atom: { discovery: {}, implementation: { baseClass: 'badge' } } },
      { tokens: loadResolvedTokens(), sourceCommit: 'abc123', cssOverride: '', now: '2026-08-02T00:00:00.000Z' },
    );
    assert.equal(d.sourceCommit, 'abc123');
    assert.ok(d.generatedAt);
    assert.ok(d.install);
  });
});

describe('F14 extractTokensFromCss', () => {
  it('F14-C2: badge three selectors resolve hex', () => {
    const tokens = loadResolvedTokens();
    const css = readFileSync(
      join(ROOT, 'packages/css/src/components/indicators/badge.css'),
      'utf8',
    );
    const rows = extractTokensFromCss(css, 'badge', tokens);
    const pick = (v, p) => rows.find((r) => r.variant === v && r.prop === p);
    // .badge--neutral.badge--enabled
    assert.equal(pick('neutral', 'bg')?.hex, tokens.muted || tokens.Muted);
    assert.equal(pick('neutral', 'bg')?.hex, '#f5f5f5');
    assert.equal(pick('neutral', 'fg')?.hex, '#0a0a0a');
    // focused
    assert.equal(pick('neutral', 'focused-bg')?.hex, '#0a0a0a');
    assert.equal(pick('neutral', 'focused-fg')?.hex, '#fafafa');
    // subtle uses primitives
    assert.equal(pick('neutral', 'subtle-bg')?.hex, '#262626');
    assert.equal(pick('neutral', 'subtle-fg')?.hex, '#fafafa');
  });

  it('compound vs simple modifiers', () => {
    const tokens = loadResolvedTokens();
    const css = `
      .x--primary { background-color: var(--primary); color: var(--primary-foreground); }
      .x--primary.x--subtle { background-color: var(--muted); color: var(--foreground); }
    `;
    const rows = extractTokensFromCss(css, 'x', tokens);
    assert.ok(rows.some((r) => r.variant === 'primary' && r.prop === 'bg' && r.hex === '#0a0a0a'));
    assert.ok(rows.some((r) => r.variant === 'primary' && r.prop === 'subtle-bg' && r.hex === '#f5f5f5'));
  });

  it('hover and disabled map to prop prefixes', () => {
    const tokens = loadResolvedTokens();
    const css = `
      .btn--primary:hover { background-color: var(--primary-hover); }
      .btn--primary[disabled] { color: var(--muted-foreground); }
    `;
    const rows = extractTokensFromCss(css, 'btn', tokens);
    assert.ok(rows.some((r) => r.prop === 'hover-bg'));
    assert.ok(rows.some((r) => r.prop === 'disabled-fg'));
  });

  it('last declaration wins for same selector+prop', () => {
    const tokens = loadResolvedTokens();
    const css = `
      .z--a { background-color: var(--primary); }
      .z--a { background-color: var(--destructive); }
    `;
    const rows = extractTokensFromCss(css, 'z', tokens);
    const bg = rows.find((r) => r.variant === 'a' && r.prop === 'bg');
    assert.equal(bg?.hex, tokens.destructive);
  });

  it('F14-C5: unresolved var keeps name, no invent', () => {
    const tokens = loadResolvedTokens();
    const r = resolveCssVar('--no-existe-en-ninguna-capa', tokens);
    assert.equal(r.resolved, false);
    assert.equal(r.hex, 'var(--no-existe-en-ninguna-capa)');
    const css = `.q { background-color: var(--no-existe-en-ninguna-capa); }`;
    const rows = extractTokensFromCss(css, 'q', tokens);
    assert.equal(rows[0].hex, 'var(--no-existe-en-ninguna-capa)');
  });

  it('parseBemSelector maps compounds', () => {
    const p = parseBemSelector('.badge--neutral.badge--enabled', 'badge');
    assert.equal(p.variant, 'neutral');
    assert.equal(p.state, '');
    const h = parseBemSelector('.button--primary:hover', 'button');
    assert.equal(h.variant, 'primary');
    assert.equal(h.state, 'hover');
  });

  it('F14: badge deriveItemDoc fills tokens via CSS fallback', () => {
    const tokens = loadResolvedTokens();
    const css = readFileSync(
      join(ROOT, 'packages/css/src/components/indicators/badge.css'),
      'utf8',
    );
    const d = deriveItemDoc(
      {
        name: 'badge',
        atom: {
          discovery: { variants: ['neutral', 'inbox'], sizes: [] },
          implementation: { baseClass: 'badge', hasCss: true, peerDeps: [] },
        },
      },
      { tokens, cssOverride: css, sourceCommit: 't', now: '2026-08-02T00:00:00.000Z' },
    );
    assert.ok(d.tokens.resolved.length >= 6);
    assert.ok(!d.degradeReasons?.includes('no-component-tokens'));
  });
});
