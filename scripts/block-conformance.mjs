/**
 * Contrato de bloques ejemplares (conformance/block-contract.json, siete reglas).
 *
 * Funcion pura sobre datos ya cargados: el runner de conformance.mjs la alimenta desde el
 * arbol y los tests la alimentan con fixtures. Cada error empieza con el id de la regla.
 */
import { RHYTHM_CLASSES, resolveExemplarHtml, validateExemplarShape } from './exemplar.mjs';

const ROOT_FORBIDDEN = /^(padding|padding-block(-start|-end)?|padding-top|padding-bottom|margin|margin-block(-start|-end)?|margin-top|margin-bottom)$/;

/**
 * @param {object} p
 * @param {string} p.slug
 * @param {{ html: string, css?: string }} p.layout
 * @param {Record<string, any>} p.exemplar
 * @param {string[]} p.deps — registryDependencies del item layout
 * @param {string} p.description — description del item layout
 * @param {Set<string>} p.hookNames — name de los items kind: hook
 * @param {Set<string>} p.utilityClasses — clases .bg-* que emite utilities
 * @param {Set<string>} p.registryNames
 * @param {Set<string>} p.exempt — deprecated + legacy del layout-contract
 * @param {(rel: string) => boolean} p.fileExists
 * @returns {string[]}
 */
export function checkExemplar(p) {
  const { slug, layout, exemplar: ex, deps, description, hookNames, utilityClasses, registryNames, exempt, fileExists } = p;
  const errors = [];
  const err = (rule, msg) => errors.push(`${rule}: ${slug}: ${msg}`);

  // 1 — exemplarComplete
  for (const e of validateExemplarShape(ex)) err('exemplarComplete', e);
  for (const key of ['capture', 'captureMobile']) {
    const f = ex?.evidence?.[key];
    if (f && !fileExists(f)) err('exemplarComplete', `evidence.${key} apunta a ${f}, que no existe`);
  }
  if (errors.length) return errors; // sin forma completa el resto no se puede evaluar

  // 2 — rhythmFromUseLayer
  if (!RHYTHM_CLASSES.includes(ex.rhythm)) {
    err('rhythmFromUseLayer', `rhythm "${ex.rhythm}" no es una de ${RHYTHM_CLASSES.join(', ')}`);
  } else if (!new RegExp(`class="[^"]*\\b${ex.rhythm}\\b`).test(layout.html)) {
    err('rhythmFromUseLayer', `el html del layout no lleva la clase de uso ${ex.rhythm} en su raiz`);
  }
  const css = (layout.css ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(new RegExp(`\\.l-${slug}\\s*\\{([^}]*)\\}`, 'g'))) {
    for (const decl of m[1].split(';')) {
      const prop = decl.split(':')[0].trim();
      if (ROOT_FORBIDDEN.test(prop)) {
        err('rhythmFromUseLayer', `.l-${slug} declara ${prop}: el aire de bloque sale de .${ex.rhythm}`);
      }
    }
  }

  // 3 — noNewMotion
  const hook = ex.motion?.hook ?? null;
  if (hook !== null) {
    if (!hookNames.has(hook)) err('noNewMotion', `motion.hook "${hook}" no es un item kind: hook`);
    else if (!deps.includes(hook)) err('noNewMotion', `"${hook}" falta en registryDependencies del layout`);
    for (const attr of Object.keys(ex.motion.attrs ?? {})) {
      if (!layout.html.includes(attr)) err('noNewMotion', `el html del layout no lleva ${attr}`);
    }
  }

  // 4 — surfaceFromUtilities
  if (ex.surface !== 'default') {
    if (!utilityClasses.has(ex.surface)) err('surfaceFromUtilities', `surface "${ex.surface}" no la emite utilities`);
    if (!deps.includes('utilities')) err('surfaceFromUtilities', 'surface oscura pide utilities en registryDependencies');
  }

  // 5 — contentResolved
  let html = '';
  try {
    html = resolveExemplarHtml(layout, ex);
  } catch (e) {
    err('contentResolved', e.message);
  }
  if (html) {
    if (/\{\{/.test(html)) err('contentResolved', 'quedan {{slots}} en el html resuelto');
    if (/data-repeat/.test(html)) err('contentResolved', 'queda data-repeat en el html resuelto');
    const h1 = (html.match(/<h1\b/g) ?? []).length;
    if (h1 > 1) err('contentResolved', `${h1} h1 en una region`);
    if (ex.a11y.carriesH1 !== (h1 === 1)) err('contentResolved', `a11y.carriesH1=${ex.a11y.carriesH1} pero el html tiene ${h1} h1`);
    if (/<form\b|<input\b/.test(html)) err('contentResolved', 'trae <form>/<input>: Atom convierte por WhatsApp');
    for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
      if (!/^https:\/\/wa\.me\//.test(m[1]) && !m[1].startsWith('#')) {
        err('contentResolved', `href "${m[1]}" no es wa.me ni un ancla`);
      }
    }
  }

  // 6 — relatedExists
  for (const r of ex.related) {
    if (!registryNames.has(r)) err('relatedExists', `related "${r}" no existe en el registry`);
    else if (exempt.has(r)) err('relatedExists', `related "${r}" esta deprecated o legacy`);
  }

  // 7 — descriptionIsReal
  if (/^Layout template:/.test(description ?? '')) err('descriptionIsReal', 'conserva la description de relleno');

  return errors;
}
