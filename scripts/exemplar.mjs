/**
 * Bloques ejemplares (docs: packages/layouts/src/EXEMPLAR.md, conformance/block-contract.json).
 *
 * Un ejemplar no escribe CSS ni HTML: declara la decision de composicion de un layout y la
 * copy de referencia. Este modulo es la unica implementacion de dos cosas que comparten el
 * build y el conformance, para que no puedan divergir: la forma del ejemplar y el HTML ya
 * resuelto que se publica.
 */

export const RHYTHM_CLASSES = ['section', 'section--hero', 'section--compact', 'section--dense', 'section--inset'];

export const REQUIRED_FIELDS = [
  'slug',
  'whenToUse',
  'whenNotToUse',
  'rhythm',
  'surface',
  'motion',
  'content',
  'states',
  'a11y',
  'related',
  'evidence',
];

export const REFERENCE_COMMENT = '<!-- contenido de referencia: sustituir con el brief -->';

const SLOT_RE = /\{\{([\w-]+)\}\}/g;
const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Cierre del elemento que abre en `openEnd`, contando solo la misma etiqueta para tolerar
 * anidamiento (un span dentro de un span). Los layouts son HTML que escribimos nosotros: no
 * hay etiquetas sin cerrar ni `>` dentro de atributos, asi que un conteo basta.
 * @returns {number} indice justo despues del `</tag>` que cierra
 */
function closeOf(html, tag, openEnd) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g');
  re.lastIndex = openEnd;
  let depth = 1;
  for (let m; (m = re.exec(html)); ) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return m.index + m[0].length;
  }
  throw new Error(`<${tag}> sin cerrar`);
}

function findElement(html, attr, value) {
  const open = new RegExp(`<(\\w+)\\b[^>]*\\s${attr}="${value}"[^>]*>`).exec(html);
  if (!open) return null;
  const start = open.index;
  const openEnd = start + open[0].length;
  return { start, openEnd, end: closeOf(html, open[1], openEnd), tag: open[1] };
}

function removeOptional(html, slot) {
  const el = findElement(html, 'data-optional', slot);
  // Sin elemento opcional no se inventa nada: si el slot sigue en el html, falla como "sin contenido".
  return el ? html.slice(0, el.start) + html.slice(el.end) : html;
}

function fillRepeat(html, key, rows) {
  const el = findElement(html, 'data-repeat', key);
  if (!el) throw new Error(`repeats.${key} no tiene elemento data-repeat="${key}"`);
  const inner = html.slice(el.openEnd, el.end - `</${el.tag}>`.length);
  const body = rows
    .map((row) => inner.replace(SLOT_RE, (_, k) => (k in row ? escapeHtml(row[k]) : `{{${k}}}`)))
    .join('\n');
  return html.slice(0, el.openEnd) + body + html.slice(el.end - `</${el.tag}>`.length);
}

function addRootClasses(html, classes) {
  const m = /<(\w+)\b([^>]*?)\sclass="([^"]*)"/.exec(html.replace(/<!--[\s\S]*?-->/g, (c) => ' '.repeat(c.length)));
  if (!m) throw new Error('el layout no tiene un elemento raiz con class');
  const present = new Set(m[3].split(/\s+/));
  const add = classes.filter((c) => c && c !== 'default' && !present.has(c));
  if (!add.length) return html;
  const at = m.index + m[0].length - 1; // justo antes de la comilla de cierre del class
  return html.slice(0, at) + ' ' + add.join(' ') + html.slice(at);
}

/**
 * HTML del layout con el contenido de referencia aplicado: 0 `{{}}`, 0 data-repeat.
 * `content.<slot> === null` quita el elemento marcado data-optional (p. ej. un eyebrow).
 * Los valores se escapan salvo los slots listados en `exemplar.rawSlots` (iconos SVG).
 * @param {{ html: string }} layout
 * @param {Record<string, any>} exemplar
 */
export function resolveExemplarHtml(layout, exemplar) {
  const { content = {}, repeats = {}, rawSlots = [] } = exemplar;
  let html = layout.html;

  for (const [slot, value] of Object.entries(content)) {
    if (value === null) html = removeOptional(html, slot);
  }
  for (const [key, rows] of Object.entries(repeats)) html = fillRepeat(html, key, rows);

  const missing = new Set();
  html = html.replace(SLOT_RE, (_, k) => {
    const v = content[k];
    if (v === undefined || v === null) {
      missing.add(k);
      return `{{${k}}}`;
    }
    return rawSlots.includes(k) ? String(v) : escapeHtml(v);
  });
  if (missing.size) throw new Error(`slots sin contenido: ${[...missing].join(', ')}`);

  html = html.replace(/\sdata-optional="[^"]*"/g, '').replace(/\sdata-repeat="[^"]*"/g, '');
  html = addRootClasses(html, [exemplar.rhythm, exemplar.surface]).replace(/^[ \t]+\n/gm, '');
  return `${REFERENCE_COMMENT}\n${html.trim()}\n`;
}

/**
 * Errores de forma del ejemplar (regla exemplarComplete, sin tocar el disco).
 * @returns {string[]}
 */
export function validateExemplarShape(ex) {
  const errors = [];
  for (const f of REQUIRED_FIELDS) {
    if (ex?.[f] === undefined) errors.push(`falta el campo ${f}`);
  }
  if (errors.length) return errors;
  if (!Array.isArray(ex.whenToUse) || ex.whenToUse.length < 2) errors.push('whenToUse necesita >=2 frases');
  if (!Array.isArray(ex.whenNotToUse) || ex.whenNotToUse.length < 2) errors.push('whenNotToUse necesita >=2 frases');
  if (!Array.isArray(ex.states) || ex.states.length < 1) errors.push('states necesita >=1');
  if (!ex.evidence?.capture) errors.push('evidence.capture vacio');
  if (typeof ex.a11y?.carriesH1 !== 'boolean') errors.push('a11y.carriesH1 debe ser boolean');
  return errors;
}
