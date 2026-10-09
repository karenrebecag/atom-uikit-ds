/**
 * Skill del canal. Run: node --test scripts/skill-conformance.test.mjs
 * Un test por comportamiento: la skill no puede mentir sobre el DS ni crecer sin que alguien lo decida.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkSkill } from './skill-conformance.mjs';
import { applyChecklist, renderChecklist } from './build-skill-checklist.mjs';

const contract = {
  layers: [
    { layer: 'entrada', file: 'SKILL.md', max: 20 },
    { layer: 'bloques', file: 'bloques.md', max: 20, generated: true },
    { layer: 'marca', file: 'marca.md', max: 20 },
    { layer: 'cierre', file: 'cierre.md', max: 30 },
  ],
  examples: [],
  delegates: ['atom_uikit_finalize'],
  repeatableRules: ['no-forms'],
  maxFilesPerRepeatableRule: 3,
  maxClassCitationsPerLine: 2,
};
const checks = { tool: 'atom_uikit_finalize', checks: [{ id: 'no-forms', mide: 'ningun form', arregla: 'usa wa.me' }] };

const cierreBase = () =>
  applyChecklist('# Cierre\nDelega en atom_uikit_finalize.\n<!-- contable:start -->\n<!-- contable:end -->\n## Mitad de criterio\n', checks);

const base = () => ({
  'SKILL.md': '# Skill\n[bloques](bloques.md) [marca](marca.md) [cierre](cierre.md)\n',
  'bloques.md': 'GEN',
  'marca.md': '# Marca\nUsa `.bg-dark` sobre secciones de IA.\n',
  'cierre.md': cierreBase(),
});

const ctx = {
  pathExists: (p) => p === 'docs/real.md',
  classExists: (c) => c === 'bg-dark' || c === 'section',
  tokenExists: (t) => t === '--spacing-4',
  layouts: new Set(['layout/hero-split']),
  hooks: new Set(['text-reveal']),
  exemplars: new Set(['hero-split']),
};

const run = (files, over = {}) =>
  checkSkill({ files, contract: { ...contract, ...over.contract }, checks: over.checks ?? checks, blocksGenerated: 'GEN', ctx });
const has = (errors, re) => assert.match(errors.join('\n'), re);

describe('checkSkill', () => {
  it('una skill coherente no tiene errores', () => {
    assert.deepEqual(run(base()), []);
  });

  it('falla nombrando archivo y linea si cita una clase que el DS no publica (bg-violet-soft)', () => {
    const f = base();
    f['marca.md'] += 'Usa `.bg-violet-soft` para el tono suave.\n';
    has(run(f), /skillReferencesResolve: marca\.md:3: la clase \.bg-violet-soft/);
  });

  it('falla si cita un behavior o una ruta inexistentes', () => {
    const f = base();
    f['marca.md'] += '`hook:fade-suave` y `docs/nada.md`\n';
    has(run(f), /behavior fade-suave/);
    has(run(f), /ruta docs\/nada\.md/);
  });

  it('falla si bloques.md se edita a mano', () => {
    const f = base();
    f['bloques.md'] = 'GEN editado';
    has(run(f), /skillBlocksGenerated/);
  });

  it('falla si un ejemplo usa un bloque sin .exemplar.ts', () => {
    const f = { ...base(), 'ejemplos/a.md': 'Region: `layout/hero-split` y `layout/otro`' };
    f['SKILL.md'] += '[a](ejemplos/a.md)\n';
    const c = { ...ctx, layouts: new Set(['layout/hero-split', 'layout/otro']) };
    const errors = checkSkill({ files: f, contract: { ...contract, examples: ['ejemplos/a.md'] }, checks, blocksGenerated: 'GEN', ctx: c });
    has(errors, /skillExamplesUseExemplars: ejemplos\/a\.md.*layout\/otro/);
  });

  it('falla si una capa excede su presupuesto o la entrada no la enlaza', () => {
    const f = base();
    f['marca.md'] += 'x\n'.repeat(30);
    has(run(f), /skillLayerBudget: marca\.md/);
    f['SKILL.md'] = '# Skill\n[bloques](bloques.md) [cierre](cierre.md)\n';
    has(run(f), /no enlaza marca\.md/);
  });

  it('falla si cierre no delega en la tool de finalize', () => {
    const f = base();
    f['cierre.md'] = f['cierre.md'].replace('atom_uikit_finalize', 'otra');
    has(run(f), /skillChecklistDelegates/);
  });

  it('falla si una capa trae markup de formulario, pero no si lo nombra entre backticks', () => {
    const f = base();
    f['marca.md'] += 'Nunca un `<form>`.\n';
    assert.deepEqual(run(f), []);
    f['marca.md'] += '```html\n<form></form>\n```\n';
    has(run(f), /skillNoForms: marca\.md/);
  });

  it('falla si una regla se repite fuera de las dos permitidas', () => {
    const f = base();
    f['marca.md'] += '<!-- regla: gradiente -->\n';
    f['SKILL.md'] += '<!-- regla: gradiente -->\n';
    has(run(f), /skillOneRuleOneFile.*gradiente/);
  });

  it('falla si la mitad contable se edita a mano o una linea no tiene id', () => {
    const f = base();
    f['cierre.md'] = f['cierre.md'].replace('ningun form', 'algo distinto');
    has(run(f), /skillChecklistGenerated/);
    f['cierre.md'] = f['cierre.md'].replace('<!-- contable:end -->', '- [ ] linea suelta\n<!-- contable:end -->');
    has(run(f), /sin id del registro/);
  });

  it('falla con ids duplicados en el registro', () => {
    const dup = { tool: 'x', checks: [...checks.checks, ...checks.checks] };
    assert.throws(() => renderChecklist(dup), /duplicados/);
  });

  it('falla si una linea lista 3 clases a mano', () => {
    const f = base();
    f['marca.md'] += 'Fondos: `.bg-dark`, `.section`, `.bg-dark`.\n';
    has(run(f), /skillVocabularyFromDS/);
  });
});
