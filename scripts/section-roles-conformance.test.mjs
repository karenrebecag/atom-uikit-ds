/**
 * Run: node --test scripts/section-roles-conformance.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkSectionRoles } from './section-roles-conformance.mjs';

const contract = { formRoleIds: [57] };
const layoutSlugs = new Set(['hero-split', 'old-gallery']);
const base = [
  { id: 2, slug: 'hero-header', name: 'Hero Header', generable: true, layouts: ['hero-split'] },
  { id: 57, slug: 'cta-form', name: 'CTA Form', generable: false, layouts: [], reason: 'form' },
];
const run = (roles, extra = {}) =>
  checkSectionRoles({ catalog: { roles }, contract, layoutSlugs, excludedSlugs: ['old-gallery'], ...extra });
const fails = (r) => r.filter((x) => x.level === 'fail').map((x) => x.msg);

describe('section-roles', () => {
  it('catálogo válido pasa', () => assert.deepEqual(fails(run(base)), []));

  it('rol generable sin layout falla', () => {
    const roles = [{ ...base[0], layouts: [] }, base[1]];
    assert.equal(fails(run(roles)).length, 1);
  });

  it('layout inexistente falla', () => {
    const roles = [{ ...base[0], layouts: ['no-existe'] }, base[1]];
    assert.match(fails(run(roles))[0], /inexistente/);
  });

  it('layout legacy no realiza un rol generable', () => {
    const roles = [{ ...base[0], layouts: ['old-gallery'] }, base[1]];
    assert.match(fails(run(roles))[0], /legacy/);
  });

  it('rol de formulario generable viola D2', () => {
    const roles = [base[0], { ...base[1], generable: true, layouts: ['hero-split'], reason: undefined }];
    assert.match(fails(run(roles)).join(), /D2/);
  });

  it('ids duplicados fallan', () => {
    assert.match(fails(run([base[0], { ...base[0], slug: 'otro' }, base[1]]))[0], /duplicado/);
  });

  it('el gap se reporta como nota, no como fallo', () => {
    const roles = [...base, { id: 64, slug: 'gallery', name: 'Gallery', generable: false, layouts: [], reason: 'sin-layout' }];
    const r = run(roles);
    assert.deepEqual(fails(r), []);
    assert.ok(r.some((x) => x.level === 'note' && /Gallery/.test(x.msg)));
  });

  it('copia publicada distinta de la fuente falla', () => {
    assert.match(fails(run(base, { publishedText: 'a', sourceText: 'b' }))[0], /difiere/);
    assert.deepEqual(fails(run(base, { publishedText: 'a', sourceText: 'a' })), []);
  });

  it('arquetipos: slugs inexistentes o no generables, min>max y herencia', () => {
    const home = { slug: 'home', min: 1, max: 2, required: ['hero-header'], order: ['hero-header'] };
    const arch = (list, def = 'home') =>
      run(base, { catalog: { roles: base, defaultArchetype: def, archetypes: list } });
    assert.deepEqual(fails(arch([home, { slug: 'landing', extends: 'home', min: 1 }])), []);
    assert.match(fails(arch([{ ...home, order: ['nope'] }]))[0], /no existe/);
    assert.match(fails(arch([{ ...home, required: ['cta-form'] }]))[0], /no es generable/);
    assert.match(fails(arch([{ ...home, min: 5 }]))[0], /min/);
    assert.match(fails(arch([{ slug: 'landing', extends: 'home' }], 'landing')).join(), /extends/);
    assert.match(fails(arch([home], 'otro'))[0], /defaultArchetype/);
  });
});
