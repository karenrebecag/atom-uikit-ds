/**
 * Scopes the embed artifact under a single class, via LightningCSS's selector
 * visitor (real AST — never string/regex rewriting of built CSS).
 *
 * Rules, in order:
 *   already scoped      → untouched (idempotent; the reset is authored scoped)
 *   :root | html | body → REPLACED by .atom-embed   (they mean "the root", and
 *                         inside an embed the root is the mount element)
 *   [attr] first        → COMPOUNDED: .atom-embed[data-theme=dark]
 *   anything else       → DESCENDANT: .atom-embed .h1
 *
 * At-rules without selectors (@font-face, @keyframes) pass through untouched,
 * which is what we want: @font-face registers families without applying them,
 * so it is safe — and necessary — for it to stay global.
 */
import { transform } from 'lightningcss';

export const SCOPE_CLASS = 'atom-embed';

const SCOPE = { type: 'class', name: SCOPE_CLASS };
const DESCENDANT = { type: 'combinator', value: 'descendant' };

/** Selectors that mean "document root" and must BECOME the scope, not sit under it. */
const ROOT_ELEMENTS = new Set(['html', 'body']);

function isAlreadyScoped(first) {
  return first?.type === 'class' && first.name === SCOPE_CLASS;
}

function isRootSelector(first) {
  if (first?.type === 'pseudo-class' && first.kind === 'root') return true;
  return first?.type === 'type' && ROOT_ELEMENTS.has(first.name);
}

/** @param {unknown[]} selector A LightningCSS selector component list. */
export function scopeSelector(selector) {
  const first = selector[0];
  if (!first || isAlreadyScoped(first)) return selector;
  if (isRootSelector(first)) return [SCOPE, ...selector.slice(1)];
  // An attribute in first position qualifies the root itself (e.g. dark mode),
  // so it must compound — a descendant combinator here would never match.
  if (first.type === 'attribute') return [SCOPE, ...selector];
  return [SCOPE, DESCENDANT, ...selector];
}

/**
 * @param {string} css Bundled, already-minified CSS.
 * @returns {string} The same CSS with every selector scoped.
 */
export function scopeEmbedCss(css) {
  const { code } = transform({
    filename: 'embed.css',
    code: Buffer.from(css),
    minify: true,
    visitor: { Selector: scopeSelector },
  });
  return code.toString();
}

/**
 * Collects selectors that are NOT scoped. Used by the CI gate — a silent
 * scoping regression would ship a stylesheet that restyles the host page,
 * and the visual-regression baselines only cover the light-DOM artifacts.
 *
 * @param {string} css
 * @returns {string[]} Human-readable offenders (empty when the file is sound).
 */
export function findUnscopedSelectors(css) {
  const offenders = [];
  transform({
    filename: 'embed.css',
    code: Buffer.from(css),
    minify: true,
    visitor: {
      Selector(selector) {
        if (!isAlreadyScoped(selector[0])) {
          offenders.push(describeSelector(selector));
        }
        return selector;
      },
    },
  });
  return offenders;
}

function describeSelector(selector) {
  return selector
    .map((c) => {
      if (c.type === 'class') return `.${c.name}`;
      if (c.type === 'type') return c.name;
      if (c.type === 'attribute') return `[${c.name ?? 'attr'}]`;
      if (c.type === 'pseudo-class') return `:${c.kind ?? 'pseudo'}`;
      if (c.type === 'pseudo-element') return `::${c.kind ?? 'pseudo'}`;
      if (c.type === 'combinator') return ` ${c.value === 'descendant' ? '' : c.value} `;
      if (c.type === 'universal') return '*';
      return c.type;
    })
    .join('')
    .trim();
}
