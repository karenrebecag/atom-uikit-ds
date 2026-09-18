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
