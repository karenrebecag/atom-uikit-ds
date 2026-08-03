/**
 * F12a — Emit meta.derived (mechanical doc layer) from DS source.
 * Never invent prose. Partial degradation with reason when source missing.
 *
 * Pure helpers are exported for tests. CLI/build uses deriveItemDoc().
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_JSON = path.join(ROOT, 'packages/tokens/build/json/tokens.json');
const CSS_COMPONENTS_DIR = path.join(ROOT, 'packages/css/src/components');

/**
 * @returns {string}
 */
export function getSourceCommit(cwd = ROOT) {
  try {
    return execSync('git rev-parse --short HEAD', { cwd, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

/**
 * Load fully-resolved Style Dictionary tokens.json (camelCase keys → literals).
 * @param {string} [tokensPath]
 * @returns {Record<string, string>}
 */
export function loadResolvedTokens(tokensPath = TOKENS_JSON) {
  if (!fs.existsSync(tokensPath)) {
    throw new Error(`derive-doc: missing ${tokensPath} — run tokens build first`);
  }
  const raw = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  /** @type {Record<string, string>} */
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v != null && typeof v !== 'object') out[k] = String(v);
  }
  return out;
}

/**
 * camelCase → token path segments for reporting (buttonBgPrimary → button.bg.primary)
 * @param {string} key
 */
export function camelToTokenPath(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1.$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1.$2')
    .toLowerCase();
}

/**
 * Prefixes used in tokens.json for a registry slug (button → button, icon-button → iconButton)
 * @param {string} slug
 */
export function slugToTokenPrefix(slug) {
  return String(slug)
    .split(/[-_/]/)
    .filter(Boolean)
    .map((p, i) => (i === 0 ? p.toLowerCase() : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()))
    .join('');
}

/**
 * Resolve component color/size tokens from the flat tokens map.
 * @param {string} slug
 * @param {Record<string, string>} tokens
 * @param {{ variants?: string[], sizes?: string[] }} [discovery]
 */
export function resolveComponentTokens(slug, tokens, discovery = {}) {
  const prefix = slugToTokenPrefix(slug);
  /** @type {Array<{ variant: string, prop: string, hex: string, tokenPath: string }>} */
  const resolved = [];
  /** @type {Array<{ size: string, height: string, paddingX: string, fontSize: string }>} */
  const sizes = [];

  const colorProps = ['Bg', 'Fg', 'Border', 'HoverBg', 'PressedBg'];
  const variants = discovery.variants?.length
    ? discovery.variants
    : guessVariantsFromTokens(prefix, tokens);

  for (const variant of variants) {
    const vKey = variant
      .split(/[-_]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('');
    for (const prop of colorProps) {
      const key = `${prefix}${prop}${vKey}`;
      const alt = `${prefix}${prop}${vKey === 'Primary' ? '' : vKey}`;
      const val = tokens[key] ?? tokens[alt];
      if (val == null) continue;
      resolved.push({
        variant,
        prop: prop.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`).replace(/^-/, ''),
        hex: normalizeColor(val),
        tokenPath: camelToTokenPath(key),
      });
    }
  }

  // generic "all" color props (disabled-fg etc.)
  for (const [key, val] of Object.entries(tokens)) {
    if (!key.startsWith(prefix)) continue;
    if (!/Fg|Bg|Border|Color|Stroke/.test(key)) continue;
    if (resolved.some((r) => camelToTokenPath(key) === r.tokenPath)) continue;
    if (/Height|Padding|Font|Radius|Gap|Size|Width|Space/.test(key)) continue;
    // only leftover non-variant keys
    if (/All$|Default$/.test(key) || key === `${prefix}DisabledFgAll` || /Disabled/.test(key)) {
      resolved.push({
        variant: 'all',
        prop: camelToTokenPath(key).replace(new RegExp(`^${prefix.toLowerCase()}\\.?`), ''),
        hex: normalizeColor(val),
        tokenPath: camelToTokenPath(key),
      });
    }
  }

  const sizeList = discovery.sizes?.length
    ? discovery.sizes
    : guessSizesFromTokens(prefix, tokens);

  for (const size of sizeList) {
    const sKey = size.charAt(0).toUpperCase() + size.slice(1);
    const height = tokens[`${prefix}Height${sKey}`] ?? tokens[`${prefix}HeightAll`];
    const paddingX =
      tokens[`${prefix}PaddingX${sKey}`] ??
      tokens[`${prefix}Padding${sKey}`] ??
      tokens[`${prefix}PaddingXAll`];
    const fontSize =
      tokens[`${prefix}FontSize${sKey}`] ?? tokens[`${prefix}FontSizeAll`] ?? '';
    if (height || paddingX || fontSize) {
      sizes.push({
        size,
        height: height ?? '',
        paddingX: paddingX ?? '',
        fontSize: fontSize ?? '',
      });
    }
  }

  return { resolved, sizes, prefix };
}

/**
 * @param {string} prefix
 * @param {Record<string, string>} tokens
 */
function guessVariantsFromTokens(prefix, tokens) {
  const found = new Set();
  const re = new RegExp(`^${prefix}Bg([A-Z][A-Za-z0-9]*)$`);
  for (const key of Object.keys(tokens)) {
    const m = key.match(re);
    if (!m) continue;
    const raw = m[1];
    // DestructivePrimary → destructive-primary
    const kebab = raw
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
    found.add(kebab);
  }
  return [...found];
}

/**
 * @param {string} prefix
 * @param {Record<string, string>} tokens
 */
function guessSizesFromTokens(prefix, tokens) {
  const found = new Set();
  const re = new RegExp(`^${prefix}Height([A-Za-z0-9]+)$`);
  for (const key of Object.keys(tokens)) {
    const m = key.match(re);
    if (!m || m[1] === 'All') continue;
    found.add(m[1].toLowerCase());
  }
  return [...found];
}

/**
 * @param {string} val
 */
export function normalizeColor(val) {
  const s = String(val).trim().toLowerCase();
  if (s === 'transparent') return 'transparent';
  // #rgb → #rrggbb
  if (/^#[0-9a-f]{3}$/i.test(s)) {
    return `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`;
  }
  // 8-digit hex keep as-is
  if (/^#[0-9a-f]{6,8}$/i.test(s)) return s.startsWith('#') ? s : `#${s}`;
  // rgba(0,0,0,0) → transparent-ish keep
  return s;
}

/**
 * Find CSS source file for a component slug under packages/css/src/components.
 * @param {string} slug
 * @param {string} [cssRoot]
 * @returns {string | null}
 */
export function findCssPath(slug, cssRoot = CSS_COMPONENTS_DIR) {
  if (!fs.existsSync(cssRoot)) return null;
  const leaf = String(slug).split('/').pop();
  const byName = [
    path.join(cssRoot, `${slug}.css`),
    path.join(cssRoot, `${leaf}.css`),
    ...walkFiles(cssRoot).filter(
      (f) => path.basename(f) === `${slug}.css` || path.basename(f) === `${leaf}.css`,
    ),
  ].find((f) => fs.existsSync(f));
  if (byName) return byName;
  // e.g. burger-icon lives in menu-button.css
  const classRe = new RegExp(`\\.${leaf.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:--|[\\s.{,:]|$)`);
  for (const f of walkFiles(cssRoot)) {
    try {
      if (classRe.test(fs.readFileSync(f, 'utf8'))) return f;
    } catch {
      /* skip */
    }
  }
  return null;
}

/** Root class names in a stylesheet (no -- / __). */
export function guessBaseClasses(css) {
  const set = new Set();
  for (const m of String(css).matchAll(/\.([a-zA-Z][a-zA-Z0-9-]*)/g)) {
    const c = m[1];
    if (c.includes('__') || c.includes('--')) continue;
    if (c.length < 2) continue;
    set.add(c);
  }
  return [...set];
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walkFiles(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkFiles(p));
    else if (ent.name.endsWith('.css')) out.push(p);
  }
  return out;
}

/**
 * Extract BEM-ish class names and rough purpose from CSS text.
 * @param {string} css
 * @param {string} [baseClass]
 */
export function extractBemAnatomy(css, baseClass) {
  const classes = new Set();
  for (const m of css.matchAll(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g)) {
    classes.add(m[1]);
  }
  // filter to component family if base known
  let list = [...classes];
  if (baseClass) {
    list = list.filter((c) => c === baseClass || c.startsWith(`${baseClass}--`) || c.startsWith(`${baseClass}__`));
  }
  list.sort();
  const bemHtml = baseClass
    ? `<div class="${baseClass}">\n${list
        .filter((c) => c.startsWith(`${baseClass}__`))
        .map((c) => `  <span class="${c}"></span>`)
        .join('\n')}\n</div>`
    : list.map((c) => `.${c}`).join('\n');

  return {
    bem: bemHtml,
    classes: list.map((c) => ({
      class: c,
      purpose: purposeForClass(c, baseClass),
    })),
  };
}

/**
 * @param {string} c
 * @param {string} [base]
 */
function purposeForClass(c, base) {
  if (base && c === base) return 'root';
  if (c.includes('__')) return 'element';
  if (c.includes('--')) return 'modifier';
  return 'class';
}

/**
 * Extract transition/animation declarations from CSS.
 * @param {string} css
 */
export function extractMotion(css) {
  /** @type {Array<{ property: string, duration: string, easing: string }>} */
  const motion = [];
  // transition: prop dur ease, ...
  for (const m of css.matchAll(/transition\s*:\s*([^;{}]+);/gi)) {
    const parts = m[1].split(',').map((s) => s.trim());
    for (const part of parts) {
      if (part === 'none' || !part) continue;
      const bits = part.split(/\s+/);
      motion.push({
        property: bits[0] || 'all',
        duration: bits[1] || '',
        easing: bits.slice(2).join(' ') || '',
      });
    }
  }
  for (const m of css.matchAll(/@keyframes\s+([a-zA-Z0-9_-]+)/g)) {
    motion.push({ property: `@keyframes ${m[1]}`, duration: '', easing: '' });
  }
  return motion;
}

/** Map --button-bg-primary → buttonBgPrimary; --color-neutral-800 → colorNeutral800 */
export function cssVarToTokenKey(varName) {
  const bare = String(varName).replace(/^--/, '');
  return bare
    .split('-')
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join('');
}

/**
 * Resolve a CSS custom property against the flat tokens map.
 * Never invents: unresolved returns `var(--name)` as hex field.
 * @param {string} varName e.g. --muted or muted
 * @param {Record<string, string>} tokens
 * @returns {{ hex: string, tokenPath: string, resolved: boolean }}
 */
export function resolveCssVar(varName, tokens) {
  const name = String(varName).startsWith('--') ? String(varName) : `--${varName}`;
  const key = cssVarToTokenKey(name);
  if (tokens[key] != null) {
    return { hex: normalizeColor(tokens[key]), tokenPath: camelToTokenPath(key), resolved: true };
  }
  const short = name.slice(2);
  const camel = short.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  if (tokens[camel] != null) {
    return { hex: normalizeColor(tokens[camel]), tokenPath: camel, resolved: true };
  }
  // never invent
  return { hex: `var(${name})`, tokenPath: name, resolved: false };
}

/**
 * Build standalone CSS with var() left as-is when unresolved; substitute known
 * component tokens from the flat map when the var name maps to a token.
 * @param {string} css
 * @param {Record<string, string>} tokens
 */
export function buildStandaloneCss(css, tokens) {
  return css.replace(/var\(\s*(--[a-zA-Z0-9-]+)\s*(?:,\s*([^)]+))?\)/g, (full, name, fallback) => {
    const r = resolveCssVar(name, tokens);
    if (r.resolved) return r.hex;
    if (fallback != null) return fallback.trim();
    return full; // leave unresolved — never invent
  });
}

/** State-like BEM modifiers / pseudo / attrs → prop prefix (empty = default bg/fg) */
const STATE_MODS = new Set([
  'enabled',
  'hover',
  'focus',
  'focused',
  'active',
  'pressed',
  'disabled',
  'subtle',
  'error',
  'open',
  'closed',
  'checked',
  'unchecked',
  'loading',
  'selected',
  'invalid',
]);

const COLOR_PROPS = {
  'background-color': 'bg',
  background: 'bg',
  color: 'fg',
  'border-color': 'border',
  border: 'border',
  'outline-color': 'outline',
  fill: 'fill',
  stroke: 'stroke',
};

/**
 * F14 — Extract color declarations from component CSS (selector → variant/prop).
 * Uses resolveCssVar for the same 3-layer map as buildStandaloneCss.
 *
 * @param {string} css
 * @param {string} baseClass e.g. badge
 * @param {Record<string, string>} tokens
 * @returns {Array<{ variant: string, prop: string, hex: string, tokenPath: string }>}
 */
/**
 * @param {string} css
 * @param {string} baseClass e.g. badge — empty string enables loose mode (any rule with color)
 * @param {Record<string, string>} tokens
 */
export function extractTokensFromCss(css, baseClass, tokens) {
  if (!css) return [];
  const stripped = String(css).replace(/\/\*[\s\S]*?\*\//g, '');
  const loose = !baseClass;
  /** @type {Map<string, { variant: string, prop: string, hex: string, tokenPath: string }>} */
  const byKey = new Map();

  const ruleRe = /([^{}@]+)\{([^{}]*)\}/g;
  let m;
  while ((m = ruleRe.exec(stripped)) !== null) {
    const selectorGroup = m[1].trim();
    const body = m[2];
    if (!selectorGroup || !body) continue;
    // comma-separated selectors share the same body
    for (const rawSel of selectorGroup.split(',')) {
      const sel = rawSel.trim();
      if (sel.startsWith('@')) continue;
      if (!loose && baseClass && !sel.includes(`.${baseClass}`)) continue;

      const decls = parseColorDeclarations(body);
      if (!decls.length) continue;

      const { variant, state } = loose
        ? parseLooseSelector(sel)
        : parseBemSelector(sel, baseClass);
      for (const d of decls) {
        const prop = composeProp(d.role, state);
        const resolved = resolveColorValue(d.value, tokens);
        const mapKey = `${variant}::${prop}`;
        // last declaration in file wins (same as browser for equal specificity within file)
        byKey.set(mapKey, {
          variant,
          prop,
          hex: resolved.hex,
          tokenPath: resolved.tokenPath,
        });
      }
    }
  }

  return [...byKey.values()];
}

/** Loose: attribute/pseudo rules without BEM root → variant all + state from pseudo. */
function parseLooseSelector(selector) {
  let s = selector.replace(/::[a-zA-Z-]+/g, '');
  let state = '';
  if (/:hover\b/.test(s)) state = 'hover';
  else if (/:focus-visible\b|:focus\b/.test(s)) state = 'focused';
  else if (/:active\b/.test(s)) state = 'pressed';
  else if (/\[disabled\]|:disabled\b/.test(s)) state = 'disabled';
  // BEM-ish class still helps when present
  const bem = s.match(/\.([a-zA-Z][a-zA-Z0-9-]*)--([a-zA-Z0-9-]+)/);
  if (bem && !STATE_MODS.has(bem[2])) {
    return { variant: bem[2], state };
  }
  return { variant: 'all', state };
}

/**
 * @param {string} selector
 * @param {string} baseClass
 */
export function parseBemSelector(selector, baseClass) {
  // strip pseudo-elements
  let s = selector.replace(/::[a-zA-Z-]+/g, '');
  /** @type {string[]} */
  const mods = [];
  const modRe = new RegExp(`\\.${baseClass}--([a-zA-Z0-9-]+)`, 'g');
  let mm;
  while ((mm = modRe.exec(s)) !== null) mods.push(mm[1]);

  let state = '';
  if (/:hover\b/.test(s)) state = 'hover';
  else if (/:focus-visible\b|:focus\b/.test(s)) state = 'focused';
  else if (/:active\b/.test(s)) state = 'pressed';
  else if (/\[disabled\]|:disabled\b/.test(s)) state = 'disabled';
  else if (/\[data-state=["']?open/.test(s)) state = 'open';
  else if (/\[data-state=["']?checked/.test(s)) state = 'checked';
  else if (/\[data-invalid\]|:invalid\b/.test(s)) state = 'error';

  /** @type {string[]} */
  const variants = [];
  for (const mod of mods) {
    if (STATE_MODS.has(mod)) {
      if (!state || mod !== 'enabled') {
        if (mod === 'enabled') {
          /* default surface — no prop prefix */
        } else if (mod === 'focus') state = 'focused';
        else if (mod === 'active') state = 'pressed';
        else state = mod;
      }
    } else {
      variants.push(mod);
    }
  }

  const variant = variants[0] || 'all';
  return { variant, state };
}

/**
 * @param {string} body
 * @returns {Array<{ role: string, value: string }>}
 */
function parseColorDeclarations(body) {
  /** @type {Array<{ role: string, value: string }>} */
  const out = [];
  for (const [cssProp, role] of Object.entries(COLOR_PROPS)) {
    const re = new RegExp(`(?:^|;)\\s*${cssProp}\\s*:\\s*([^;]+)`, 'gi');
    let dm;
    while ((dm = re.exec(body)) !== null) {
      out.push({ role, value: dm[1].trim() });
    }
  }
  // border-top / border-bottom / … with color or var()
  const borderSide = /(?:^|;)\s*border(?:-top|-right|-bottom|-left)?(?:-color)?\s*:\s*([^;]+)/gi;
  let bm;
  while ((bm = borderSide.exec(body)) !== null) {
    const val = bm[1].trim();
    if (/var\(|#|rgb|hsl|transparent/i.test(val)) {
      out.push({ role: 'border', value: val });
    }
  }
  return out;
}

/**
 * @param {string} role bg|fg|…
 * @param {string} state
 */
function composeProp(role, state) {
  if (!state || state === 'enabled') return role;
  return `${state}-${role}`;
}

/**
 * Resolve a CSS color value (var(...) or literal) without inventing.
 * @param {string} value
 * @param {Record<string, string>} tokens
 */
function resolveColorValue(value, tokens) {
  const v = value.trim();
  const varMatch = v.match(/^var\(\s*(--[a-zA-Z0-9-]+)\s*(?:,\s*([^)]+))?\s*\)$/i);
  if (varMatch) {
    const r = resolveCssVar(varMatch[1], tokens);
    if (r.resolved) return r;
    if (varMatch[2]) {
      const fb = varMatch[2].trim();
      // fallback may itself be a color literal
      if (/^#|^rgb|^hsl|transparent/i.test(fb)) {
        return { hex: normalizeColor(fb), tokenPath: varMatch[1], resolved: false };
      }
    }
    return r; // unresolved var(--name)
  }
  // literal color / CSS keywords (not invented — declared in source)
  if (/^#|^rgb|^hsl|transparent|currentcolor|inherit/i.test(v)) {
    return { hex: /^currentcolor$/i.test(v) ? 'currentColor' : normalizeColor(v), tokenPath: '(literal)', resolved: true };
  }
  // multi-value border: 1px solid var(--x) — try to find a var inside
  const inner = v.match(/var\(\s*(--[a-zA-Z0-9-]+)/);
  if (inner) return resolveCssVar(inner[1], tokens);
  return { hex: v, tokenPath: '(unparsed)', resolved: false };
}

/**
 * Derive meta.derived for one registry item.
 *
 * @param {{
 *   name: string,
 *   atom?: { discovery?: any, implementation?: any },
 *   files?: Array<{ path?: string, content?: string }>,
 * }} item
 * @param {{
 *   tokens?: Record<string, string>,
 *   sourceCommit?: string,
 *   cssOverride?: string | null,
 *   now?: string,
 * }} [opts]
 */
export function deriveItemDoc(item, opts = {}) {
  const slug = item.name;
  const tokens = opts.tokens ?? loadResolvedTokens();
  const sourceCommit = opts.sourceCommit ?? getSourceCommit();
  const generatedAt = opts.now ?? new Date().toISOString();
  /** @type {string[]} */
  const degrade = [];

  const discovery = item.atom?.discovery ?? {};
  const impl = item.atom?.implementation ?? {};
  const baseClass = impl.baseClass || slugToTokenPrefix(slug);

  let css = opts.cssOverride;
  if (css === undefined) {
    const cssPath = findCssPath(slug);
    if (cssPath) {
      css = fs.readFileSync(cssPath, 'utf8');
    } else {
      // layout/hook packages embed css in registry files[] (after enrich) or on disk
      const cssFile = (item.files ?? []).find(
        (f) =>
          (typeof f.path === 'string' && f.path.endsWith('.css') && f.content) ||
          (typeof f.outputPath === 'string' && f.outputPath.endsWith('.css') && f.content),
      );
      css = cssFile?.content ?? null;
      if (!css && String(slug).startsWith('layout/')) {
        const leaf = String(slug).split('/').pop();
        const layoutCss = path.join(ROOT, 'packages/layouts/src', `${leaf}.css`);
        if (fs.existsSync(layoutCss)) css = fs.readFileSync(layoutCss, 'utf8');
      }
      if (!css) degrade.push('no-css-source');
    }
  }
  if (css === null || css === '') {
    if (!degrade.includes('no-css-source')) degrade.push('no-css-source');
    css = '';
  }

  // deliberate broken CSS signal for tests
  if (opts.cssOverride === '__BROKEN__') {
    degrade.push('css-unparseable');
    css = '';
  }

  // F14: component token JSON is the precise path; CSS is fallback only (F14-C4).
  const fromTokens = resolveComponentTokens(slug, tokens, discovery);
  /** @type {Array<{ variant: string, prop: string, hex: string, tokenPath: string }>} */
  let resolved = [...fromTokens.resolved];
  const sizes = fromTokens.sizes;

  let anatomy = { bem: '', classes: [] };
  let motion = [];
  let standaloneCss = '';
  if (css && !degrade.includes('css-unparseable')) {
    try {
      const bases = [...new Set([baseClass, slugToTokenPrefix(slug), ...guessBaseClasses(css)].filter(Boolean))];
      // prefer longer BEM roots (l-hero-centered before l)
      bases.sort((a, b) => b.length - a.length);
      anatomy = extractBemAnatomy(css, bases[0] || baseClass);
      motion = extractMotion(css);
      standaloneCss = buildStandaloneCss(css, tokens);
      // CSS fills colors only when the component-token map was empty
      if (resolved.length === 0) {
        /** @type {Map<string, { variant: string, prop: string, hex: string, tokenPath: string }>} */
        const merged = new Map();
        for (const b of bases) {
          for (const row of extractTokensFromCss(css, b, tokens)) {
            const k = `${row.variant}::${row.prop}`;
            if (!merged.has(k)) merged.set(k, row);
          }
        }
        // Attribute-driven CSS ([data-tooltip], etc.) has no BEM root
        if (merged.size === 0) {
          for (const row of extractTokensFromCss(css, '', tokens)) {
            const k = `${row.variant}::${row.prop}`;
            if (!merged.has(k)) merged.set(k, row);
          }
        }
        resolved = [...merged.values()];
      }
    } catch (e) {
      degrade.push(`css-parse-error:${e?.message || e}`);
    }
  }

  if (resolved.length === 0 && sizes.length === 0) {
    if (css && !degrade.includes('css-unparseable')) {
      degrade.push('no-color-declarations');
    } else if (!degrade.includes('no-css-source')) {
      degrade.push('no-css-source');
    }
  }
  // remove obsolete reason if we filled via CSS
  if (resolved.length > 0) {
    const i = degrade.indexOf('no-component-tokens');
    if (i >= 0) degrade.splice(i, 1);
  }

  const peerDeps = impl.peerDeps ?? [];
  const cssImports = impl.hasCss
    ? ['@atom-uikit/css/components.css', '@atom-uikit/tokens/tokens.css']
    : [];

  /** @type {Record<string, unknown>} */
  const derived = {
    generatedAt,
    sourceCommit,
    install: {
      peerDeps: [...peerDeps],
      cssImports,
    },
    anatomy,
    tokens: {
      resolved,
      sizes,
    },
    standaloneCss: standaloneCss || undefined,
    motion,
  };

  if (degrade.length) {
    derived.degraded = true;
    derived.degradeReasons = degrade;
  }

  // strip undefined
  if (derived.standaloneCss === undefined) delete derived.standaloneCss;

  return derived;
}

/**
 * Batch derive for all registry items (used by build:registry).
 * @param {Array<object>} items
 * @param {object} [opts]
 */
export function deriveAllDocs(items, opts = {}) {
  const tokens = opts.tokens ?? loadResolvedTokens();
  const sourceCommit = opts.sourceCommit ?? getSourceCommit();
  const now = opts.now ?? new Date().toISOString();
  /** @type {Map<string, object>} */
  const map = new Map();
  for (const item of items) {
    map.set(item.name, deriveItemDoc(item, { tokens, sourceCommit, now }));
  }
  return map;
}

// CLI smoke: node scripts/derive-doc.mjs button
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('derive-doc.mjs')) {
  const slug = process.argv[2] || 'button';
  const itemPath = path.join(ROOT, 'public/r', `${slug.replace(/\//g, '--')}.json`);
  const item = fs.existsSync(itemPath)
    ? JSON.parse(fs.readFileSync(itemPath, 'utf8'))
    : { name: slug };
  const d = deriveItemDoc(item);
  console.log(JSON.stringify(d, null, 2));
}
