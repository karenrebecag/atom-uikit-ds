/**
 * F6 — Pure HTML+CSS → @webflow/XscpData package.
 * No network, no Webflow SDK. JSON always via JSON.stringify (never string concat of payload).
 *
 * Mapping baseline: karenrebecag/Code-to-Webflow skill, contrastado contra un dump
 * REAL del Designer (fixtures/designer/testimonial-copy-json.json): payload sin
 * styleOverrides, styles sin `origin`, `classes` referencian style `_id` (no nombres),
 * _ids con forma UUID, `data.displayName` presente.
 */

import { prefixClassName, prefixWebflowCss } from '../../packages/css/scripts/prefix-webflow.mjs';

const CREATED_BY = '590cdb22ed5bf253e056f0a7';

/** CSS props we refuse to map into styleLess (noise → unsupported). Extend as needed. */
const UNSUPPORTED_PROPS = new Set([
  'container-type',
  'container-name',
  'content-visibility',
  'offset-path',
  'anchor-name',
  'view-timeline',
  'animation-timeline',
]);

const TAG_TYPE = {
  div: 'Block',
  section: 'Block',
  article: 'Block',
  header: 'Block',
  footer: 'Block',
  main: 'Block',
  aside: 'Block',
  nav: 'Block',
  span: 'Block',
  a: 'Link',
  button: 'Link',
  img: 'Image',
  h1: 'Heading',
  h2: 'Heading',
  h3: 'Heading',
  h4: 'Heading',
  h5: 'Heading',
  h6: 'Heading',
  p: 'Paragraph',
  ul: 'List',
  ol: 'List',
  li: 'ListItem',
};

const PSEUDO_VARIANT = {
  hover: 'main_hover',
  focus: 'main_focus',
  active: 'main_active',
  'focus-visible': 'main_focus',
};

/**
 * @typedef {{ prop: string, selector: string, reason: string }} UnsupportedEntry
 * @typedef {{
 *   clipboard: object,
 *   headCss: string,
 *   footerNote: string,
 *   unsupported: UnsupportedEntry[],
 * }} WebflowPackage
 */

/**
 * @param {string} html
 * @param {string} css
 * @param {{ slug?: string }} [opts]
 * @returns {WebflowPackage}
 */
export function generateXscp(html, css, opts = {}) {
  const slug = opts.slug ?? 'atom';
  const unsupported = [];
  const idState = { n: 0, slug };

  const { rules, keyframes, mediaRules, complexRules } = parseCss(css, unsupported);

  // <svg>…</svg> no es representable como nodos del Designer: viaja como
  // HtmlEmbed (shape verificado en fixtures/designer/hero-2-copy-json.json).
  // Se extrae ANTES del parseo y se restituye como nodo atómico.
  const svgBlocks = [];
  const htmlPrepared = html.trim().replace(/<svg[\s\S]*?<\/svg>/gi, (raw) => {
    svgBlocks.push(raw);
    return `<x-svg-embed data-svg-index="${svgBlocks.length - 1}"></x-svg-embed>`;
  });

  const rootNodes = parseHtml(htmlPrepared);
  const nodes = [];
  const classIds = new Map(); // className → style _id (UUID-shaped, como el Designer)

  function ensureClass(name) {
    if (!classIds.has(name)) classIds.set(name, nextId(idState));
    return classIds.get(name);
  }

  function walk(el) {
    if (el.type === 'text') {
      const id = nextId(idState);
      nodes.push({ _id: id, text: true, v: el.value });
      return id;
    }

    const tag = el.tag.toLowerCase();

    // Placeholder de SVG → nodo HtmlEmbed con el shape real del Designer
    if (tag === 'x-svg-embed') {
      const svgHtml = svgBlocks[Number(el.attrs?.['data-svg-index'] ?? -1)] ?? '';
      const id = nextId(idState);
      nodes.push({
        _id: id,
        type: 'HtmlEmbed',
        tag: 'div',
        classes: [],
        children: [],
        v: svgHtml,
        data: {
          embed: {
            type: 'html',
            meta: { html: svgHtml, div: false, iframe: false, script: false, compilable: false },
          },
          insideRTE: false,
          attr: { id: '' },
          xattr: [],
          search: { exclude: false },
          visibility: { conditions: [] },
          displayName: '',
        },
      });
      return id;
    }

    const type = TAG_TYPE[tag] ?? 'Block';
    const id = nextId(idState);
    // Real Designer dumps: node.classes referencia style _ids, no nombres de clase.
    const classList = (el.classes ?? []).map((c) => ensureClass(c));

    const childIds = [];
    for (const child of el.children ?? []) {
      childIds.push(walk(child));
    }

    const dataAttrs = el.attrs ?? {};
    // data-* + role + aria-*: verificado en el paste real que role se perdía
    // cuando solo pasábamos data-* — la semántica ARIA viaja por xattr.
    const xattr = Object.entries(dataAttrs)
      .filter(([k]) => k.startsWith('data-') || k === 'role' || k.startsWith('aria-'))
      .map(([name, value]) => ({ name, value: value ?? '' }));

    /** @type {Record<string, unknown>} */
    const data = {
      tag,
      text: false,
      displayName: '',
      attr: { id: dataAttrs.id ?? '' },
      xattr,
      search: { exclude: false },
      visibility: { conditions: [] },
    };

    if (type === 'Link') {
      data.button = tag === 'button' || dataAttrs['data-button'] !== undefined;
      data.block = 'inline';
      data.link = {
        mode: 'external',
        url: dataAttrs.href ?? '#',
      };
    }
    if (type === 'Image') {
      data.attr = {
        src: dataAttrs.src ?? '',
        alt: dataAttrs.alt ?? '',
        loading: dataAttrs.loading ?? 'lazy',
        width: dataAttrs.width ?? 'auto',
        height: dataAttrs.height ?? 'auto',
      };
    }
    if (type === 'List') {
      data.list = { type: 'list', unstyled: false };
    }

    nodes.push({
      _id: id,
      type,
      tag,
      classes: classList,
      children: childIds,
      data,
    });
    return id;
  }

  for (const root of rootNodes) {
    walk(root);
  }

  // Particionar media queries: mapeables → variants de breakpoint; el resto
  // (prefers-reduced-motion, min-width, etc.) viaja COMPLETO al head Custom Code
  // — el Designer no puede expresarlo, pero el CSS del <head> sí aplica a las
  // clases pegadas. Nunca se pierde en silencio.
  const mappedMedia = [];
  const headChunks = [];

  // Selectores no-simples (compuestos .a.b, descendientes, ::pseudo-elementos,
  // listas): el panel de estilos del Designer no puede expresarlos y atribuirlos
  // a UNA clase mezclaría variantes. Viajan como CSS normal al head.
  for (const cr of complexRules) {
    headChunks.push(cr.block);
    unsupported.push({
      prop: 'selector',
      selector: cr.selector,
      reason: 'compound/descendant selector — moved to head Custom Code (Designer styles are single-class)',
    });
  }

  for (const mr of mediaRules) {
    const bp = mediaToBreakpoint(mr.query);
    if (bp) {
      mappedMedia.push({ bp, rules: mr.rules });
      // complejos dentro de un breakpoint mapeado: al head, envueltos en su query
      if (mr.complex?.length) {
        headChunks.push(`@media ${mr.query} {\n${mr.complex.map((c) => c.block).join('\n')}\n}`);
        unsupported.push({
          prop: 'selector',
          selector: `@media ${mr.query} → ${mr.complex.map((c) => c.selector).join(', ')}`,
          reason: 'compound selector inside breakpoint — moved to head Custom Code',
        });
      }
    } else {
      headChunks.push(mr.raw);
      unsupported.push({
        prop: '@media',
        selector: mr.query,
        reason: 'not a Designer breakpoint — moved to head Custom Code block',
      });
    }
  }

  // Build styles from CSS rules for classes we actually use
  const styles = [];

  for (const [className, styleId] of classIds) {
    const base = rules.get(className) ?? { decls: [], variants: {} };

    // Custom properties (--x) no son expresables en el panel de estilos del
    // Designer: van como regla normal al head Custom Code (aplica a la clase
    // pegada) — sin esto los modificadores var-driven pegan SIN estilo.
    const varDecls = (base.decls ?? []).filter((d) => d.prop.startsWith('--'));
    const cssDecls = (base.decls ?? []).filter((d) => !d.prop.startsWith('--'));
    if (varDecls.length) {
      headChunks.push(
        `.${className} {\n  ${varDecls.map((d) => `${d.prop}: ${d.value};`).join('\n  ')}\n}`,
      );
      unsupported.push({
        prop: '--custom-properties',
        selector: `.${className}`,
        reason: 'CSS custom properties — moved to head Custom Code (Designer styles cannot declare them)',
      });
    }
    base.decls = cssDecls;

    const variants = { ...base.variants };
    for (const { bp, rules: mediaMap } of mappedMedia) {
      const mediaClass = mediaMap.get(className);
      if (mediaClass?.decls?.length) {
        variants[bp] = {
          styleLess: declsToStyleLess(mediaClass.decls, unsupported, `.${className}@${bp}`),
        };
      }
    }

    // Shape exacto del dump real del Designer: sin `origin`.
    // Namespace ds- (misma convención y transform que webflow.css): las clases
    // de Webflow son globales y los sitios reales están sucios — sin prefijo,
    // cualquier clase preexistente fuerza el rename ("divider 2") y el elemento
    // queda huérfano del canal. Con ds-, la colisión es imposible por diseño.
    styles.push({
      _id: styleId,
      fake: false,
      type: 'class',
      name: prefixClassName(className),
      namespace: '',
      comb: '',
      styleLess: declsToStyleLess(base.decls, unsupported, `.${className}`),
      variants,
      children: [],
      createdBy: CREATED_BY,
      selector: null,
    });
  }

  // Shape exacto del payload real: nodes/styles/assets/ix1/ix2 — sin styleOverrides.
  const clipboard = {
    type: '@webflow/XscpData',
    payload: {
      nodes,
      styles,
      assets: [],
      ix1: [],
      ix2: { interactions: [], events: [], actionLists: [] },
    },
    meta: {
      unlinkedSymbolCount: 0,
      droppedLinks: 0,
      dynBindRemovedCount: 0,
      dynListBindRemovedCount: 0,
      paginationRemovedCount: 0,
    },
  };

  // El head viaja por el MISMO transform ds- que webflow.css (AST, ADR 006):
  // selectores compuestos, custom props y svg matchean las clases prefijadas.
  const rawHead = [keyframes.trim(), ...headChunks].filter(Boolean).join('\n\n');
  const headCss = rawHead ? prefixWebflowCss(rawHead) : '';
  const footerNote =
    'Load Atom foundation/tokens on the site if this component uses CSS variables ' +
    '(prefer /v1/embed.css scoped under .atom-embed for partial migrations — see docs/webflow-playbook.md). ' +
    'GSAP: enable Webflow site-wide GSAP only if the component requires it; Atom motion may use CDN /v1/animations.js instead.';

  return {
    clipboard,
    headCss,
    footerNote,
    unsupported,
  };
}

/**
 * Normalize _ids for structural compare (F6-C1).
 * @param {object} xscp
 */
export function normalizeIds(xscp) {
  const clone = structuredClone(xscp);
  const map = new Map();
  let n = 0;
  const ren = (id) => {
    if (!map.has(id)) map.set(id, `id-${++n}`);
    return map.get(id);
  };

  // classes referencian style _ids: para comparar semánticamente, se resuelven
  // a NOMBRES de clase (estables) antes de renombrar los ids.
  const styleName = new Map(
    (clone.payload?.styles ?? []).map((s) => [s._id, s.name]),
  );

  for (const node of clone.payload?.nodes ?? []) {
    if (node._id) node._id = ren(node._id);
    if (Array.isArray(node.children)) node.children = node.children.map(ren);
    if (Array.isArray(node.classes)) {
      node.classes = node.classes.map((c) => styleName.get(c) ?? c);
    }
  }
  for (const style of clone.payload?.styles ?? []) {
    if (style._id) style._id = ren(style._id);
  }
  return clone;
}

/**
 * Structural equality ignoring order of styleLess property declarations.
 * @param {object} a
 * @param {object} b
 */
export function structuralEqual(a, b) {
  const na = normalizeIds(a);
  const nb = normalizeIds(b);
  // Compare node tree shape
  const nodesA = na.payload.nodes.filter((n) => !n.text);
  const nodesB = nb.payload.nodes.filter((n) => !n.text);
  if (nodesA.length !== nodesB.length) return false;
  for (let i = 0; i < nodesA.length; i++) {
    if (nodesA[i].type !== nodesB[i].type) return false;
    if (nodesA[i].tag !== nodesB[i].tag) return false;
    const ca = [...(nodesA[i].classes ?? [])].sort().join(',');
    const cb = [...(nodesB[i].classes ?? [])].sort().join(',');
    if (ca !== cb) return false;
  }
  const stylesA = new Map((na.payload.styles ?? []).map((s) => [s.name, s]));
  const stylesB = new Map((nb.payload.styles ?? []).map((s) => [s.name, s]));
  if (stylesA.size !== stylesB.size) return false;
  for (const [name, sa] of stylesA) {
    const sb = stylesB.get(name);
    if (!sb) return false;
    if (canonStyleLess(sa.styleLess) !== canonStyleLess(sb.styleLess)) return false;
  }
  return true;
}

function canonStyleLess(s) {
  return String(s ?? '')
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.replace(/\s+/g, ' '))
    .sort()
    .join('; ');
}

/**
 * IDs deterministas con la forma UUID del Designer (hex 8-4-4-4-12).
 * Reproducibles por (slug, n) para los tests; el Designer re-asigna al pegar.
 */
function nextId(state) {
  state.n += 1;
  const a = fnv1a(state.slug);
  const b = fnv1a(`${state.slug}:${state.n}`);
  const n4 = (state.n % 0xffff).toString(16).padStart(4, '0');
  return `${a}-${n4}-4${b.slice(0, 3)}-8${b.slice(3, 6)}-${b}${a.slice(0, 4)}`;
}

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function declsToStyleLess(decls, unsupported, selector) {
  const parts = [];
  for (const { prop, value } of decls) {
    if (prop.startsWith('--')) {
      // Custom props en variants/media (raro): declararlas en la base o tokens.
      unsupported.push({
        prop,
        selector,
        reason: 'custom property inside a variant — declare it on the base class or tokens sheet',
      });
      continue;
    }
    if (UNSUPPORTED_PROPS.has(prop)) {
      unsupported.push({
        prop,
        selector,
        reason: 'property not mapped into Webflow styleLess',
      });
      continue;
    }
    parts.push(`${prop}: ${value}`);
  }
  return parts.length ? parts.join('; ') + ';' : '';
}

function mediaToBreakpoint(query) {
  const m = query.match(/max-width:\s*(\d+)px/i);
  if (!m) return null;
  const px = Number(m[1]);
  if (px <= 479) return 'tiny';
  if (px <= 767) return 'small';
  if (px <= 991) return 'medium';
  // >991 max-width no existe como variant desktop-first en Webflow
  // ("large"+ son breakpoints min-width). Va al head Custom Code.
  return null;
}

/**
 * Minimal CSS parser: class rules, :pseudo, @media blocks, @keyframes extraction.
 */
function parseCss(css, unsupported) {
  const stripped = String(css ?? '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/:[a-z-]*-webkit-[^;{]+;?/gi, ''); // drop webkit-only noise occasionally

  const keyframesChunks = [];
  let body = stripped.replace(/@keyframes\s+[\w-]+\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, (m) => {
    keyframesChunks.push(m.trim());
    return '\n';
  });

  /** @type {Map<string, { decls: Array<{prop:string,value:string}>, variants: Record<string, {styleLess:string}> }>} */
  const rules = new Map();
  /** @type {Array<{ query: string, rules: Map<string, { decls: Array<{prop:string,value:string}> }> }>} */
  const mediaRules = [];

  // @media blocks — escáner de llaves (no regex: los cierres indentados y los
  // bloques anidados la rompen). Conserva `raw` completo para poder moverlo al
  // head si el query no mapea a un breakpoint del Designer.
  const complexRules = [];
  const extracted = extractMediaBlocks(body);
  body = extracted.body;
  for (const blk of extracted.blocks) {
    const map = new Map();
    const mediaComplex = [];
    parseRuleBlock(blk.inner, map, null, unsupported, mediaComplex);
    mediaRules.push({ query: blk.query, raw: blk.raw, rules: map, complex: mediaComplex });
  }

  parseRuleBlock(body, rules, null, unsupported, complexRules);

  // Convert map values to full shape with variants for pseudo
  const out = new Map();
  for (const [key, val] of rules) {
    if (key.includes(':')) {
      const [cls, pseudo] = key.split(':');
      const variant = PSEUDO_VARIANT[pseudo];
      if (!variant) {
        unsupported.push({
          prop: `:${pseudo}`,
          selector: `.${key}`,
          reason: 'pseudo-class not mapped to Webflow variant',
        });
        continue;
      }
      if (!out.has(cls)) out.set(cls, { decls: [], variants: {} });
      out.get(cls).variants[variant] = {
        styleLess: declsToStyleLess(val.decls ?? val, unsupported, `.${key}`),
      };
    } else {
      if (!out.has(key)) out.set(key, { decls: [], variants: {} });
      out.get(key).decls = val.decls ?? val;
      if (val.variants) Object.assign(out.get(key).variants, val.variants);
    }
  }

  // mediaRules values are Map className → {decls}
  const mediaNormalized = mediaRules.map((mr) => {
    const map = new Map();
    for (const [k, v] of mr.rules) {
      if (k.includes(':')) continue;
      map.set(k, { decls: v.decls ?? v });
    }
    return { query: mr.query, raw: mr.raw, rules: map, complex: mr.complex ?? [] };
  });

  return {
    rules: out,
    keyframes: keyframesChunks.join('\n\n'),
    mediaRules: mediaNormalized,
    complexRules,
  };
}

/**
 * Extrae bloques @media de nivel superior contando llaves.
 * @returns {{ body: string, blocks: Array<{query:string, raw:string, inner:string}> }}
 */
function extractMediaBlocks(css) {
  const blocks = [];
  let body = '';
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf('@media', i);
    if (at === -1) {
      body += css.slice(i);
      break;
    }
    body += css.slice(i, at);
    const braceOpen = css.indexOf('{', at);
    if (braceOpen === -1) {
      body += css.slice(at);
      break;
    }
    let depth = 1;
    let j = braceOpen + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    blocks.push({
      query: css.slice(at + '@media'.length, braceOpen).trim(),
      raw: css.slice(at, j).trim(),
      inner: css.slice(braceOpen + 1, j - 1),
    });
    i = j;
  }
  return { body, blocks };
}

/**
 * Tokeniza `selector { block }` completos. SOLO los selectores simples
 * (`.clase` / `.clase:pseudo`) entran al map de styleLess; cualquier otro
 * (compuestos `.a.b`, descendientes, listas, ::pseudo-elementos) sale por
 * `complexOut` para viajar al head Custom Code con su semántica intacta.
 * Nunca se atribuye un selector compuesto a una sola clase (pegaría estilos
 * de una variante en otra).
 */
function parseRuleBlock(css, map, _variant, unsupported, complexOut) {
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const sel = m[1].trim();
    const body = m[2];
    if (!sel || !body.trim()) continue;
    const simple = sel.match(/^\.([a-zA-Z0-9_-]+)(?::([a-zA-Z0-9_-]+))?$/);
    if (simple) {
      const key = simple[2] ? `${simple[1]}:${simple[2]}` : simple[1];
      const decls = parseDecls(body);
      if (!map.has(key)) map.set(key, { decls: [] });
      map.get(key).decls.push(...decls);
    } else if (complexOut) {
      complexOut.push({ selector: sel, block: `${sel} {${body.trimEnd()}\n}` });
    }
  }
}

function parseDecls(block) {
  const decls = [];
  for (const part of block.split(';')) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const prop = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!prop || !value) continue;
    // custom props (--x) se conservan: el caller decide (base → head Custom Code)
    decls.push({ prop, value });
  }
  return decls;
}

/**
 * Very small HTML parser for well-formed pilot templates (no scripts).
 * @returns {Array}
 */
function parseHtml(html) {
  if (!html) return [];
  // Wrap for single root optional
  const tokens = tokenize(html);
  const roots = [];
  let i = 0;

  function parseNodes() {
    const list = [];
    while (i < tokens.length) {
      const t = tokens[i];
      if (t.kind === 'close') break;
      if (t.kind === 'text') {
        const text = t.value.replace(/\s+/g, ' ').trim();
        i++;
        if (text) list.push({ type: 'text', value: text });
        continue;
      }
      if (t.kind === 'open') {
        i++;
        const children = t.selfClosing ? [] : parseNodes();
        if (!t.selfClosing && tokens[i]?.kind === 'close' && tokens[i].tag === t.tag) {
          i++;
        } else if (!t.selfClosing) {
          // unclosed — stop
        }
        list.push({
          type: 'el',
          tag: t.tag,
          classes: t.classes,
          attrs: t.attrs,
          children,
        });
        continue;
      }
      i++;
    }
    return list;
  }

  return parseNodes();
}

function tokenize(html) {
  const tokens = [];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9-]+)\s*>|<([a-zA-Z0-9-]+)([^>]*)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[0].startsWith('<!--')) continue;
    if (m[1]) {
      tokens.push({ kind: 'close', tag: m[1].toLowerCase() });
    } else if (m[2]) {
      const tag = m[2].toLowerCase();
      const attrStr = m[3] ?? '';
      const selfClosing = /\/>$/.test(attrStr) || ['img', 'br', 'hr', 'input'].includes(tag);
      const attrs = {};
      const classes = [];
      const attrRe = /([:@a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
      let a;
      while ((a = attrRe.exec(attrStr)) !== null) {
        const name = a[1];
        if (name === '/' || name.startsWith('/')) continue;
        const val = a[2] ?? a[3] ?? a[4] ?? '';
        if (name === 'class') {
          classes.push(...val.split(/\s+/).filter(Boolean));
        } else {
          attrs[name] = val;
        }
      }
      tokens.push({ kind: 'open', tag, classes, attrs, selfClosing });
    } else if (m[4]) {
      tokens.push({ kind: 'text', value: m[4] });
    }
  }
  return tokens;
}

/**
 * F6 — Resuelve los tokens (var(--x)) que un CSS usa contra tokens-nested.json
 * y devuelve un bloque `:root { … }` autocontenido para el head de Webflow.
 * Confirmado en paste real 2026-07-31: sin esto, TODA declaración con var()
 * es inválida en un sitio Webflow sin el foundation del DS cargado.
 *
 * Lookup: (1) top-level directo (semánticos: --muted, --gap-xl);
 * (2) longest-prefix por categoría (--spacing-1 → spacing['1'],
 * --font-size-xs → 'font-size'['xs']). Valores light-only (wave 1).
 *
 * @param {string} css - CSS que referencia tokens (styleLess + head chunks)
 * @param {Record<string, unknown>} nested - tokens-nested.json parseado
 * @returns {{ tokensCss: string, resolved: string[], unresolved: string[] }}
 */
export function resolveTokensCss(css, nested) {
  // Descenso recursivo greedy: --color-coral-300 → color.coral['300'],
  // --font-size-xs → 'font-size'.xs, --muted → muted (semántico top-level).
  const descend = (obj, name) => {
    if (typeof obj !== 'object' || obj === null) return null;
    const direct = obj[name];
    if (typeof direct === 'string' || typeof direct === 'number') return String(direct);
    const keys = Object.keys(obj)
      .filter((k) => typeof obj[k] === 'object' && obj[k] !== null)
      .sort((a, b) => b.length - a.length);
    for (const key of keys) {
      if (name.startsWith(`${key}-`)) {
        const found = descend(obj[key], name.slice(key.length + 1));
        if (found !== null) return found;
      }
    }
    return null;
  };
  const lookup = (name) => descend(nested, name);

  const resolved = new Map();
  const unresolved = new Set();
  let frontier = new Set([...css.matchAll(/var\(\s*--([a-zA-Z0-9-]+)/g)].map((m) => m[1]));

  // Los valores resueltos pueden referenciar otros tokens: cerrar transitivamente.
  for (let depth = 0; depth < 5 && frontier.size; depth++) {
    const next = new Set();
    for (const name of frontier) {
      if (resolved.has(name) || unresolved.has(name)) continue;
      const value = lookup(name);
      if (value === null) {
        unresolved.add(name);
        continue;
      }
      resolved.set(name, value);
      for (const m of value.matchAll(/var\(\s*--([a-zA-Z0-9-]+)/g)) next.add(m[1]);
    }
    frontier = next;
  }

  const names = [...resolved.keys()].sort();
  const tokensCss = names.length
    ? `:root {\n${names.map((n) => `  --${n}: ${resolved.get(n)};`).join('\n')}\n}`
    : '';
  return { tokensCss, resolved: names, unresolved: [...unresolved].sort() };
}

/**
 * Package → markdown sections for MCP (no component content hardcoding beyond risk text).
 */
export function formatWebflowMarkdown(slug, pkg) {
  const risk =
    '⚠ **Risk:** `@webflow/XscpData` is an undocumented Webflow internal format ' +
    '(community reverse-engineered). Webflow may change it without notice. ' +
    'This export is a **regenerable artifact**, not a runtime dependency. ' +
    'If paste fails, fall back to HTML Embed + `/v1/embed.css` (webflow-playbook).';

  const steps = [
    '### Paste steps',
    '1. Copy the **Clipboard JSON** below as `application/json` (use the copy helper or a clipboard inspector).',
    '2. In Webflow Designer, click the canvas and **Paste** (⌘V / Ctrl+V).',
    '3. If **Head CSS** is non-empty, paste it into **Site settings → Custom Code → Head**.',
    '4. Apply the footer note (foundation/tokens) for variables the component uses.',
    '5. Publish a staging subdomain and verify breakpoints + motion.',
  ].join('\n');

  const unsupportedBlock =
    pkg.unsupported.length > 0
      ? [
          '## Unsupported (not silent)',
          ...pkg.unsupported.map(
            (u) => `- \`${u.prop}\` on \`${u.selector}\` — ${u.reason}`,
          ),
        ].join('\n')
      : '## Unsupported\n_None reported._';

  const headSection = pkg.headCss
    ? `## Head CSS (at-rules not carried by paste)\n\`\`\`css\n${pkg.headCss}\n\`\`\``
    : '## Head CSS\n_None — no @keyframes/@font-face extracted._';

  return [
    `# ${slug} — Webflow export`,
    risk,
    '',
    steps,
    '',
    '## Clipboard JSON (`@webflow/XscpData`)',
    '```json',
    JSON.stringify(pkg.clipboard, null, 2),
    '```',
    '',
    headSection,
    '',
    '## Footer note',
    pkg.footerNote,
    '',
    unsupportedBlock,
  ].join('\n');
}
