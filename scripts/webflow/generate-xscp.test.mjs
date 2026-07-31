/**
 * F6 generator tests. Run: node --test scripts/webflow/generate-xscp.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateXscp,
  normalizeIds,
  structuralEqual,
  formatWebflowMarkdown,
  resolveTokensCss,
} from './generate-xscp.mjs';

const here = dirname(fileURLToPath(import.meta.url));

describe('generateXscp', () => {
  it('F6-C1 algorithm: simple nested structure with class styles', () => {
    const html = `<div class="card"><span class="card-title">Hi</span></div>`;
    const css = `
      .card { display: flex; padding: 1rem; }
      .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .card-title { font-size: 1.5rem; }
    `;
    const pkg = generateXscp(html, css, { slug: 'card' });
    assert.equal(pkg.clipboard.type, '@webflow/XscpData');
    assert.ok(pkg.clipboard.payload.nodes.length >= 3);
    assert.ok(pkg.clipboard.payload.styles.some((s) => s.name === 'ds-card'), 'ds- namespace applied');
    const cardStyle = pkg.clipboard.payload.styles.find((s) => s.name === 'ds-card');
    assert.ok(cardStyle.createdBy);
    assert.ok(!('origin' in cardStyle), 'real dumps carry no origin key');
    assert.ok(cardStyle.variants.main_hover);
    assert.match(cardStyle.styleLess, /display:\s*flex/);
    // text node present
    assert.ok(pkg.clipboard.payload.nodes.some((n) => n.text && n.v === 'Hi'));
    // nodes reference style _ids, not class names (real Designer contract)
    const cardNode = pkg.clipboard.payload.nodes.find((n) => n.tag === 'div');
    assert.deepEqual(cardNode.classes, [cardStyle._id]);
  });

  it('F6-C1 designer contract: emitted shape matches a REAL Designer dump key-for-key', () => {
    const real = JSON.parse(
      readFileSync(join(here, 'fixtures', 'designer', 'testimonial-copy-json.json'), 'utf8'),
    );
    const pkg = generateXscp(
      `<div class="a"><h2 class="b">Hey</h2></div>`,
      `.a { display: flex; } .a:hover { opacity: 0.8; } .b { font-size: 2rem; }
       @media (max-width: 767px) { .b { font-size: 1.5rem; } }`,
      { slug: 'contract' },
    );

    // payload keys exactos (sin styleOverrides)
    assert.deepEqual(
      Object.keys(pkg.clipboard.payload).sort(),
      Object.keys(real.payload).sort(),
    );
    // style keys exactos (sin origin, con selector/createdBy)
    const realStyleKeys = Object.keys(real.payload.styles[0]).sort();
    for (const s of pkg.clipboard.payload.styles) {
      assert.deepEqual(Object.keys(s).sort(), realStyleKeys, s.name);
    }
    // element node keys exactos
    const realEl = real.payload.nodes.find((n) => n.type === 'Block');
    const ourEl = pkg.clipboard.payload.nodes.find((n) => n.type === 'Block');
    assert.deepEqual(Object.keys(ourEl).sort(), Object.keys(realEl).sort());
    // text node shape exacto {_id, text, v}
    const realText = real.payload.nodes.find((n) => n.text === true);
    const ourText = pkg.clipboard.payload.nodes.find((n) => n.text === true);
    assert.deepEqual(Object.keys(ourText).sort(), Object.keys(realText).sort());
    // classes referencian _ids de styles existentes (como el dump real)
    const ids = new Set(pkg.clipboard.payload.styles.map((s) => s._id));
    for (const n of pkg.clipboard.payload.nodes) {
      for (const c of n.classes ?? []) assert.ok(ids.has(c));
    }
    // _id con forma UUID hex 8-4-4-4-12
    assert.match(ourEl._id, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    // breakpoint variant con el naming real del Designer
    const b = pkg.clipboard.payload.styles.find((s) => s.name === 'ds-b');
    assert.ok(b.variants.small);
    assert.match(b.variants.small.styleLess, /font-size:\s*1\.5rem/);
  });

  it('F6-C4c: custom properties on a class move to headCss, never silently dropped', () => {
    const css = `
      .badge--neutral { --badge-bg: var(--muted); --badge-fg: var(--muted-foreground); }
      .badge { display: inline-flex; background: var(--badge-bg); }
    `;
    const pkg = generateXscp(`<span class="badge badge--neutral"></span>`, css, { slug: 'b' });
    assert.match(pkg.headCss, /\.ds-badge--neutral\{/);
    assert.match(pkg.headCss, /--badge-bg:\s*var\(--muted\)/);
    assert.ok(
      pkg.unsupported.some((u) => u.prop === '--custom-properties'),
    );
    // la clase base conserva sus decls normales (var() como VALOR sí es válido)
    const badge = pkg.clipboard.payload.styles.find((s) => s.name === 'ds-badge');
    assert.match(badge.styleLess, /background:\s*var\(--badge-bg\)/);
  });

  it('F6-C4b: non-breakpoint @media moves to headCss, never silently dropped', () => {
    const css = `
      .sp { animation: r 1s linear infinite; }
      @media (prefers-reduced-motion: reduce) {
        .sp { animation: none; }
      }
    `;
    const pkg = generateXscp(`<span class="sp"></span>`, css, { slug: 'sp' });
    assert.match(pkg.headCss, /prefers-reduced-motion/);
    assert.match(pkg.headCss, /animation:\s*none/);
    assert.ok(
      pkg.unsupported.some((u) => u.prop === '@media' && /head Custom Code/.test(u.reason)),
    );
  });

  it('F6-C3: keyframes land in headCss, not silent drop', () => {
    const html = `<span class="spinner"></span>`;
    const css = `
      .spinner { display: inline-flex; animation: spinner-rotate 1s linear infinite; }
      @keyframes spinner-rotate {
        to { transform: rotate(360deg); }
      }
    `;
    const pkg = generateXscp(html, css, { slug: 'spinner' });
    assert.match(pkg.headCss, /@keyframes\s+spinner-rotate/);
  });

  it('F6-C4: unsupported property reported, no throw', () => {
    const html = `<div class="x"></div>`;
    const css = `.x { display: block; container-type: inline-size; }`;
    const pkg = generateXscp(html, css, { slug: 'x' });
    assert.ok(pkg.unsupported.some((u) => u.prop === 'container-type'));
    assert.match(pkg.clipboard.payload.styles[0].styleLess, /display:\s*block/);
  });

  it('data-* attributes become xattr on the node', () => {
    const html = `<div class="badge" data-atom-badge="1"></div>`;
    const css = `.badge { display: inline-flex; }`;
    const pkg = generateXscp(html, css, { slug: 'badge' });
    const badgeStyle = pkg.clipboard.payload.styles.find((s) => s.name === 'ds-badge');
    const node = pkg.clipboard.payload.nodes.find((n) => n.classes?.includes(badgeStyle._id));
    assert.ok(node.data.xattr.some((x) => x.name === 'data-atom-badge'));
  });

  it('crash-fix: <button> becomes Designer-legit Link Button (tag a, data.button, role)', () => {
    const pkg = generateXscp(
      `<button class="button" data-atom-button="" type="button">Go</button>`,
      `.button { display: inline-flex; }`,
      { slug: 'button' },
    );
    const node = pkg.clipboard.payload.nodes.find((n) => n.type === 'Link');
    assert.ok(node, 'Link node emitted');
    assert.equal(node.tag, 'a', 'tag button rewritten to a (Block/button crashes Designer)');
    assert.equal(node.data.tag, 'a');
    assert.equal(node.data.button, true);
    assert.ok(node.data.xattr.some((x) => x.name === 'role' && x.value === 'button'));
  });

  it('crash-fix: native form controls throw (excluded from channel, wave 2 = Form* types)', () => {
    for (const html of [
      `<input class="input" type="text">`,
      `<textarea class="textarea"></textarea>`,
      `<label class="checkbox"><input type="checkbox"><span class="checkbox__box"></span></label>`,
    ]) {
      assert.throws(
        () => generateXscp(html, `.x { display: block; }`, { slug: 'x' }),
        /form control <(input|textarea)> not representable/,
      );
    }
  });

  it('pilot HTML files parse', () => {
    for (const slug of ['badge', 'divider', 'spinner']) {
      const html = readFileSync(join(here, 'pilots', `${slug}.html`), 'utf8');
      const css = '.badge{} .badge__label{} .divider{} .spinner{} .spinner--m{} .badge--neutral{} .badge--enabled{}';
      const pkg = generateXscp(html, css, { slug });
      assert.equal(pkg.clipboard.type, '@webflow/XscpData');
      assert.ok(pkg.clipboard.payload.nodes.length > 0, slug);
    }
  });

  it('normalizeIds is stable for equality', () => {
    const html = `<div class="a"><div class="b"></div></div>`;
    const css = `.a{color:red}.b{color:blue}`;
    const a = generateXscp(html, css, { slug: 'a' }).clipboard;
    const b = generateXscp(html, css, { slug: 'b' }).clipboard;
    assert.equal(structuralEqual(a, b), true);
    assert.notEqual(normalizeIds(a).payload.nodes[0]._id, undefined);
  });

  it('F6-C1 svg contract: <svg> becomes an HtmlEmbed node matching the REAL Designer shape', () => {
    const real = JSON.parse(
      readFileSync(join(here, 'fixtures', 'designer', 'hero-2-copy-json.json'), 'utf8'),
    );
    const realEmbed = real.payload.nodes.find((n) => n.type === 'HtmlEmbed');

    const pkg = generateXscp(
      `<span class="sp" role="status" aria-label="Loading"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10"/></svg></span>`,
      `.sp { display: inline-flex; }`,
      { slug: 'sp' },
    );
    const ourEmbed = pkg.clipboard.payload.nodes.find((n) => n.type === 'HtmlEmbed');
    assert.ok(ourEmbed, 'HtmlEmbed node emitted');
    // shape clave-por-clave contra el nodo real
    assert.deepEqual(Object.keys(ourEmbed).sort(), Object.keys(realEmbed).sort());
    assert.deepEqual(Object.keys(ourEmbed.data).sort(), Object.keys(realEmbed.data).sort());
    assert.deepEqual(
      Object.keys(ourEmbed.data.embed.meta).sort(),
      Object.keys(realEmbed.data.embed.meta).sort(),
    );
    assert.equal(ourEmbed.v, ourEmbed.data.embed.meta.html);
    assert.match(ourEmbed.v, /^<svg/);
    // role + aria-* viajan en xattr del padre (se perdían en el paste v1)
    const parent = pkg.clipboard.payload.nodes.find((n) =>
      (n.children ?? []).includes(ourEmbed._id),
    );
    const xnames = parent.data.xattr.map((x) => x.name);
    assert.ok(xnames.includes('role'));
    assert.ok(xnames.includes('aria-label'));
  });

  it('resolveTokensCss: self-contained :root from tokens-nested (semantic + category + transitive)', () => {
    const nested = {
      muted: '#f5f5f5',
      spacing: { 1: '4px' },
      'font-size': { xs: '10.24px' },
      duration: { 700: '700ms' },
      button: { bg: 'var(--muted)' },
    };
    const css = `.x { padding: 0 var(--spacing-1); font-size: var(--font-size-xs);
      animation-duration: var(--duration-700); background: var(--button-bg); color: var(--nope); }`;
    const r = resolveTokensCss(css, nested);
    assert.match(r.tokensCss, /^:root \{/);
    assert.match(r.tokensCss, /--spacing-1: 4px;/);
    assert.match(r.tokensCss, /--font-size-xs: 10\.24px;/);
    assert.match(r.tokensCss, /--duration-700: 700ms;/);
    assert.match(r.tokensCss, /--button-bg: var\(--muted\);/);
    assert.match(r.tokensCss, /--muted: #f5f5f5;/, 'transitive var in value resolved');
    assert.deepEqual(r.unresolved, ['nope']);
  });

  it('formatWebflowMarkdown includes risk and steps', () => {
    const pkg = generateXscp(`<div class="a"></div>`, `.a{display:block}`, { slug: 'a' });
    const md = formatWebflowMarkdown('a', pkg);
    assert.match(md, /Risk/);
    assert.match(md, /Paste steps/);
    assert.match(md, /@webflow\/XscpData/);
  });
});
