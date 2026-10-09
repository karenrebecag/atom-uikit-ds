/**
 * Contrato de la skill del canal (conformance/skill-contract.json, nueve gates).
 *
 * Funcion pura sobre el texto de las capas y un contexto con lo que el DS publica: el runner de
 * conformance.mjs la alimenta desde el arbol y los tests la alimentan con fixtures. Cada error
 * empieza con el id del gate y nombra archivo y linea.
 */
import { applyChecklist } from './build-skill-checklist.mjs';

const FENCE = /^```/;
const INLINE = /`([^`\n]+)`/g;
const PATH_ROOTS = /^(skills|packages|docs|conformance|scripts|public)\//;

/** Lineas fuera de bloques de codigo, con su numero real. */
function proseLines(text) {
  const out = [];
  let fenced = false;
  text.split('\n').forEach((line, i) => {
    if (FENCE.test(line.trim())) {
      fenced = !fenced;
      return;
    }
    if (!fenced) out.push({ line, n: i + 1 });
  });
  return out;
}

/** Citas entre backticks, clasificadas. Lo que no encaja en una categoria no se verifica. */
export function citations(text) {
  const found = [];
  for (const { line, n } of proseLines(text)) {
    for (const m of line.matchAll(INLINE)) {
      const t = m[1].trim();
      if (/^\.[a-z][\w-]*$/.test(t)) found.push({ kind: 'class', value: t.slice(1), n });
      else if (/^--[\w-]+$/.test(t)) found.push({ kind: 'token', value: t, n });
      else if (/^layout\/[\w-]+$/.test(t)) found.push({ kind: 'layout', value: t, n });
      else if (/^hook:[\w-]+$/.test(t)) found.push({ kind: 'hook', value: t.slice(5), n });
      else if ((PATH_ROOTS.test(t) || (t.includes('/') && /\.(md|json)$/.test(t))) && !/[<*]/.test(t) && !/\s/.test(t)) {
        found.push({ kind: 'path', value: t, n });
      }
    }
  }
  return found;
}

/**
 * @param {object} p
 * @param {Record<string, string>} p.files — archivo de capa -> contenido
 * @param {any} p.contract — skill-contract.json
 * @param {any} p.checks — skill-checks.json
 * @param {string} p.blocksGenerated — lo que generaria build-skill-blocks.mjs
 * @param {{ pathExists(rel: string): boolean, classExists(c: string): boolean, tokenExists(t: string): boolean,
 *           layouts: Set<string>, hooks: Set<string>, exemplars: Set<string> }} p.ctx
 * @returns {string[]}
 */
export function checkSkill({ files, contract, checks, blocksGenerated, ctx }) {
  const errors = [];
  const err = (gate, file, n, msg) => errors.push(`${gate}: ${file}${n ? `:${n}` : ''}: ${msg}`);
  const layerFiles = contract.layers.map((l) => l.file);
  const generated = new Set(contract.layers.filter((l) => l.generated).map((l) => l.file));
  const allFiles = [...layerFiles, ...contract.examples];

  for (const f of allFiles) {
    if (!(f in files)) err('skillLayerBudget', f, 0, 'declarado en skill-contract.json pero no existe');
  }
  const present = Object.keys(files);

  // 1 — skillReferencesResolve
  for (const f of present) {
    for (const c of citations(files[f])) {
      if (c.kind === 'class' && !ctx.classExists(c.value)) err('skillReferencesResolve', f, c.n, `la clase .${c.value} no existe en el DS`);
      if (c.kind === 'token' && !ctx.tokenExists(c.value)) err('skillReferencesResolve', f, c.n, `el token ${c.value} no existe`);
      if (c.kind === 'layout' && !ctx.layouts.has(c.value)) err('skillReferencesResolve', f, c.n, `${c.value} no existe en el registry`);
      if (c.kind === 'hook' && !ctx.hooks.has(c.value)) err('skillReferencesResolve', f, c.n, `el behavior ${c.value} no existe`);
      if (c.kind === 'path' && !ctx.pathExists(c.value)) err('skillReferencesResolve', f, c.n, `la ruta ${c.value} no existe`);
    }
  }

  // 2 — skillBlocksGenerated
  for (const f of generated) {
    if (files[f] !== undefined && files[f] !== blocksGenerated) {
      err('skillBlocksGenerated', f, 0, 'no coincide con lo generado: corre node scripts/build-skill-blocks.mjs, no lo edites a mano');
    }
  }

  // 3 — skillExamplesUseExemplars
  for (const f of contract.examples) {
    if (!(f in files)) continue;
    const layouts = citations(files[f]).filter((c) => c.kind === 'layout');
    if (!layouts.length) err('skillExamplesUseExemplars', f, 0, 'no nombra ningun bloque');
    for (const c of layouts) {
      if (!ctx.exemplars.has(c.value.replace('layout/', ''))) {
        err('skillExamplesUseExemplars', f, c.n, `${c.value} no tiene .exemplar.ts`);
      }
    }
  }

  // 4 — skillLayerBudget
  for (const l of contract.layers) {
    const n = (files[l.file] ?? '').split('\n').length;
    if (files[l.file] !== undefined && n > l.max) err('skillLayerBudget', l.file, 0, `${n} lineas > ${l.max}`);
  }
  const entrada = files['SKILL.md'] ?? '';
  const linked = new Set([...entrada.matchAll(/\]\(([^)#]+\.md)\)/g)].map((m) => m[1]));
  for (const f of allFiles.filter((x) => x !== 'SKILL.md')) {
    if (!linked.has(f)) err('skillLayerBudget', 'SKILL.md', 0, `no enlaza ${f}`);
  }
  for (const target of linked) {
    if (!present.includes(target)) err('skillLayerBudget', 'SKILL.md', 0, `enlace roto a ${target}`);
  }

  // 5 — skillChecklistDelegates
  const cierre = files['cierre.md'] ?? '';
  for (const tool of contract.delegates) {
    if (!cierre.includes(tool)) err('skillChecklistDelegates', 'cierre.md', 0, `no delega en ${tool}`);
  }
  if (!cierre.includes('<!-- contable:start -->') || !/Mitad de criterio/.test(cierre)) {
    err('skillChecklistDelegates', 'cierre.md', 0, 'debe declarar la mitad contable (marcadores) y la mitad de criterio');
  }

  // 6 — skillNoForms
  // Una mencion entre backticks ("nunca un `<form>`") es la regla, no un incumplimiento: solo cuenta
  // el marcado real (bloques de codigo y texto fuera de backticks).
  for (const f of present) {
    let fenced = false;
    files[f].split('\n').forEach((line, i) => {
      if (FENCE.test(line.trim())) fenced = !fenced;
      const scan = fenced ? line : line.replace(INLINE, '');
      if (/<(form|input|textarea|select)\b/i.test(scan)) err('skillNoForms', f, i + 1, 'contiene un elemento de formulario');
    });
  }

  // 7 — skillOneRuleOneFile
  const byRule = new Map();
  for (const f of present) {
    for (const m of files[f].matchAll(/<!-- regla: ([\w-]+) -->/g)) {
      byRule.set(m[1], new Set([...(byRule.get(m[1]) ?? []), f]));
    }
  }
  for (const [rule, set] of byRule) {
    const cap = contract.repeatableRules.includes(rule) ? contract.maxFilesPerRepeatableRule : 1;
    if (set.size > cap) err('skillOneRuleOneFile', [...set].join(', '), 0, `la regla ${rule} vive en ${set.size} archivos (maximo ${cap})`);
  }

  // 8 — skillChecklistGenerated
  const ids = checks.checks.map((c) => c.id);
  if (cierre) {
    try {
      if (applyChecklist(cierre, checks) !== cierre) {
        err('skillChecklistGenerated', 'cierre.md', 0, 'la mitad contable no coincide con conformance/skill-checks.json: corre node scripts/build-skill-checklist.mjs');
      }
    } catch (e) {
      err('skillChecklistGenerated', 'cierre.md', 0, e.message);
    }
    const inside = cierre.split('<!-- contable:start -->')[1]?.split('<!-- contable:end -->')[0] ?? '';
    for (const line of inside.split('\n').filter((l) => l.startsWith('- ['))) {
      const id = /<!-- check:([\w-]+) -->/.exec(line)?.[1];
      if (!id || !ids.includes(id)) err('skillChecklistGenerated', 'cierre.md', 0, `linea contable sin id del registro: ${line.slice(0, 60)}`);
    }
  }
  if (new Set(ids).size !== ids.length) err('skillChecklistGenerated', 'conformance/skill-checks.json', 0, 'ids duplicados');

  // 9 — skillVocabularyFromDS
  for (const f of present.filter((x) => !generated.has(x))) {
    for (const { line, n } of proseLines(files[f])) {
      const classes = [...line.matchAll(INLINE)].filter((m) => /^\.[a-z][\w-]*$/.test(m[1].trim()));
      if (classes.length > contract.maxClassCitationsPerLine) {
        err('skillVocabularyFromDS', f, n, `lista ${classes.length} clases a mano: cita la fuente del DS en vez de copiarla`);
      }
    }
  }

  return errors;
}
