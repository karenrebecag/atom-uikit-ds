/**
 * Envuelve un artefacto CSS en un cascade layer con nombre (ADR 014).
 *
 * Por qué existe: el canal /v1 se enlaza en el head de Webflow DESPUÉS de la
 * hoja del sitio, así que a igual especificidad el DS gana y una clase `ds-*`
 * editada desde el panel no se aplica fuera del canvas. Los estilos dentro de
 * un layer pierden siempre contra los que no tienen layer, sin importar
 * especificidad ni orden: el DS pasa a ser el valor por defecto y el sitio
 * manda.
 */

export const LAYER = 'atom-ds';

/** @import y @charset tienen que ir antes de cualquier regla: dentro de un layer invalidan la hoja. */
const PRELUDE_AT_RULE = /@(import|charset)\b/i;

export function wrapInLayer(css, name = LAYER) {
  if (PRELUDE_AT_RULE.test(css)) {
    throw new Error(`[layer-css] el CSS trae @import o @charset: no puede ir dentro de @layer ${name}`);
  }
  return `@layer ${name}{${css.trim()}}\n`;
}

/**
 * Índice de la comilla que cierra el string que abre en `start`. Recorre
 * carácter a carácter porque CSS escapa con `\`: en `content:"\""` la comilla
 * del medio es contenido, no cierre.
 */
function stringEnd(css, start) {
  const quote = css[start];
  for (let i = start + 1; i < css.length; i++) {
    if (css[i] === '\\') i++;
    else if (css[i] === quote) return i;
  }
  return -1;
}

/**
 * Índice de la llave que cierra la que abre en `open`. Salta strings y
 * comentarios: un `content: "}"` no debe cerrar el bloque.
 */
function matchingBrace(css, open) {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    const ch = css[i];
    if (ch === '"' || ch === "'") {
      const end = stringEnd(css, i);
      if (end === -1) return -1;
      i = end;
    } else if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      if (end === -1) return -1;
      i = end + 1;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** true solo si TODO el CSS vive dentro de un único bloque `@layer <name>{...}`. */
export function isWrappedInLayer(css, name = LAYER) {
  const src = css.trim();
  const head = `@layer ${name}{`;
  if (!src.startsWith(head)) return false;
  return matchingBrace(src, head.length - 1) === src.length - 1;
}

/**
 * Selectores que dependen de un estado que pinta el JS o el navegador. Fuera
 * del layer porque el CSS base de Webflow (`button{color:inherit}`,
 * `.w-button{color:#fff}`) no lleva layer y ganaria a cualquier regla de
 * dentro: el tab activo y el inactivo acababan del mismo color. El panel de
 * Webflow tampoco puede expresar `[data-active]` ni `[aria-expanded]`, asi que
 * el sitio no pierde nada que pudiera editar.
 */
// El lookahead cierra el nombre: con \b, `[data-active-tab]` o `:disabled-ish` tambien casaban.
const STATE_SELECTOR =
  /\[(data-active|data-state|aria-(expanded|selected|current|pressed|checked|disabled|invalid))(?=[\]=~|^$*\s])|:(hover|focus|focus-visible|focus-within|active|checked|disabled)(?![\w-])/;

/** Reglas agrupadoras: se abren y se reparte su contenido. El resto (@keyframes, @font-face) va entero a la base. */
const GROUPING_AT_RULE = /^@(media|supports|container)\b/i;

/** Parte en las comas de nivel superior: `:not(.a,.b)` y `[x=","]` no cuentan. */
function splitSelectorList(list) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < list.length; i++) {
    const ch = list[i];
    if (ch === '"' || ch === "'") i = stringEnd(list, i);
    else if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (ch === ',' && depth === 0) {
      parts.push(list.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(list.slice(start));
  return parts.map((s) => s.trim()).filter(Boolean);
}

/**
 * Indice de la `{` que abre el bloque que empieza en `from`, saltando strings
 * como matchingBrace. Un `;` fuera de string antes de la llave es una sentencia
 * sin bloque (`@layer a;`) que el reparto perderia: se rechaza.
 */
function preludeEnd(css, from) {
  for (let i = from; i < css.length; i++) {
    const ch = css[i];
    if (ch === '"' || ch === "'") {
      i = stringEnd(css, i);
      if (i === -1) return -1;
    } else if (ch === ';') {
      throw new Error('[layer-css] sentencia sin bloque: se perderia al repartir');
    } else if (ch === '{') {
      return i;
    }
  }
  return -1;
}

/** Recorre los bloques de nivel superior como pares [preludio, cuerpo]. */
function topLevelBlocks(css) {
  const blocks = [];
  let i = 0;
  while (i < css.length) {
    const open = preludeEnd(css, i);
    if (open === -1) {
      if (css.slice(i).trim()) throw new Error('[layer-css] sentencia sin bloque: se perderia al repartir');
      break;
    }
    const close = matchingBrace(css, open);
    if (close === -1) throw new Error('[layer-css] llave sin cerrar');
    blocks.push([css.slice(i, open).trim(), css.slice(open + 1, close)]);
    i = close + 1;
  }
  return blocks;
}

/** Reparte el CSS en { base, state } segun STATE_SELECTOR, respetando @media/@supports/@container. */
export function splitStateRules(css) {
  let base = '';
  let state = '';
  for (const [prelude, body] of topLevelBlocks(css)) {
    if (GROUPING_AT_RULE.test(prelude)) {
      const inner = splitStateRules(body);
      if (inner.base) base += `${prelude}{${inner.base}}`;
      if (inner.state) state += `${prelude}{${inner.state}}`;
    } else if (prelude.startsWith('@')) {
      base += `${prelude}{${body}}`;
    } else {
      const selectors = splitSelectorList(prelude);
      const stateful = selectors.filter((s) => STATE_SELECTOR.test(s));
      const plain = selectors.filter((s) => !STATE_SELECTOR.test(s));
      if (plain.length) base += `${plain.join(',')}{${body}}`;
      if (stateful.length) state += `${stateful.join(',')}{${body}}`;
    }
  }
  return { base, state };
}

/** Base dentro de @layer, estados detras sin layer (ADR 014, enmienda 2026-09-18). */
export function layerWithStates(css, name = LAYER) {
  const { base, state } = splitStateRules(css);
  return `${wrapInLayer(base, name).trimEnd()}${state}\n`;
}

/** true si abre con un unico @layer <name> y lo que queda fuera son solo reglas de estado. */
export function isLayeredWithStates(css, name = LAYER) {
  const src = css.trim();
  const head = `@layer ${name}{`;
  if (!src.startsWith(head)) return false;
  const close = matchingBrace(src, head.length - 1);
  if (close === -1) return false;
  return splitStateRules(src.slice(close + 1)).base.trim() === '';
}
