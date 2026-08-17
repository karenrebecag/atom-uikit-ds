#!/usr/bin/env node
/**
 * Integridad referencial — R1/R2/R3 de conformance/reference-contract.json.
 *
 * Las demas reglas del contrato verifican FORMA dentro del archivo (sin hex, sin
 * !important, sin cubic-bezier nuevo). Ninguna verifica que las referencias que
 * SALEN del archivo aterricen en algo que existe, y por eso el contrato podia
 * cerrar en verde con 32 defectos publicados (auditoria 2026-08-17: 6 vars sin
 * definir en video-player, --color-sky en tag, 25 clases sin emisor).
 *
 * Solo lee archivos COMMITEADOS: conformance.yml corre `node scripts/conformance.mjs`
 * sin install y sin build, asi que packages/tokens/build y packages/css/dist no
 * existen ahi (gitignored). Resolver contra el CSS construido daria ~300 falsos
 * positivos en CI.
 */

const VAR_USE = /var\(\s*(--[\w-]+)\s*([,)])/g;
const VAR_DEF = /(--[\w-]+)\s*:/g;
const AT_PROPERTY = /@property\s+(--[\w-]+)/g;
const CLASS_DEF = /\.([a-z][\w-]*)/g;
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '__tests__']);

export function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Recorre dir recursivamente. fs/path inyectados para poder testear sin disco.
 * __tests__ queda fuera a proposito: una clase emitida solo por un test no es
 * alcanzable en produccion, contarla como emisor esconderia el hallazgo.
 */
export function walk(dir, ext, fs, path, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full, ext, fs, path, out);
    else if (entry.endsWith(ext)) out.push(full);
  }
  return out;
}

const readAll = (files, fs) => files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');

// ---------------------------------------------------------------------------
// R1 — var() resuelve
// ---------------------------------------------------------------------------

/** Hojas DTCG (las que tienen $value) como rutas punteadas en minusculas. */
export function indexTokenLeaves(tokenFiles, fs) {
  const leaves = new Set();
  const visit = (node, prefix) => {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      if (!value || typeof value !== 'object') continue;
      if ('$value' in value || 'value' in value) leaves.add((prefix + key).toLowerCase());
      else visit(value, `${prefix + key}.`);
    }
  };
  for (const file of tokenFiles) visit(JSON.parse(fs.readFileSync(file, 'utf8')), '');
  return leaves;
}

/**
 * Style Dictionary aplana la ruta del token con '-', pero el corte no es
 * uniforme (`color.sky.500` -> --color-sky-500, `primary` -> --primary), asi que
 * probamos cada frontera como '.' o '-' y aceptamos si ALGUNA coincide. Es
 * permisivo a proposito: aqui se verifica existencia, el naming lo cubre
 * validate-tokens.js.
 */
export function tokenPathCandidates(varName) {
  const segments = varName.replace(/^--/, '').toLowerCase().split('-').filter(Boolean);
  if (segments.length === 0) return [];
  const boundaries = segments.length - 1;
  // 2^n candidatos: por encima de 12 segmentos no vale la pena, cae al literal.
  if (boundaries > 12) return [segments.join('-')];
  const out = [];
  for (let mask = 0; mask < 1 << boundaries; mask++) {
    let candidate = segments[0];
    for (let i = 0; i < boundaries; i++) {
      candidate += ((mask >> i) & 1 ? '.' : '-') + segments[i + 1];
    }
    out.push(candidate);
  }
  return out;
}

export function resolvesToToken(varName, leaves) {
  return tokenPathCandidates(varName).some((candidate) => leaves.has(candidate));
}

/** Definiciones locales: `--x:` en cualquier CSS del paquete, mas @property. */
export function collectCssVarDefinitions(cssFiles, fs) {
  const defined = new Set();
  for (const file of cssFiles) {
    const src = stripComments(fs.readFileSync(file, 'utf8'));
    for (const m of src.matchAll(VAR_DEF)) defined.add(m[1]);
    for (const m of src.matchAll(AT_PROPERTY)) defined.add(m[1]);
  }
  return defined;
}

/**
 * var(--x, algo) no se verifica: un fallback es contrato explicito con el
 * consumidor. var(--a, var(--b)) si verifica --b, porque si ninguna de las dos
 * existe la declaracion muere igual.
 */
export function findUnresolvedVars(rule, ctx) {
  const { fs, path, root } = ctx;
  const cssFiles = rule.scanDirs.flatMap((d) => walk(path.join(root, d), '.css', fs, path));
  const tokenFiles = rule.definitionSources
    .filter((d) => d.includes('tokens'))
    .flatMap((d) => walk(path.join(root, d), '.json', fs, path));

  if (tokenFiles.length === 0) return { skipped: 'no hay JSON de tokens en el checkout' };

  const leaves = indexTokenLeaves(tokenFiles, fs);
  const localDefs = collectCssVarDefinitions(cssFiles, fs);
  const runtime = new Set(Object.keys(rule.runtimeProvided ?? {}));
  const perFile = new Map();
  const files = [];

  for (const file of cssFiles) {
    const rel = path.relative(path.join(root, rule.scanDirs[0]), file);
    files.push(rel);
    const src = stripComments(fs.readFileSync(file, 'utf8'));
    for (const m of src.matchAll(VAR_USE)) {
      const [, name, terminator] = m;
      if (rule.fallbackIsKnob && terminator === ',') continue;
      if (localDefs.has(name) || runtime.has(name) || resolvesToToken(name, leaves)) continue;
      if (!perFile.has(rel)) perFile.set(rel, new Map());
      const names = perFile.get(rel);
      names.set(name, (names.get(name) ?? 0) + 1);
    }
  }
  return { perFile, files, scanned: cssFiles.length, tokens: leaves.size };
}

// ---------------------------------------------------------------------------
// R2 — la clase tiene emisor o esta publicada
// ---------------------------------------------------------------------------

export function collectClassDefinitions(cssFiles, ctx, scanRoot) {
  const { fs, path } = ctx;
  const byClass = new Map();
  for (const file of cssFiles) {
    if (file.endsWith('index.css')) continue;
    const rel = path.relative(scanRoot, file);
    const src = stripComments(fs.readFileSync(file, 'utf8'));
    for (const m of src.matchAll(CLASS_DEF)) {
      if (!byClass.has(m[1])) byClass.set(m[1], rel);
    }
  }
  return byClass;
}

export function collectPublishedClasses(registry) {
  const published = new Set();
  for (const item of registry.items ?? []) {
    for (const cls of item.atom?.implementation?.cssClasses ?? []) published.add(cls);
  }
  return published;
}

/**
 * `stats-card__trend--${trend}` emite stats-card__trend--up sin que el literal
 * aparezca nunca. El separador que importa es el ULTIMO, no el primero: cortar
 * en el primero produce el prefijo equivocado y 13 falsos positivos.
 */
export function isDynamicallyEmitted(cls, emitterSource) {
  const cut = Math.max(cls.lastIndexOf('__'), cls.lastIndexOf('--'));
  if (cut <= 0) return false;
  return emitterSource.includes(`${cls.slice(0, cut + 2)}\${`);
}

/**
 * ¿La clase aparece en un comentario de su propio archivo? Es la unica pista
 * barata de INTENCION que existe: 11 de las 25 clases sin emisor estaban
 * documentadas ahi (medido 2026-08-17), o sea que el gate no puede afirmar
 * "muerta" sin mentir en el 44% de los casos. La pista viaja con el hallazgo
 * para que el humano confirme, no adivine.
 */
export function documentedInFile(css, cls) {
  const comments = (css.match(/\/\*[\s\S]*?\*\//g) ?? []).join('\n');
  return comments.includes(cls);
}

export function findUnreachableClasses(rule, registry, ctx) {
  const { fs, path, root } = ctx;
  const scanRoot = path.join(root, rule.scanDirs[0]);
  const cssFiles = rule.scanDirs.flatMap((d) => walk(path.join(root, d), '.css', fs, path));
  const emitterFiles = rule.emitterDirs.flatMap((d) =>
    ['.tsx', '.ts', '.html', '.astro'].flatMap((ext) => walk(path.join(root, d), ext, fs, path)),
  );
  const emitterSource = readAll(emitterFiles, fs);
  const published = collectPublishedClasses(registry);
  const perFile = new Map();
  const files = cssFiles
    .filter((f) => !f.endsWith('index.css'))
    .map((f) => path.relative(scanRoot, f));

  const sourceOf = new Map();
  for (const [cls, rel] of collectClassDefinitions(cssFiles, ctx, scanRoot)) {
    if (emitterSource.includes(cls)) continue;
    if (published.has(cls)) continue;
    if (rule.dynamicPrefixes && isDynamicallyEmitted(cls, emitterSource)) continue;
    if (!sourceOf.has(rel)) sourceOf.set(rel, fs.readFileSync(path.join(scanRoot, rel), 'utf8'));
    if (!perFile.has(rel)) perFile.set(rel, []);
    perFile.get(rel).push({ cls, documented: documentedInFile(sourceOf.get(rel), cls) });
  }
  return { perFile, files, scanned: cssFiles.length, emitters: emitterFiles.length };
}

// ---------------------------------------------------------------------------
// R3 — el entry de tsup cubre cada subdirectorio con fuentes
// ---------------------------------------------------------------------------

export function parseEntryGlobs(configSource) {
  const match = configSource.match(/entry:\s*\[([\s\S]*?)\]/);
  if (!match) return null;
  return [...match[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((m) => m[1]);
}

export function findUncoveredEntries(rule, ctx) {
  const { fs, path, root } = ctx;
  const configPath = path.join(root, rule.config);
  if (!fs.existsSync(configPath)) return { skipped: `${rule.config} no existe` };

  const globs = parseEntryGlobs(fs.readFileSync(configPath, 'utf8'));
  if (!globs) return { skipped: `no se pudo leer el entry de ${rule.config}` };

  const covered = new Set(
    globs.filter((g) => g.endsWith('*.tsx')).map((g) => g.slice(0, g.lastIndexOf('/'))),
  );
  const sourceRoot = path.join(root, rule.sourceDir);
  const dirsWithSources = new Set(
    walk(sourceRoot, '.tsx', fs, path).map((f) => path.dirname(path.relative(sourceRoot, f))),
  );

  const uncovered = [];
  for (const dir of dirsWithSources) {
    const asGlob = dir === '.' ? 'src' : `src/${dir}`;
    if (!covered.has(asGlob)) uncovered.push(asGlob);
  }
  return { uncovered, globs, dirs: dirsWithSources.size };
}

// ---------------------------------------------------------------------------
// R4 — el registry apunta a archivos y a items que existen
// ---------------------------------------------------------------------------

/**
 * Borrar un componente y olvidar su item deja `files[].sourcePath` colgando: el
 * build sale en rojo, pero solo si alguien lo corre. Aqui cae en el PR.
 */
export function findDanglingRegistry(registry, ctx) {
  const { fs, path, root } = ctx;
  const names = new Set((registry.items ?? []).map((i) => i.name));
  const missingFiles = [];
  const missingDeps = [];
  for (const item of registry.items ?? []) {
    for (const file of item.files ?? []) {
      if (!file.sourcePath) continue;
      if (!fs.existsSync(path.join(root, file.sourcePath))) {
        missingFiles.push(`${item.name} → ${file.sourcePath}`);
      }
    }
    for (const dep of item.registryDependencies ?? []) {
      if (names.has(dep) || /^https?:/.test(dep)) continue;
      missingDeps.push(`${item.name} → "${dep}"`);
    }
  }
  return { missingFiles, missingDeps, items: (registry.items ?? []).length };
}

// ---------------------------------------------------------------------------
// R5 — los contratos y los mapas hardcodeados apuntan a algo que existe
// ---------------------------------------------------------------------------

const valueAt = (obj, dotted) => dotted.split('.').reduce((acc, key) => acc?.[key], obj);

/**
 * Donde mas se pudre un borrado: baselines, exenciones y mapas slug->modulo que
 * sobreviven al componente que los justificaba. Nadie los visita nunca porque
 * los runners recorren el disco, no el contrato.
 */
export function findStaleContractEntries(rule, registry, ctx) {
  const { fs, path, root } = ctx;
  const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
  const itemNames = new Set((registry.items ?? []).map((i) => i.name));
  const stale = [];

  for (const target of rule.filePaths ?? []) {
    const doc = readJson(target.file);
    for (const at of target.at) {
      for (const key of Object.keys(valueAt(doc, at) ?? {})) {
        if (key.startsWith('$')) continue;
        if (!fs.existsSync(path.join(root, target.relativeTo, key))) {
          stale.push(`${target.file} · ${at}["${key}"]: el archivo ya no existe`);
        }
      }
    }
  }

  for (const target of rule.itemNames ?? []) {
    const doc = readJson(target.file);
    for (const at of target.at) {
      for (const name of valueAt(doc, at) ?? []) {
        if (!itemNames.has(name)) {
          stale.push(`${target.file} · ${at}: "${name}" ya no es un item del registry`);
        }
      }
    }
  }

  for (const target of rule.modulePaths ?? []) {
    const src = fs.readFileSync(path.join(root, target.file), 'utf8');
    const referenced = new Set();
    for (const ext of target.extensions) {
      const escaped = ext.replace(/\./g, '\\.');
      const re = new RegExp(`['"\`]([a-z0-9][a-z0-9-]*${escaped})['"\`]`, 'g');
      for (const m of src.matchAll(re)) referenced.add(m[1]);
    }
    for (const mod of referenced) {
      const file = target.rewriteExtension
        ? mod.replace(/\.[^.]+$/, target.rewriteExtension)
        : mod;
      if (!fs.existsSync(path.join(root, target.relativeTo, file))) {
        stale.push(`${target.file}: apunta a ${file}, que ya no existe en ${target.relativeTo}`);
      }
    }
  }
  return stale;
}

// ---------------------------------------------------------------------------
// runner
// ---------------------------------------------------------------------------

/** El baseline acepta un numero suelto o {count, resolution, why, until}. */
export function baselineCount(entry) {
  if (entry == null) return 0;
  return typeof entry === 'number' ? entry : (entry.count ?? 0);
}

/**
 * Remedios posibles. Lista CERRADA a proposito: la prosa libre fue lo que fallo.
 * Un baseline que decia "el fix real es borrar" congelo como codigo muerto 16
 * clases que eran la API publica del boton de WhatsApp — el gate no puede saber
 * la intencion, asi que obliga a declararla en un vocabulario que el si verifica.
 */
export const RESOLUTIONS = {
  publish: 'es API del consumidor: va en atom.implementation.cssClasses',
  wire: 'falta el emisor: el componente o el behavior debe escribirla',
  delete: 'no la quiere nadie: se borra el CSS',
  triage: 'nadie lo ha decidido todavia (exige until)',
};

export function checkBaselineResolutions(baseline = {}, check, push) {
  for (const [rel, entry] of Object.entries(baseline)) {
    if (typeof entry !== 'object' || entry === null) {
      push('fail', check, `${rel}: baseline sin remedio — usa {count, resolution: ${Object.keys(RESOLUTIONS).join('|')}, why}`);
      continue;
    }
    if (!(entry.resolution in RESOLUTIONS)) {
      push('fail', check, `${rel}: resolution "${entry.resolution ?? '—'}" no existe. Elige ${Object.keys(RESOLUTIONS).join('|')}`);
      continue;
    }
    if (entry.resolution === 'triage' && !entry.until) {
      push('fail', check, `${rel}: resolution "triage" exige until — una decision sin fecha no se toma`);
    }
    if (!entry.why) {
      push('note', check, `${rel}: el baseline no dice por que`);
    }
  }
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** La deuda declarada se nombra en la salida: un baseline silencioso es el que se podre. */
function baselineTotal(rule) {
  return Object.values(rule?.baseline ?? {}).reduce((sum, entry) => sum + baselineCount(entry), 0);
}

const withDebt = (message, total) =>
  total > 0 ? `${message} · ${total} en baseline declarado` : message;

/**
 * Un baseline que ya no corresponde a ningun archivo escaneado es deuda de un
 * componente borrado: sin este aviso el contrato conserva para siempre la razon
 * de un archivo que no existe, y nadie lo nota (borrar es donde mas se pudre).
 */
export function staleBaselines(files, baseline = {}) {
  const scanned = new Set(files);
  return Object.keys(baseline).filter((rel) => !scanned.has(rel));
}

export function runReferenceChecks({ contract, registry, root }, fs, path, today = new Date()) {
  const ctx = { fs, path, root };
  const reports = [];
  const push = (level, check, message) => reports.push({ level, check, message });

  // R1
  const vars = findUnresolvedVars(contract.varsResolve, ctx);
  if (vars.skipped) {
    push('note', 'vars', `sin verificar: ${vars.skipped}`);
  } else {
    const varsBaseline = contract.varsResolve.baseline ?? {};
    checkBaselineResolutions(varsBaseline, 'vars', push);
    let clean = true;
    // Recorre TODOS los archivos escaneados, no solo los que tienen hallazgos: un
    // archivo que se limpia del todo desaparece de perFile y su baseline se quedaria
    // arriba sin que nadie avise de bajarlo.
    for (const rel of vars.files) {
      const names = vars.perFile.get(rel) ?? new Map();
      const allowed = baselineCount(varsBaseline[rel]);
      const found = names.size;
      if (found > allowed) {
        clean = false;
        const detail = [...names].map(([n, uses]) => `${n} (${uses}x)`).join(', ');
        push('fail', 'vars', `${rel}: ${found} var() sin resolver > baseline ${allowed} — ${detail}`);
      } else if (found < allowed) {
        push('note', 'vars', `${rel}: bajó a ${found} (baseline ${allowed}) — baja el baseline en reference-contract.json`);
      }
    }
    for (const rel of staleBaselines(vars.files, varsBaseline)) {
      push('note', 'vars', `${rel}: baseline obsoleto — el archivo ya no existe, quítalo de reference-contract.json`);
    }
    if (clean) {
      push('ok', 'vars', withDebt(
        `${vars.scanned} archivos: toda var() sin fallback resuelve (${vars.tokens} hojas de token)`,
        baselineTotal(contract.varsResolve),
      ));
    }
  }

  // R2
  const classes = findUnreachableClasses(contract.classesReachable, registry, ctx);
  const classesBaseline = contract.classesReachable.baseline ?? {};
  checkBaselineResolutions(classesBaseline, 'classes', push);
  let classesClean = true;
  for (const rel of classes.files) {
    const found = classes.perFile.get(rel) ?? [];
    const list = found.map((f) => f.cls);
    const allowed = baselineCount(classesBaseline[rel]);
    const entry = classesBaseline[rel];
    // "publish" es verificable: si sigue habiendo hallazgos, no se publico.
    if (typeof entry === 'object' && entry?.resolution === 'publish' && found.length) {
      classesClean = false;
      push('fail', 'classes', `${rel}: declara resolution "publish" pero ${plural(found.length, 'clase sigue', 'clases siguen')} fuera de atom.implementation.cssClasses`);
    }
    if (list.length > allowed) {
      classesClean = false;
      const documented = found.filter((f) => f.documented).map((f) => f.cls);
      const hint = documented.length
        ? ` · ${documented.length} documentadas en el propio archivo (${documented.join(' ')}): probablemente API, resolution "publish"`
        : '';
      push('fail', 'classes', `${rel}: ${plural(list.length, 'clase', 'clases')} sin declarar > baseline ${allowed} — ${list.join(' ')}${hint}`);
    } else if (list.length < allowed) {
      push('note', 'classes', `${rel}: bajó a ${list.length} (baseline ${allowed}) — baja el baseline en reference-contract.json`);
    }
  }
  for (const rel of staleBaselines(classes.files, classesBaseline)) {
    push('note', 'classes', `${rel}: baseline obsoleto — el archivo ya no existe, quítalo de reference-contract.json`);
  }
  if (classesClean) {
    push('ok', 'classes', withDebt(
      `${classes.scanned} archivos contra ${classes.emitters} emisores: toda clase alcanzable`,
      baselineTotal(contract.classesReachable),
    ));
  }

  // R3
  const entries = findUncoveredEntries(contract.entryCoversSource, ctx);
  if (entries.skipped) push('note', 'entry', `sin verificar: ${entries.skipped}`);
  else if (entries.uncovered.length) {
    push('fail', 'entry', `subdirectorios fuera del entry de tsup (no compilan a dist): ${entries.uncovered.join(', ')}`);
  } else {
    push('ok', 'entry', `${entries.dirs} subdirectorios cubiertos por el entry de tsup`);
  }

  // R4
  const dangling = findDanglingRegistry(registry, ctx);
  for (const entry of dangling.missingFiles) {
    push('fail', 'registry-files', `item con archivo inexistente (rompe build:registry y deja el item vacio): ${entry}`);
  }
  for (const entry of dangling.missingDeps) {
    push('fail', 'registry-files', `registryDependencies sin resolver: ${entry}`);
  }
  if (!dangling.missingFiles.length && !dangling.missingDeps.length) {
    push('ok', 'registry-files', `${dangling.items} items: todo sourcePath existe y toda registryDependency resuelve`);
  }

  // R5
  if (contract.contractsResolve) {
    const stale = findStaleContractEntries(contract.contractsResolve, registry, ctx);
    for (const entry of stale) push('fail', 'contracts', entry);
    if (!stale.length) push('ok', 'contracts', 'baselines, exenciones y mapas slug→modulo apuntan a archivos vivos');
  }

  // Deuda con fecha: nota, nunca fallo. Vencerla es una decision, no un bug.
  for (const rule of ['varsResolve', 'classesReachable']) {
    for (const [rel, entry] of Object.entries(contract[rule]?.baseline ?? {})) {
      if (typeof entry !== 'object' || !entry.until) continue;
      if (new Date(entry.until) < today) {
        push('note', 'debt', `${rel}: baseline vencido el ${entry.until} — ${entry.why ?? 'sin razón declarada'}`);
      }
    }
  }

  return {
    reports,
    failures: reports.filter((r) => r.level === 'fail').length,
    notes: reports.filter((r) => r.level === 'note').length,
  };
}

export function formatReport(r) {
  return r.message;
}
