#!/usr/bin/env node
/**
 * Conformance suite — ejecuta el contrato de conformance/*.json.
 *
 *   node scripts/conformance.mjs            # todo
 *   node scripts/conformance.mjs tokens     # tokens | css | layouts | registry | budgets
 *
 * El runner es deliberadamente tonto: las reglas y sus valores viven en los JSON
 * de conformance/ (modelo Willison: el contrato es data). Ver conformance/README.md.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = resolve(import.meta.dirname, '..');
const CONF = join(ROOT, 'conformance');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

let failures = 0;
let notes = 0;
const fail = (section, msg) => {
  failures++;
  console.error(`  FAIL  [${section}] ${msg}`);
};
const note = (section, msg) => {
  notes++;
  console.log(`  nota  [${section}] ${msg}`);
};
const ok = (section, msg) => console.log(`  OK    [${section}] ${msg}`);

function* walkFiles(dir, ext) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walkFiles(full, ext);
    else if (entry.endsWith(ext)) yield full;
  }
}

// ---------------------------------------------------------------------------
// tokens — leyes de escala
// ---------------------------------------------------------------------------

function checkScale(contract) {
  const { base, ratio, precision, file, category } = contract;
  const data = readJson(join(ROOT, file))[category];
  const bad = [];
  for (const [key, def] of Object.entries(data)) {
    if (key.startsWith('$')) continue;
    const px = parseFloat(String(def.$value ?? def.value));
    // ¿px == base * ratio^n para algún n entero? (redondeado a la precisión del contrato)
    let hit = false;
    for (let n = -12; n <= 12; n++) {
      if (Math.abs(px - Number((base * ratio ** n).toFixed(precision))) < 0.005) hit = true;
    }
    if (!hit) bad.push(`${category}.${key}=${px}px`);
  }
  return bad;
}

function sectionTokens() {
  const contract = readJson(join(CONF, 'token-contract.json'));
  const exceptions = contract.exceptions?.tokens ?? {};

  for (const scale of ['typography', 'rhythm']) {
    const bad = checkScale(contract[scale]).filter((t) => !(t.split('=')[0] in exceptions));
    if (bad.length) fail('tokens', `${scale} fuera de ley (${contract[scale].law}): ${bad.join(', ')}`);
    else ok('tokens', `${scale}: escala en ley (${contract[scale].base}·${contract[scale].ratio}ⁿ)`);
  }

  const sp = contract.spacing;
  const data = readJson(join(ROOT, sp.file))[sp.category];
  const bad = [];
  for (const [key, def] of Object.entries(data)) {
    if (key.startsWith('$')) continue;
    const px = parseFloat(String(def.$value ?? def.value));
    if (px % sp.multipleOf !== 0 && !(`${sp.category}.${key}` in exceptions)) {
      bad.push(`${sp.category}.${key}=${px}px`);
    }
  }
  if (bad.length) fail('tokens', `spacing fuera de retícula base-${sp.multipleOf}: ${bad.join(', ')}`);
  else ok('tokens', `spacing: retícula base-${sp.multipleOf}`);
}

// ---------------------------------------------------------------------------
// css — contrato del CSS de componentes, con baseline ratchet
// ---------------------------------------------------------------------------

function countRule(src, rule) {
  if (rule.pattern) return (src.match(new RegExp(rule.pattern, 'g')) ?? []).length;
  // declaration: cuenta declaraciones cuyo valor no sea var()/inherit
  let n = 0;
  for (const m of src.matchAll(new RegExp(`${rule.declaration}:\\s*([^;}]+)`, 'g'))) {
    const v = m[1].trim();
    if (!v.startsWith('var(') && v !== 'inherit') n++;
  }
  return n;
}

function sectionCss() {
  const contract = readJson(join(CONF, 'css-contract.json'));
  let clean = 0;
  for (const dir of contract.scanDirs) {
    for (const file of walkFiles(join(ROOT, dir), '.css')) {
      const rel = relative(join(ROOT, dir), file);
      if (contract.exemptFiles[rel]) continue;
      const src = stripComments(readFileSync(file, 'utf8'));
      const baseline = contract.baseline[rel] ?? {};
      let dirty = false;
      for (const [name, rule] of Object.entries(contract.rules)) {
        const n = countRule(src, rule);
        const allowed = baseline[name] ?? 0;
        if (n > allowed) {
          dirty = true;
          fail('css', `${rel}: ${name} ${n} > baseline ${allowed} — ${rule.why}`);
        } else if (n < allowed) {
          note('css', `${rel}: ${name} bajó a ${n} (baseline ${allowed}) — baja el baseline en css-contract.json`);
        }
      }
      if (!dirty) clean++;
    }
  }
  ok('css', `${clean} archivos dentro de contrato`);
}

// ---------------------------------------------------------------------------
// layouts — structure-only, clases existentes, slots, deps, display
// ---------------------------------------------------------------------------

async function evalModule(source) {
  const tmpDir = join(ROOT, 'node_modules', '.conformance-tmp');
  mkdirSync(tmpDir, { recursive: true });
  const tmp = join(tmpDir, `m-${Math.random().toString(36).slice(2)}.mjs`);
  writeFileSync(tmp, source);
  try {
    return Object.values(await import(pathToFileURL(tmp).href))[0];
  } finally {
    rmSync(tmp, { force: true });
  }
}

function dsCssSource() {
  let all = '';
  for (const file of walkFiles(join(ROOT, 'packages/css/src'), '.css')) all += readFileSync(file, 'utf8');
  return all;
}

/** Divide CSS en reglas planas { prelude, body } (recorre @media por dentro). */
function cssRules(css, out = []) {
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open === -1) break;
    let depth = 0;
    let end = open;
    for (let j = open; j < css.length; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}' && --depth === 0) {
        end = j;
        break;
      }
    }
    const prelude = css.slice(i, open).trim();
    const body = css.slice(open + 1, end);
    if (prelude.startsWith('@') && body.includes('{')) cssRules(body, out);
    else out.push({ prelude, body });
    i = end + 1;
  }
  return out;
}

async function sectionLayouts() {
  const contract = readJson(join(CONF, 'layout-contract.json'));
  const registry = readJson(join(ROOT, 'registry.json'));
  const exempt = new Set([
    ...(contract.deprecated?.layouts ?? []),
    ...(contract.legacy?.layouts ?? []),
  ]);
  const ds = dsCssSource();
  const extraClasses = new Set(contract.rules.classesExist.extraAllowed.classes);
  const displayMap = contract.rules.componentDisplay.map;
  const slotRe = new RegExp(contract.rules.slots.slotPattern);
  let checked = 0;

  for (const item of registry.items.filter((i) => i.kind === 'layout')) {
    if (exempt.has(item.name)) continue;
    const src = readFileSync(join(ROOT, item.files[0].sourcePath), 'utf8');
    let mod;
    try {
      mod = await evalModule(src);
    } catch (e) {
      fail('layouts', `${item.name}: el módulo no evalúa (${e.message})`);
      continue;
    }
    checked++;
    const slug = item.name.split('/').pop();

    // structure-only sobre el css del layout
    const css = stripComments(mod.css ?? '');
    for (const [name, pattern] of Object.entries(contract.rules.structureOnly.forbidInCss)) {
      const m = css.match(new RegExp(pattern, 'g'));
      if (m) fail('layouts', `${item.name}: css con ${name} (${m.length}×) — ${contract.rules.structureOnly.why}`);
    }

    // clases del html existen
    const html = mod.html ?? '';
    const classes = new Set(
      [...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean)
    );
    for (const cls of classes) {
      if (cls.startsWith('l-')) {
        if (cls !== `l-${slug}` && !cls.startsWith(`l-${slug}__`) && !cls.startsWith(`l-${slug}--`))
          fail('layouts', `${item.name}: clase de otro layout en el html: ${cls}`);
        continue;
      }
      if (ds.includes(`.${cls}`) || extraClasses.has(cls)) continue;
      // Parte/modificador BEM sin regla propia: tolerado si su BLOQUE existe
      // (hooks semánticos como pricing-card__divider). El typo de bloque sí cae.
      const base = cls.split(/__|--/)[0];
      if (base !== cls && ds.includes(`.${base}`)) continue;
      fail('layouts', `${item.name}: clase fantasma "${cls}" — no existe en packages/css/src`);
    }

    // slots bien formados
    for (const m of html.matchAll(/\{\{([^}]*)\}\}/g)) {
      if (!slotRe.test(m[1])) fail('layouts', `${item.name}: slot malformado {{${m[1]}}}`);
    }
    for (const m of html.matchAll(/data-repeat="([^"]*)"/g)) {
      if (!slotRe.test(m[1])) fail('layouts', `${item.name}: data-repeat malformado "${m[1]}"`);
    }

    // components[] cubierto por registryDependencies
    const deps = new Set(item.registryDependencies ?? []);
    const missing = (mod.components ?? []).filter((c) => !deps.has(c));
    if (missing.length)
      fail('layouts', `${item.name}: components sin declarar en registryDependencies: ${missing.join(', ')}`);

    // display sobre componentes: solo none o el display propio del átomo
    const rules = cssRules(css);
    for (const m of html.matchAll(/<\w+[^>]*class="([^"]+)"/g)) {
      const list = m[1].split(/\s+/);
      const layoutCls = list.filter((c) => c.startsWith('l-'));
      const comp = list.find((c) => c in displayMap);
      if (!comp || !layoutCls.length) continue;
      for (const rule of rules) {
        // limite de palabra: ".x" no debe matchear ".x-largo" (p.ej. __panel-link vs __panel-links)
        if (!layoutCls.some((c) => new RegExp(`\\.${c}(?![\\w-])`).test(rule.prelude))) continue;
        const d = rule.body.match(/display:\s*([\w-]+)/);
        if (d && d[1] !== 'none' && d[1] !== displayMap[comp])
          fail(
            'layouts',
            `${item.name}: "${rule.prelude}" pone display:${d[1]} sobre ${comp} (display propio: ${displayMap[comp]}) — ${contract.rules.componentDisplay.why}`
          );
      }
    }
  }
  ok('layouts', `${checked} layouts bajo contrato (${exempt.size} exentos: deprecated/legacy)`);
}

// ---------------------------------------------------------------------------
// registry — espejo y bidireccionalidad
// ---------------------------------------------------------------------------

function sectionRegistry() {
  const registry = readJson(join(ROOT, 'registry.json'));

  // Todo css de componente está registrado (no hay CSS huérfano sin canal)
  const registered = new Set(
    registry.items.flatMap((i) => i.files.map((f) => f.sourcePath))
  );
  const orphans = [];
  for (const file of walkFiles(join(ROOT, 'packages/css/src/components'), '.css')) {
    const rel = relative(ROOT, file);
    if (rel.endsWith('/index.css')) continue;
    if (!registered.has(rel)) orphans.push(rel);
  }
  if (orphans.length)
    fail('registry', `CSS de componente sin item en registry.json (no se distribuye): ${orphans.join(', ')}`);
  else ok('registry', 'todo CSS de componente tiene item en el registry');

  // public/r es espejo (si está generado)
  const pubDir = join(ROOT, 'public/r');
  if (existsSync(pubDir)) {
    const expected = new Set([
      ...registry.items.map((i) => `${i.name.replace(/\//g, '--')}.json`),
      'index.json',
      'tokens-nested.json',
    ]);
    const actual = readdirSync(pubDir).filter((f) => f.endsWith('.json'));
    const orphan = actual.filter((f) => !expected.has(f));
    const missing = [...expected].filter((f) => !actual.includes(f));
    if (orphan.length) fail('registry', `huérfanos en public/r: ${orphan.join(', ')} (corre build:registry)`);
    if (missing.length) fail('registry', `faltan en public/r: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '…' : ''} (corre build:registry)`);
    if (!orphan.length && !missing.length) ok('registry', `public/r espejo exacto (${actual.length} archivos)`);

    // artefactos de layout autodescriptivos
    const bare = registry.items.filter(
      (i) =>
        i.kind === 'layout' &&
        existsSync(join(pubDir, `${i.name.replace(/\//g, '--')}.json`)) &&
        !readJson(join(pubDir, `${i.name.replace(/\//g, '--')}.json`)).atom?.layout
    );
    if (bare.length) fail('registry', `layouts publicados sin atom.layout: ${bare.map((i) => i.name).join(', ')}`);
    else ok('registry', 'todos los layouts publicados llevan su contrato atom.layout');
  } else {
    note('registry', 'public/r no existe aún — corre build:registry para verificar el espejo');
  }
}

// ---------------------------------------------------------------------------
// budgets — peso de los artefactos que viajan a cada host
// ---------------------------------------------------------------------------

function sectionBudgets() {
  const budgets = readJson(join(CONF, 'budgets.json'));
  const kb = (n) => Math.round(n / 1024);

  for (const [file, limit] of Object.entries({ ...budgets.files, ...budgets.registry })) {
    if (file.startsWith('$')) continue;
    const abs = join(ROOT, file);
    if (!existsSync(abs)) {
      note('budgets', `${file} no existe (corre el build) — sin verificar`);
      continue;
    }
    const buf = readFileSync(abs);
    const raw = kb(buf.length);
    if (limit.rawKb && raw > limit.rawKb) fail('budgets', `${file}: ${raw}kb > budget ${limit.rawKb}kb raw`);
    if (limit.gzipKb) {
      const gz = kb(gzipSync(buf).length);
      if (gz > limit.gzipKb) fail('budgets', `${file}: ${gz}kb > budget ${limit.gzipKb}kb gzip`);
      else if (!limit.rawKb || raw <= limit.rawKb) ok('budgets', `${file}: ${raw}kb raw / ${gz}kb gz (budget ${limit.rawKb}/${limit.gzipKb})`);
    } else if (limit.rawKb && raw <= limit.rawKb) {
      ok('budgets', `${file}: ${raw}kb raw (budget ${limit.rawKb}kb)`);
    }
  }

  for (const [dir, limit] of Object.entries(budgets.directories)) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) {
      note('budgets', `${dir} no existe (corre el build) — sin verificar`);
      continue;
    }
    let total = 0;
    for (const f of readdirSync(abs)) total += statSync(join(abs, f)).size;
    if (kb(total) > limit.totalKb) fail('budgets', `${dir}: ${kb(total)}kb > budget ${limit.totalKb}kb`);
    else ok('budgets', `${dir}: ${kb(total)}kb (budget ${limit.totalKb}kb)`);
  }
}

// ---------------------------------------------------------------------------

const SECTIONS = {
  tokens: sectionTokens,
  css: sectionCss,
  layouts: sectionLayouts,
  registry: sectionRegistry,
  budgets: sectionBudgets,
};

const pick = process.argv[2];
if (pick && !SECTIONS[pick]) {
  console.error(`sección desconocida "${pick}" — usa: ${Object.keys(SECTIONS).join(' | ')}`);
  process.exit(1);
}

console.log(`conformance ${pick ?? '(todo el contrato)'}\n`);
for (const [name, run] of Object.entries(SECTIONS)) {
  if (pick && pick !== name) continue;
  console.log(`— ${name}`);
  await run();
}

console.log(
  `\n${failures ? `${failures} violaciones de contrato` : 'contrato completo en verde'}${notes ? ` · ${notes} notas` : ''}`
);
process.exit(failures ? 1 : 0);
