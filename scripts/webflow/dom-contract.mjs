/**
 * F7/F8b/F10b — DOM contracts for Webflow motion.
 * Loaded from behavior module exports (REQUIRED_HOOKS, …).
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ANIM_DIST = path.join(ROOT, 'packages/animations/dist');

/**
 * Component slug → animations dist module.
 * Multiple components can share one behavior (button family → button-hover).
 */
const SLUG_TO_MODULE = {
  marquee: 'marquee-draggable.js',
  button: 'button-hover.js',
  'icon-button': 'button-hover.js',
  'link-button': 'button-hover.js',
  'toggle-group': 'button-hover.js',
  'menu-button': 'menu-button.js',
  'burger-icon': 'menu-button.js',
  // layout-ish hooks (no single registry component, but modules exist)
  sidebar: 'sidebar.js',
  'progress-nav': 'progress-nav.js',
  toc: 'table-of-contents.js',
  'video-player': 'video-player.js',
  // text-reveal is attribute-driven on headings, not a component slug
  // nav-autohide similarly layout-level
};

/** Modules that must export contracts (F10-C5) — all behavior files */
export const ALL_BEHAVIOR_MODULES = [
  'button-hover.js',
  'marquee-draggable.js',
  'menu-button.js',
  'nav-autohide.js',
  'progress-nav.js',
  'scroll-reveal.js',
  'sidebar.js',
  'table-of-contents.js',
  'text-reveal.js',
  'video-player.js',
];

/** @type {Record<string, DomContract> | null} */
let _cache = null;
/** @type {Record<string, DomContract> | null} */
let _byModule = null;

/**
 * @typedef {{
 *   hooks: string[],
 *   anatomy: string[],
 *   statesWrittenAsClasses: boolean,
 *   gsapPlugins?: string[],
 *   moduleFile?: string,
 * }} DomContract
 */

export async function loadDomContracts() {
  /** @type {Record<string, DomContract>} */
  const byModule = {};
  for (const file of ALL_BEHAVIOR_MODULES) {
    const abs = path.join(ANIM_DIST, file);
    if (!fs.existsSync(abs)) {
      throw new Error(`dom-contract: missing ${abs} — build @atom-uikit/animations first`);
    }
    const mod = await import(pathToFileURL(abs).href + `?t=${Date.now()}`);
    if (!mod.REQUIRED_HOOKS || !Array.isArray(mod.REQUIRED_HOOKS)) {
      throw new Error(`dom-contract: ${file} must export REQUIRED_HOOKS[]`);
    }
    byModule[file] = {
      hooks: [...mod.REQUIRED_HOOKS],
      triggers: [...(mod.TRIGGER_HOOKS ?? [])],
      anatomy: [...(mod.REQUIRED_ANATOMY ?? [])],
      statesWrittenAsClasses: !!mod.STATES_WRITTEN_AS_CLASSES,
      gsapPlugins: [...(mod.GSAP_PLUGINS ?? [])],
      moduleFile: file,
    };
  }
  _byModule = byModule;

  /** @type {Record<string, DomContract>} */
  const contracts = {};
  for (const [slug, file] of Object.entries(SLUG_TO_MODULE)) {
    if (byModule[file]) contracts[slug] = { ...byModule[file] };
  }
  _cache = contracts;
  return contracts;
}

export function getDomContract(slug) {
  if (!_cache) return getDomContractSync(slug);
  return _cache[slug] ?? null;
}

export function getDomContractSync(slug) {
  if (_cache?.[slug]) return _cache[slug];
  const file = SLUG_TO_MODULE[slug];
  if (!file) return null;
  return loadContractFromFile(file);
}

function loadContractFromFile(file) {
  const abs = path.join(ANIM_DIST, file);
  if (!fs.existsSync(abs)) return null;
  const src = fs.readFileSync(abs, 'utf8');
  const hooks = extractStringArray(src, 'REQUIRED_HOOKS');
  if (!hooks?.length) return null;
  return {
    hooks,
    triggers: extractStringArray(src, 'TRIGGER_HOOKS') ?? [],
    anatomy: extractStringArray(src, 'REQUIRED_ANATOMY') ?? [],
    statesWrittenAsClasses: /STATES_WRITTEN_AS_CLASSES\s*=\s*!?0\s*,?\s*true|STATES_WRITTEN_AS_CLASSES\s*=\s*true/.test(
      src,
    ),
    gsapPlugins: extractStringArray(src, 'GSAP_PLUGINS') ?? [],
    moduleFile: file,
  };
}

function extractStringArray(src, name) {
  const re = new RegExp(`(?:exports\\.)?${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`);
  const m = src.match(re);
  if (!m) return null;
  const items = [...m[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
  return items.length ? items : null;
}

export function buildMotionScripts(item, slug) {
  const hasAnim = !!item?.atom?.discovery?.hasAnimation;
  const peers = item?.atom?.implementation?.peerDeps ?? [];
  const needsGsap = hasAnim || peers.includes('gsap');
  if (!needsGsap) {
    return { js: [], init: '' };
  }

  const contract = getDomContract(slug) ?? getDomContractSync(slug);

  // Motion SOLO con contrato verificable (F7/F8/F10): animado sin REQUIRED_HOOKS
  // → estático. motionOmitted permite al emitter loguearlo ruidoso.
  if (!contract) {
    return { js: [], init: '', motionOmitted: true };
  }
  // Policy F7/F10: behavior writes BEM/state classes → stay static on paste channel
  if (contract.statesWrittenAsClasses) {
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

/**
 * ¿Cuántos hooks del contrato están presentes en el HTML?
 * Semántica de opt-in (auditoría F10): 0 presentes = el componente NO activa el
 * behavior (emitir ESTÁTICO, no excluir — la exclusión de button/icon-button/
 * link-button/toggle-group por hooks opt-in ausentes fue una regresión);
 * algunos presentes pero no todos = anatomía rota de verdad (excluir).
 */
export function countContractHooks(html, contract) {
  const src = String(html ?? '');
  const pool = contract.triggers?.length ? contract.triggers : contract.hooks;
  return pool.filter((h) =>
    new RegExp(`\\b${escapeRegExp(h)}(?=[\\s=/>])`).test(src),
  ).length;
}

export function validateHtmlAgainstContract(html, contract) {
  const missing = [];
  const src = String(html ?? '');

  const triggers = contract.triggers ?? [];
  if (triggers.length) {
    // Triggers alternativos: basta UNO presente (familias que comparten módulo)
    const anyTrigger = triggers.some((h) =>
      new RegExp(`\\b${escapeRegExp(h)}(?=[\\s=/>])`).test(src),
    );
    if (!anyTrigger) missing.push(`trigger:any-of(${triggers.join('|')})`);
  }
  for (const hook of contract.hooks) {
    if (triggers.includes(hook)) continue; // any-of ya evaluado
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
      const attr = sel.replace(/^\[|\]$/g, '').split('=')[0].replace(/"/g, '');
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

export function validateHooksCoverSelectors(moduleSource, hooks) {
  const found = new Set();
  // querySelector(All)?('…') — con o sin genérico TS; captura TODOS los data-*
  // del literal (incl. listas: '[data-a], [data-b]').
  for (const m of moduleSource.matchAll(
    /querySelector(?:All)?\s*(?:<[^>]*>)?\s*\(\s*['"`]([^'"`]+)['"`]/gi,
  )) {
    for (const attr of m[1].matchAll(/\[(data-[a-z0-9-]+)/gi)) {
      found.add(attr[1]);
    }
  }
  const missing = [...found].filter((h) => !hooks.includes(h));
  return missing.length ? { ok: false, missing, found: [...found] } : { ok: true, found: [...found] };
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
