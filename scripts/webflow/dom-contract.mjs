/**
 * F7/F8b — DOM contracts for Webflow motion.
 * F8b: contracts are loaded from behavior module exports (REQUIRED_HOOKS, …),
 * not hand-written duplicates. Map slug → animations dist module.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ANIM_DIST = path.join(ROOT, 'packages/animations/dist');

/**
 * Registry slug → animations dist module (only components with motion contracts).
 * hasAnimation alone is not enough — only modules that export REQUIRED_HOOKS.
 */
const SLUG_TO_MODULE = {
  marquee: 'marquee-draggable.js',
};

/** @type {Record<string, import('./dom-contract-types').DomContract> | null} */
let _cache = null;

/**
 * @typedef {{
 *   hooks: string[],
 *   anatomy: string[],
 *   statesWrittenAsClasses: boolean,
 *   gsapPlugins?: string[],
 *   moduleFile?: string,
 * }} DomContract
 */

/**
 * Load contracts from behavior dist exports. Call once before emit/conformance.
 */
export async function loadDomContracts() {
  /** @type {Record<string, DomContract>} */
  const contracts = {};
  for (const [slug, file] of Object.entries(SLUG_TO_MODULE)) {
    const abs = path.join(ANIM_DIST, file);
    if (!fs.existsSync(abs)) {
      throw new Error(`dom-contract: missing ${abs} — build @atom-uikit/animations first`);
    }
    const mod = await import(pathToFileURL(abs).href + `?t=${Date.now()}`);
    if (!mod.REQUIRED_HOOKS || !Array.isArray(mod.REQUIRED_HOOKS)) {
      throw new Error(`dom-contract: ${file} must export REQUIRED_HOOKS[]`);
    }
    contracts[slug] = {
      hooks: [...mod.REQUIRED_HOOKS],
      anatomy: [...(mod.REQUIRED_ANATOMY ?? [])],
      statesWrittenAsClasses: !!mod.STATES_WRITTEN_AS_CLASSES,
      gsapPlugins: [...(mod.GSAP_PLUGINS ?? [])],
      moduleFile: file,
    };
  }
  _cache = contracts;
  return contracts;
}

/**
 * @param {string} slug
 * @returns {DomContract | null}
 */
export function getDomContract(slug) {
  if (!_cache) {
    // Sync fallback for tests that only read marquee from source constants file
    // Prefer loadDomContracts() in emit path.
    return null;
  }
  return _cache[slug] ?? null;
}

/**
 * Sync load from dist via createRequire-like: read and regex REQUIRED_HOOKS if cache empty.
 * Used by tests before async load.
 */
export function getDomContractSync(slug) {
  if (_cache?.[slug]) return _cache[slug];
  const file = SLUG_TO_MODULE[slug];
  if (!file) return null;
  const abs = path.join(ANIM_DIST, file);
  if (!fs.existsSync(abs)) return null;
  const src = fs.readFileSync(abs, 'utf8');
  const hooks = extractStringArray(src, 'REQUIRED_HOOKS');
  if (!hooks?.length) return null;
  return {
    hooks,
    anatomy: extractStringArray(src, 'REQUIRED_ANATOMY') ?? [],
    statesWrittenAsClasses: /STATES_WRITTEN_AS_CLASSES\s*=\s*true/.test(src),
    gsapPlugins: extractStringArray(src, 'GSAP_PLUGINS') ?? [],
    moduleFile: file,
  };
}

function extractStringArray(src, name) {
  const re = new RegExp(
    `(?:exports\\.)?${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`,
  );
  const m = src.match(re);
  if (!m) return null;
  const items = [...m[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
  return items.length ? items : null;
}

/**
 * Build motion js/init from registry flags + optional domContract plugins.
 */
export function buildMotionScripts(item, slug) {
  const hasAnim = !!item?.atom?.discovery?.hasAnimation;
  const peers = item?.atom?.implementation?.peerDeps ?? [];
  const needsGsap = hasAnim || peers.includes('gsap');
  if (!needsGsap) {
    return { js: [], init: '' };
  }

  const contract = getDomContract(slug) ?? getDomContractSync(slug);

  // Motion SOLO con contrato verificable (auditoría F8): un animado sin
  // REQUIRED_HOOKS en su módulo se emite ESTÁTICO — pintura útil, cero JS
  // no-verificado. motionOmitted permite al emitter loguearlo ruidoso.
  if (!contract) {
    return { js: [], init: '', motionOmitted: true };
  }

  const js = ['https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js'];
  for (const plugin of contract.gsapPlugins ?? []) {
    js.push(`https://cdn.jsdelivr.net/npm/gsap@3/dist/${plugin}.min.js`);
  }
  js.push('https://atom-web-ds.vercel.app/v1/animations.js');

  return {
    js,
    init: 'window.__atomMotionCleanup = AtomMotion.initAll();',
  };
}

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

export function validateHtmlAgainstContract(html, contract) {
  const missing = [];
  const src = String(html ?? '');

  for (const hook of contract.hooks) {
    const re = new RegExp(`\\b${escapeRegExp(hook)}(?=[\\s=/>])`);
    if (!re.test(src)) missing.push(`hook:${hook}`);
  }

  for (const sel of contract.anatomy) {
    if (sel.startsWith('.')) {
      const cls = sel.slice(1);
      if (
        !new RegExp(`class="[^"]*\\b${escapeRegExp(cls)}\\b`).test(src) &&
        !new RegExp(`class='[^']*\\b${escapeRegExp(cls)}\\b`).test(src) &&
        !src.includes(cls)
      ) {
        missing.push(`anatomy:${sel}`);
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

/**
 * F8-C4 invariant: every data-* selector in module source appears in REQUIRED_HOOKS.
 * @param {string} moduleSource
 * @param {string[]} hooks
 */
export function validateHooksCoverSelectors(moduleSource, hooks) {
  const found = new Set();
  // querySelectorAll('[data-foo]') — con o sin genérico TS (<HTMLElement>) y
  // cualquier comilla. Sin el genérico opcional, la invariante era VACUA
  // (0 selectores extraídos → validaba contra nada; detectado en auditoría F8).
  for (const m of moduleSource.matchAll(
    /querySelector(?:All)?\s*(?:<[^>]*>)?\s*\(\s*['"`]\[(data-[a-z0-9-]+)/gi,
  )) {
    found.add(m[1]);
  }
  // also getAttribute('data-...') is config not structure — skip
  const missing = [...found].filter((h) => !hooks.includes(h));
  return missing.length ? { ok: false, missing } : { ok: true, found: [...found] };
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** @deprecated use loadDomContracts — kept for tests expecting DOM_CONTRACTS */
export const DOM_CONTRACTS = new Proxy(
  {},
  {
    get(_, slug) {
      if (typeof slug !== 'string') return undefined;
      return getDomContract(slug) ?? getDomContractSync(slug);
    },
    ownKeys() {
      return Object.keys(SLUG_TO_MODULE);
    },
    getOwnPropertyDescriptor(_, prop) {
      if (SLUG_TO_MODULE[prop]) {
        return { enumerable: true, configurable: true, value: getDomContractSync(prop) };
      }
      return undefined;
    },
  },
);
