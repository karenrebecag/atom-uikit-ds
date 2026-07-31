/**
 * F7 — DOM contracts for Webflow motion pilots.
 * Hooks/anatomy must match the real behavior + component source (never invented).
 * Source of truth for marquee: packages/animations/src/marquee-draggable.ts +
 * packages/components-react/src/molecules/Marquee.tsx (draggable mode).
 */

/**
 * @typedef {{
 *   hooks: string[],
 *   anatomy: string[],
 *   statesWrittenAsClasses: boolean,
 *   gsapPlugins?: string[],
 * }} DomContract
 */

/** @type {Record<string, DomContract>} */
export const DOM_CONTRACTS = {
  marquee: {
    // Exact attributes the behavior queries (marquee-draggable.ts)
    hooks: [
      'data-draggable-marquee',
      'data-draggable-marquee-collection',
      'data-draggable-marquee-list',
    ],
    // Internal structure the behavior + paint CSS expect
    anatomy: [
      '[data-draggable-marquee-collection]',
      '[data-draggable-marquee-list]',
      '.marquee__item',
    ],
    // Behavior clones nodes and sets gsap x / data-direction — no classList on BEM
    statesWrittenAsClasses: false,
    // Required as globals before animations.js (see marquee-draggable.ts)
    gsapPlugins: ['Observer', 'ScrollTrigger'],
  },
};

/**
 * @param {string} slug
 * @returns {DomContract | null}
 */
export function getDomContract(slug) {
  return DOM_CONTRACTS[slug] ?? null;
}

/**
 * Build motion js/init from registry flags + optional domContract plugins.
 * Never hardcodes a slug's CDN list beyond peerDeps/hasAnimation + contract plugins.
 *
 * @param {{ atom?: { discovery?: { hasAnimation?: boolean }, implementation?: { peerDeps?: string[] } } }} item
 * @param {string} slug
 * @returns {{ js: string[], init: string }}
 */
export function buildMotionScripts(item, slug) {
  const hasAnim = !!item?.atom?.discovery?.hasAnimation;
  const peers = item?.atom?.implementation?.peerDeps ?? [];
  const needsGsap = hasAnim || peers.includes('gsap');
  if (!needsGsap) {
    return { js: [], init: '' };
  }

  const contract = getDomContract(slug);
  const js = ['https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js'];
  for (const plugin of contract?.gsapPlugins ?? []) {
    // Free GSAP plugins on jsDelivr; Club plugins (SplitText) stay site-setup only.
    js.push(`https://cdn.jsdelivr.net/npm/gsap@3/dist/${plugin}.min.js`);
  }
  js.push('https://atom-web-ds.vercel.app/v1/animations.js');

  return {
    js,
    init: 'window.__atomMotionCleanup = AtomMotion.initAll();',
  };
}

/**
 * Consume CSS chain for connected mode.
 * @param {{ atom?: { discovery?: { hasAnimation?: boolean } } }} item
 * @returns {string[]}
 */
export function buildConsumeCss(item) {
  const consume = [
    'https://atom-web-ds.vercel.app/v1/tokens.css',
    'https://atom-web-ds.vercel.app/v1/components.css',
  ];
  if (item?.atom?.discovery?.hasAnimation) {
    consume.push('https://atom-web-ds.vercel.app/v1/webflow.css');
  }
  return consume;
}

/**
 * Validate pilot HTML contains required data-* hooks and anatomy selectors (as substrings).
 * @param {string} html
 * @param {DomContract} contract
 * @returns {{ ok: true } | { ok: false, missing: string[] }}
 */
export function validateHtmlAgainstContract(html, contract) {
  const missing = [];
  const src = String(html ?? '');

  for (const hook of contract.hooks) {
    // attribute present as data-foo or data-foo="..."
    const re = new RegExp(`\\b${escapeRegExp(hook)}(?=[\\s=/>])`);
    if (!re.test(src)) missing.push(`hook:${hook}`);
  }

  for (const sel of contract.anatomy) {
    if (sel.startsWith('.')) {
      const cls = sel.slice(1);
      if (!src.includes(`class=`) || !new RegExp(`class="[^"]*\\b${escapeRegExp(cls)}\\b`).test(src)) {
        // also allow class='...'
        if (!new RegExp(`class='[^']*\\b${escapeRegExp(cls)}\\b`).test(src) && !src.includes(cls)) {
          missing.push(`anatomy:${sel}`);
        }
      }
    } else if (sel.startsWith('[')) {
      const attr = sel.replace(/^\[|\]$/g, '').split('=')[0];
      if (!src.includes(attr)) missing.push(`anatomy:${sel}`);
    } else if (!src.includes(sel)) {
      missing.push(`anatomy:${sel}`);
    }
  }

  if (contract.statesWrittenAsClasses) {
    missing.push('statesWrittenAsClasses:true-excluded-wave1');
  }

  return missing.length ? { ok: false, missing } : { ok: true };
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
