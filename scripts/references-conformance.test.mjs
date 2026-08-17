/**
 * Integridad referencial — fixtures sinteticas de la seccion `references`.
 * Run: node --test scripts/references-conformance.test.mjs
 *
 * Cada caso viene de la auditoria 2026-08-17: los que DEBEN fallar son defectos
 * reales del repo, y los que NO deben marcarse son los cuatro falsos positivos
 * que produjo la sonda antes de afinar las reglas. Un gate que no falla con un
 * bug conocido no es un gate (conformance/README.md).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  baselineCount,
  collectPublishedClasses,
  documentedInFile,
  findDanglingRegistry,
  findStaleContractEntries,
  findUncoveredEntries,
  findUnreachableClasses,
  findUnresolvedVars,
  indexTokenLeaves,
  isDynamicallyEmitted,
  parseEntryGlobs,
  resolvesToToken,
  runReferenceChecks,
  staleBaselines,
  tokenPathCandidates,
} from './references-conformance.mjs';

// --- io falso en memoria: los checks no deben necesitar disco para testearse ---

function fakeIo(tree) {
  const files = new Map(Object.entries(tree));
  const dirs = new Set();
  for (const file of files.keys()) {
    const parts = file.split('/');
    for (let i = 1; i < parts.length; i++) dirs.add(parts.slice(0, i).join('/'));
  }
  return {
    existsSync: (p) => files.has(p) || dirs.has(p),
    readdirSync: (p) => {
      const out = new Set();
      for (const entry of [...files.keys(), ...dirs]) {
        if (!entry.startsWith(`${p}/`)) continue;
        out.add(entry.slice(p.length + 1).split('/')[0]);
      }
      return [...out];
    },
    statSync: (p) => ({ isDirectory: () => dirs.has(p) }),
    readFileSync: (p) => {
      if (!files.has(p)) throw new Error(`ENOENT ${p}`);
      return files.get(p);
    },
  };
}

const fakePath = {
  join: (...parts) => parts.filter(Boolean).join('/').replace(/\/{2,}/g, '/'),
  relative: (from, to) => (to.startsWith(`${from}/`) ? to.slice(from.length + 1) : to),
  dirname: (p) => (p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '.'),
};

const TOKENS = JSON.stringify({
  color: {
    $type: 'color',
    sky: {
      500: { $value: '#38bdf8' },
      700: { $value: '#0369a1' },
    },
  },
});

const SEMANTIC = JSON.stringify({
  primary: { $type: 'color', $value: '{color.neutral.950}' },
  'muted-foreground': { $type: 'color', $value: '{color.neutral.500}' },
});

const varsRule = {
  scanDirs: ['css'],
  definitionSources: ['css', 'tokens'],
  fallbackIsKnob: true,
  runtimeProvided: {},
  baseline: {},
};

function varsCtx(cssTree, rule = varsRule) {
  const io = fakeIo({
    'r/tokens/primitives/colors.json': TOKENS,
    'r/tokens/semantic/light.json': SEMANTIC,
    ...Object.fromEntries(Object.entries(cssTree).map(([k, v]) => [`r/css/${k}`, v])),
  });
  return findUnresolvedVars(rule, { fs: io, path: fakePath, root: 'r' });
}

const namesIn = (result, file) => [...(result.perFile.get(file)?.keys() ?? [])];

// ---------------------------------------------------------------------------

describe('resolver de tokens (R1)', () => {
  it('indexa solo las hojas con $value, no los grupos', () => {
    const io = fakeIo({ 'p/colors.json': TOKENS });
    const leaves = indexTokenLeaves(['p/colors.json'], io);
    assert.ok(leaves.has('color.sky.500'));
    assert.ok(!leaves.has('color.sky'), 'un grupo no es un token');
    assert.ok(!leaves.has('color'));
  });

  it('prueba cada frontera del nombre como punto o guion', () => {
    const candidates = tokenPathCandidates('--color-sky-500');
    assert.ok(candidates.includes('color.sky.500'));
    assert.ok(candidates.includes('color-sky-500'));
    assert.equal(candidates.length, 4);
  });

  it('resuelve --color-sky-500 y rechaza --color-sky', () => {
    const io = fakeIo({ 'p/colors.json': TOKENS });
    const leaves = indexTokenLeaves(['p/colors.json'], io);
    assert.equal(resolvesToToken('--color-sky-500', leaves), true);
    assert.equal(resolvesToToken('--color-sky', leaves), false, 'el bug real de tag.css');
  });

  it('resuelve semanticos de un solo segmento y con guion', () => {
    const io = fakeIo({ 'p/light.json': SEMANTIC });
    const leaves = indexTokenLeaves(['p/light.json'], io);
    assert.equal(resolvesToToken('--primary', leaves), true);
    assert.equal(resolvesToToken('--muted-foreground', leaves), true);
  });
});

describe('var() sin resolver (R1)', () => {
  it('marca la var que no existe en ninguna capa', () => {
    const result = varsCtx({ 'player.css': '.p { color: var(--player-accent); }' });
    assert.deepEqual(namesIn(result, 'player.css'), ['--player-accent']);
  });

  it('cuenta los usos, no solo los nombres', () => {
    const result = varsCtx({
      'player.css': '.a { color: var(--player-accent); } .b { fill: var(--player-accent); }',
    });
    assert.equal(result.perFile.get('player.css').get('--player-accent'), 2);
  });

  it('no marca la que se define en el propio CSS', () => {
    const result = varsCtx({
      'local.css': ':root { --local-gap: 4px; } .a { gap: var(--local-gap); }',
    });
    assert.equal(result.perFile.size, 0);
  });

  it('acepta @property como definicion', () => {
    const result = varsCtx({
      'prop.css': '@property --spin { syntax: "<angle>"; } .a { rotate: var(--spin); }',
    });
    assert.equal(result.perFile.size, 0);
  });

  it('no marca la que tiene fallback: un fallback es contrato con el consumidor', () => {
    const result = varsCtx({ 'knob.css': '.a { top: var(--anchor-offset, 0px); }' });
    assert.equal(result.perFile.size, 0);
  });

  it('si verifica la var interna de un fallback anidado', () => {
    const result = varsCtx({ 'nested.css': '.a { color: var(--x, var(--y-inexistente)); }' });
    assert.deepEqual(namesIn(result, 'nested.css'), ['--y-inexistente']);
  });

  it('no marca la que declara runtimeProvided', () => {
    const rule = { ...varsRule, runtimeProvided: { '--char': 'GSAP SplitText propIndex' } };
    const result = varsCtx({ 'swap.css': '.c { transition-delay: calc(var(--char) * 1ms); }' }, rule);
    assert.equal(result.perFile.size, 0);
  });

  it('ignora lo que vive en comentarios', () => {
    const result = varsCtx({ 'doc.css': '/* usa var(--inventada) */ .a { color: var(--primary); }' });
    assert.equal(result.perFile.size, 0);
  });

  it('se salta el check sin fallar cuando el checkout no trae los JSON de tokens', () => {
    const io = fakeIo({ 'r/css/a.css': '.a { color: var(--lo-que-sea); }' });
    const result = findUnresolvedVars(varsRule, { fs: io, path: fakePath, root: 'r' });
    assert.ok(result.skipped, 'sin tokens no se puede afirmar que algo falta');
  });
});

describe('clases alcanzables (R2)', () => {
  const rule = {
    scanDirs: ['css/components'],
    emitterDirs: ['react'],
    dynamicPrefixes: true,
    baseline: {},
  };
  const run = (css, react, registry = { items: [] }) =>
    findUnreachableClasses(
      rule,
      registry,
      {
        fs: fakeIo({ 'r/css/components/x.css': css, 'r/react/X.tsx': react }),
        path: fakePath,
        root: 'r',
      },
    );

  it('marca la clase que nadie emite ni publica, con su pista de intencion', () => {
    const result = run('.card--brand { color: red; }', 'export const X = () => null;');
    assert.deepEqual(result.perFile.get('x.css'), [{ cls: 'card--brand', documented: false }]);
  });

  it('no marca la que un emisor escribe literal', () => {
    const result = run('.card--brand {}', '<div className="card--brand" />');
    assert.equal(result.perFile.size, 0);
  });

  it('no marca la construida con template literal: corta en el ULTIMO separador', () => {
    const result = run(
      '.stats-card__trend--up {} .stats-card__trend--down {}',
      'cn(`stats-card__trend--${trend}`)',
    );
    assert.equal(result.perFile.size, 0, 'cortar en el primer separador daba 13 falsos positivos');
  });

  it('no confunde un prefijo parcial con emision dinamica', () => {
    assert.equal(isDynamicallyEmitted('stats-card__trend--up', 'cn(`stats-card__${x}`)'), false);
    assert.equal(isDynamicallyEmitted('stats-card__trend--up', 'cn(`stats-card__trend--${x}`)'), true);
  });

  it('acepta como API la que el registry publica en cssClasses', () => {
    const registry = { items: [{ atom: { implementation: { cssClasses: ['card--brand'] } } }] };
    const result = run('.card--brand {}', 'export const X = () => null;', registry);
    assert.equal(result.perFile.size, 0);
  });

  it('lee cssClasses de todos los items', () => {
    const published = collectPublishedClasses({
      items: [
        { atom: { implementation: { cssClasses: ['a', 'b'] } } },
        { atom: { implementation: { cssClasses: ['c'] } } },
        { name: 'sin-atom' },
      ],
    });
    assert.deepEqual([...published].sort(), ['a', 'b', 'c']);
  });
});

describe('entry de tsup (R3)', () => {
  const rule = { config: 'tsup.config.ts', sourceDir: 'src' };
  const CONFIG = "export default { entry: ['src/index.ts', 'src/atoms/*.tsx'] };";

  it('lee los globs del entry', () => {
    assert.deepEqual(parseEntryGlobs(CONFIG), ['src/index.ts', 'src/atoms/*.tsx']);
  });

  it('pasa cuando cada subdirectorio con .tsx tiene su glob', () => {
    const io = fakeIo({ 'r/tsup.config.ts': CONFIG, 'r/src/atoms/Button.tsx': 'x' });
    const result = findUncoveredEntries(rule, { fs: io, path: fakePath, root: 'r' });
    assert.deepEqual(result.uncovered, []);
  });

  it('marca el subdirectorio nuevo sin glob: la leccion de sidebar', () => {
    const io = fakeIo({
      'r/tsup.config.ts': CONFIG,
      'r/src/atoms/Button.tsx': 'x',
      'r/src/molecules/sidebar/Sidebar.tsx': 'x',
    });
    const result = findUncoveredEntries(rule, { fs: io, path: fakePath, root: 'r' });
    assert.deepEqual(result.uncovered, ['src/molecules/sidebar']);
  });
});

describe('el hallazgo obliga a declarar un remedio, no lo adivina', () => {
  const rule = { scanDirs: ['css/components'], emitterDirs: ['react'], dynamicPrefixes: true, baseline: {} };
  const build = (css, registry = { items: [] }, baseline = {}) => {
    const io = fakeIo({ 'r/css/components/x.css': css, 'r/react/X.tsx': 'export const X = () => null;' });
    const contract = {
      varsResolve: { scanDirs: ['none'], definitionSources: [], runtimeProvided: {}, baseline: {} },
      classesReachable: { ...rule, baseline },
      entryCoversSource: { config: 'nope' },
    };
    return runReferenceChecks({ contract, registry, root: 'r' }, io, fakePath);
  };
  const messages = (res, level) => res.reports.filter((r) => r.level === level).map((r) => r.message);

  it('distingue la clase documentada en el archivo de la que no lo esta', () => {
    assert.equal(documentedInFile('/* usa .card--brand para la variante */\n.card--brand {}', 'card--brand'), true);
    assert.equal(documentedInFile('.card--brand {}', 'card--brand'), false);
  });

  it('el hallazgo dice "sin declarar", nunca "muerta", y sugiere publish si esta documentada', () => {
    const res = build('/* El landing escribe .card--brand a mano */\n.card--brand {}');
    const fail = messages(res, 'fail').join(' ');
    assert.match(fail, /sin declarar/);
    assert.doesNotMatch(fail, /muerta|inalcanzable/);
    assert.match(fail, /probablemente API, resolution "publish"/);
  });

  it('rechaza el baseline sin remedio: es el que se malinterpreta', () => {
    const res = build('.card--brand {}', { items: [] }, { 'x.css': 1 });
    assert.match(messages(res, 'fail').join(' '), /baseline sin remedio/);
  });

  it('rechaza un remedio que no esta en la lista cerrada', () => {
    const res = build('.card--brand {}', { items: [] }, { 'x.css': { count: 1, resolution: 'ya-veremos' } });
    assert.match(messages(res, 'fail').join(' '), /resolution "ya-veremos" no existe/);
  });

  it('exige fecha a triage: una decision sin fecha no se toma', () => {
    const res = build('.card--brand {}', { items: [] }, { 'x.css': { count: 1, resolution: 'triage', why: 'x' } });
    assert.match(messages(res, 'fail').join(' '), /"triage" exige until/);
  });

  it('publish sin publicar falla: el remedio no se puede declarar y olvidar', () => {
    const res = build('.card--brand {}', { items: [] }, { 'x.css': { count: 1, resolution: 'publish', why: 'API' } });
    assert.match(messages(res, 'fail').join(' '), /declara resolution "publish" pero 1 clase sigue fuera/);
  });

  it('publish cumplido pasa en verde', () => {
    const registry = { items: [{ atom: { implementation: { cssClasses: ['card--brand'] } } }] };
    const res = build('.card--brand {}', registry, { 'x.css': { count: 1, resolution: 'publish', why: 'API' } });
    assert.equal(res.failures, 0);
  });
});

describe('registry sin colgar (R4)', () => {
  const ctx = (tree) => ({ fs: fakeIo(tree), path: fakePath, root: 'r' });

  it('marca el item que apunta a un archivo borrado', () => {
    const registry = {
      items: [{ name: 'video-player', files: [{ sourcePath: 'css/video-player.css' }] }],
    };
    const result = findDanglingRegistry(registry, ctx({ 'r/css/otro.css': 'x' }));
    assert.deepEqual(result.missingFiles, ['video-player → css/video-player.css']);
  });

  it('pasa cuando el archivo existe', () => {
    const registry = { items: [{ name: 'tag', files: [{ sourcePath: 'css/tag.css' }] }] };
    const result = findDanglingRegistry(registry, ctx({ 'r/css/tag.css': 'x' }));
    assert.deepEqual(result.missingFiles, []);
  });

  it('marca la registryDependency que ya no es un item', () => {
    const registry = {
      items: [{ name: 'hero', files: [], registryDependencies: ['tokens', 'video-player'] }, { name: 'tokens', files: [] }],
    };
    const result = findDanglingRegistry(registry, ctx({ 'r/x': 'x' }));
    assert.deepEqual(result.missingDeps, ['hero → "video-player"']);
  });

  it('deja pasar las dependencias externas por url', () => {
    const registry = { items: [{ name: 'x', files: [], registryDependencies: ['https://ui.shadcn.com/r/button.json'] }] };
    assert.deepEqual(findDanglingRegistry(registry, ctx({ 'r/x': 'x' })).missingDeps, []);
  });
});

describe('contratos y mapas sin colgar (R5)', () => {
  const registry = { items: [{ name: 'layout/hero' }] };

  it('marca la clave de baseline cuyo archivo se borro', () => {
    const io = fakeIo({
      'r/conformance/css-contract.json': JSON.stringify({
        baseline: { 'molecules/vive.css': {}, 'molecules/video-player.css': {} },
      }),
      'r/css/components/molecules/vive.css': 'x',
    });
    const rule = {
      filePaths: [{ file: 'conformance/css-contract.json', at: ['baseline'], relativeTo: 'css/components' }],
    };
    const stale = findStaleContractEntries(rule, registry, { fs: io, path: fakePath, root: 'r' });
    assert.equal(stale.length, 1);
    assert.match(stale[0], /video-player\.css/);
  });

  it('marca la exencion que nombra un item que ya no existe', () => {
    const io = fakeIo({
      'r/conformance/layout-contract.json': JSON.stringify({
        deprecated: { layouts: ['layout/hero', 'layout/borrado'] },
      }),
    });
    const rule = {
      itemNames: [{ file: 'conformance/layout-contract.json', at: ['deprecated.layouts'] }],
    };
    const stale = findStaleContractEntries(rule, registry, { fs: io, path: fakePath, root: 'r' });
    assert.equal(stale.length, 1);
    assert.match(stale[0], /layout\/borrado/);
  });

  it('marca el mapa slug→modulo que apunta a un behavior borrado, traduciendo la extension', () => {
    const io = fakeIo({
      'r/scripts/dom-contract.mjs': "const M = { sidebar: 'sidebar.js', 'video-player': 'video-player.js' };",
      'r/animations/sidebar.ts': 'x',
    });
    const rule = {
      modulePaths: [{
        file: 'scripts/dom-contract.mjs',
        extensions: ['.js'],
        rewriteExtension: '.ts',
        relativeTo: 'animations',
      }],
    };
    const stale = findStaleContractEntries(rule, registry, { fs: io, path: fakePath, root: 'r' });
    assert.deepEqual(stale, ['scripts/dom-contract.mjs: apunta a video-player.ts, que ya no existe en animations']);
  });

  it('no confunde una extension suelta con un modulo', () => {
    const io = fakeIo({ 'r/s.ts': "const ext = '.ts'; const m = 'sidebar.ts';", 'r/animations/sidebar.ts': 'x' });
    const rule = { modulePaths: [{ file: 's.ts', extensions: ['.ts'], relativeTo: 'animations' }] };
    assert.deepEqual(findStaleContractEntries(rule, registry, { fs: io, path: fakePath, root: 'r' }), []);
  });
});

describe('baseline y deuda declarada', () => {
  it('acepta el numero suelto y la forma con razon', () => {
    assert.equal(baselineCount(6), 6);
    assert.equal(baselineCount({ count: 6, why: 'x' }), 6);
    assert.equal(baselineCount(undefined), 0);
  });

  it('el baseline tolera la deuda existente y sigue frenando la nueva', () => {
    const io = fakeIo({
      'r/tokens/primitives/colors.json': TOKENS,
      'r/css/deuda.css': '.a { color: var(--vieja); }',
      'r/css/nueva.css': '.b { color: var(--nueva); }',
    });
    const rule = { ...varsRule, baseline: { 'deuda.css': { count: 1, resolution: 'triage', why: 'declarada', until: '2027-01-01' } } };
    const result = findUnresolvedVars(rule, { fs: io, path: fakePath, root: 'r' });
    assert.equal(result.perFile.get('deuda.css').size, 1);
    assert.equal(result.perFile.get('nueva.css').size, 1);

    const contract = { varsResolve: rule, classesReachable: { scanDirs: ['css/none'], emitterDirs: [], baseline: {} }, entryCoversSource: { config: 'nope' } };
    const { reports } = runReferenceChecks({ contract, registry: { items: [] }, root: 'r' }, io, fakePath);
    const fails = reports.filter((r) => r.level === 'fail').map((r) => r.message);
    assert.equal(fails.length, 1);
    assert.match(fails[0], /nueva\.css/);
  });

  it('avisa de bajar el baseline cuando el archivo se limpia del todo', () => {
    const io = fakeIo({
      'r/tokens/primitives/colors.json': TOKENS,
      'r/css/limpio.css': '.a { color: var(--primary); }',
      'r/tokens/semantic/light.json': SEMANTIC,
    });
    const contract = {
      varsResolve: { ...varsRule, baseline: { 'limpio.css': { count: 2, resolution: 'triage', why: 'deuda vieja', until: '2027-01-01' } } },
      classesReachable: { scanDirs: ['css/none'], emitterDirs: [], baseline: {} },
      entryCoversSource: { config: 'nope' },
    };
    const { reports, failures } = runReferenceChecks({ contract, registry: { items: [] }, root: 'r' }, io, fakePath);
    assert.equal(failures, 0);
    assert.ok(reports.some((r) => /limpio\.css: bajó a 0/.test(r.message)), 'sin esto el baseline se queda arriba para siempre');
  });

  it('avisa del baseline que apunta a un archivo borrado', () => {
    assert.deepEqual(staleBaselines(['a.css'], { 'a.css': 1, 'borrado.css': 6 }), ['borrado.css']);
  });

  it('el baseline huerfano de un componente borrado es nota, no silencio', () => {
    const io = fakeIo({
      'r/tokens/primitives/colors.json': TOKENS,
      'r/css/vive.css': '.a { color: var(--color-sky-500); }',
    });
    const contract = {
      varsResolve: { ...varsRule, baseline: { 'molecules/video-player.css': { count: 6, why: 'componente borrado' } } },
      classesReachable: { scanDirs: ['css/none'], emitterDirs: [], baseline: {} },
      entryCoversSource: { config: 'nope' },
    };
    const { reports } = runReferenceChecks({ contract, registry: { items: [] }, root: 'r' }, io, fakePath);
    assert.ok(reports.some((r) => /video-player\.css: baseline obsoleto/.test(r.message)));
  });

  it('un baseline vencido es nota, nunca fallo: vencerlo es una decision', () => {
    const io = fakeIo({
      'r/tokens/primitives/colors.json': TOKENS,
      'r/css/deuda.css': '.a { color: var(--vieja); }',
    });
    const contract = {
      varsResolve: {
        ...varsRule,
        baseline: { 'deuda.css': { count: 1, resolution: 'triage', why: 'pendiente', until: '2026-01-01' } },
      },
      classesReachable: { scanDirs: ['css/none'], emitterDirs: [], baseline: {} },
      entryCoversSource: { config: 'nope' },
    };
    const { reports, failures } = runReferenceChecks(
      { contract, registry: { items: [] }, root: 'r' },
      io,
      fakePath,
      new Date('2026-08-17'),
    );
    assert.equal(failures, 0);
    assert.ok(reports.some((r) => r.check === 'debt' && /vencido el 2026-01-01/.test(r.message)));
  });
});
