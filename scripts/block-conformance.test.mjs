/**
 * Bloques ejemplares. Run: node --test scripts/block-conformance.test.mjs
 * Un test por comportamiento del contrato (docs spec uikit-arc-parity 10).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkExemplar } from './block-conformance.mjs';
import { resolveExemplarHtml } from './exemplar.mjs';

const layout = () => ({
  html: `<!-- Layout: demo -->
<section class="section--hero l-demo" data-x>
  <span class="chip" data-optional="eyebrow">{{eyebrow}}</span>
  <h1 class="l-demo__h" data-split="heading">{{heading}}</h1>
  <a href="{{href}}" class="button">{{cta}}</a>
</section>`,
  css: '.l-demo { padding-inline: var(--container-padding); }\n.l-demo__h { max-width: 40rem; }',
});

const exemplar = (over = {}) => ({
  slug: 'demo',
  whenToUse: ['a', 'b'],
  whenNotToUse: ['usa layout/otro', 'usa layout/mas'],
  rhythm: 'section--hero',
  surface: 'default',
  motion: { hook: 'text-reveal', attrs: { 'data-split': 'heading' } },
  content: { eyebrow: null, heading: 'Titular', href: 'https://wa.me/1', cta: 'Hablar' },
  states: ['x'],
  a11y: { carriesH1: true, landmark: null },
  related: ['layout/otro'],
  evidence: { capture: 'c.png', captureMobile: 'm.png', acceptance: 'ok' },
  ...over,
});

const run = (ex, { lay = layout(), description = 'Hero real', deps = ['text-reveal'] } = {}) =>
  checkExemplar({
    slug: 'demo',
    layout: lay,
    exemplar: ex,
    deps,
    description,
    hookNames: new Set(['text-reveal']),
    utilityClasses: new Set(['bg-dark']),
    registryNames: new Set(['layout/otro', 'layout/viejo']),
    exempt: new Set(['layout/viejo']),
    fileExists: () => true,
  });

describe('checkExemplar', () => {
  it('un ejemplar correcto no tiene errores', () => {
    assert.deepEqual(run(exemplar()), []);
  });

  it('falla nombrando el campo si falta whenNotToUse', () => {
    const ex = exemplar();
    delete ex.whenNotToUse;
    assert.match(run(ex).join('\n'), /exemplarComplete: demo: falta el campo whenNotToUse/);
  });

  it('falla si el layout declara padding de bloque en su raiz', () => {
    const lay = layout();
    lay.css = '.l-demo { padding: var(--spacing-20) var(--spacing-8); }';
    assert.match(run(exemplar(), { lay }).join('\n'), /rhythmFromUseLayer.*padding/);
  });

  it('falla con un hook inexistente o ausente de registryDependencies', () => {
    const bad = exemplar({ motion: { hook: 'fade-suave', attrs: {} } });
    assert.match(run(bad).join('\n'), /noNewMotion.*fade-suave/);
    assert.match(run(exemplar(), { deps: [] }).join('\n'), /noNewMotion.*registryDependencies/);
  });

  it('falla con una superficie que utilities no emite, incluida bg-violet-soft', () => {
    assert.match(run(exemplar({ surface: 'bg-neon' })).join('\n'), /surfaceFromUtilities/);
    assert.match(run(exemplar({ surface: 'bg-violet-soft' })).join('\n'), /surfaceFromUtilities/);
  });

  it('falla si el contenido mete un <form> o un href que no es wa.me', () => {
    const lay = layout();
    lay.html = lay.html.replace('</section>', '<form><input></form></section>');
    assert.match(run(exemplar(), { lay }).join('\n'), /contentResolved.*form/);
    const ex = exemplar({ content: { ...exemplar().content, href: 'https://example.com' } });
    assert.match(run(ex).join('\n'), /contentResolved.*wa\.me/);
  });

  it('falla con related deprecado y con description de relleno', () => {
    assert.match(run(exemplar({ related: ['layout/viejo'] })).join('\n'), /relatedExists.*legacy/);
    assert.match(run(exemplar(), { description: 'Layout template: demo' }).join('\n'), /descriptionIsReal/);
  });
});

describe('resolveExemplarHtml', () => {
  it('emite 0 slots y 0 data-repeat, y quita lo opcional en null', () => {
    const html = resolveExemplarHtml(layout(), exemplar());
    assert.doesNotMatch(html, /\{\{|data-repeat|data-optional|chip/);
    assert.match(html, /^<!-- contenido de referencia/);
  });

  it('expande data-repeat con una fila por dato', () => {
    const lay = { html: '<section class="section l-r"><ul data-repeat="f"><li>{{label}}</li></ul></section>' };
    const html = resolveExemplarHtml(lay, { rhythm: 'section', surface: 'default', content: {}, repeats: { f: [{ label: 'a' }, { label: 'b' }] } });
    assert.equal((html.match(/<li>/g) ?? []).length, 2);
    assert.doesNotMatch(html, /data-repeat/);
  });

  it('un slot sin contenido falla en vez de publicarse con {{}}', () => {
    assert.throws(() => resolveExemplarHtml(layout(), exemplar({ content: { eyebrow: null } })), /slots sin contenido/);
  });
});
