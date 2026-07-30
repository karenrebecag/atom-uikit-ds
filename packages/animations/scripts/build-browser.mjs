#!/usr/bin/env node
/**
 * Compila los módulos de dist/ en un único IIFE para navegador (global AtomMotion).
 *
 * Sin bundler externo a propósito: los módulos son auto-contenidos (cero imports
 * entre ellos), así que basta con aislarlos y recolectar sus exports.
 *
 * Cada módulo va en SU PROPIO scope: hay helpers homónimos con firmas distintas
 * entre módulos (readMotionTokens en menu-button vs nav-autohide) que se pisarían
 * en un scope compartido.
 *
 * GSAP NO se incluye: es peer dependency y los módulos lo leen de globalThis.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const PKG = resolve(import.meta.dirname, '..');
const DIST = join(PKG, 'dist');
const OUT = join(DIST, 'atom-animations.js');

const EXPORT_FN = /^export function (\w+)/gm;

export function buildBrowserBundle(outFile = OUT) {
  if (!existsSync(DIST)) {
    throw new Error(`Missing ${DIST} — run: pnpm --filter @atom-uikit/animations build`);
  }

  // Excluir el propio output: en rebuilds ya vive en dist/ y se auto-incluiría.
  const self = OUT.split('/').pop();
  const modules = readdirSync(DIST)
    .filter((f) => f.endsWith('.js') && f !== 'index.js' && f !== self)
    .sort();

  if (modules.length === 0) {
    throw new Error(`No compiled modules in ${DIST} — run the tsc build first`);
  }

  const chunks = [];
  const exported = [];

  for (const file of modules) {
    const src = readFileSync(join(DIST, file), 'utf8');
    const names = [...src.matchAll(EXPORT_FN)].map((m) => m[1]);
    if (names.length === 0) continue;

    const body = src
      .replace(/^export /gm, '')
      .replace(/^\/\/# sourceMappingURL=.*$/gm, '')
      .trim();

    const assigns = names.map((n) => `    api.${n} = ${n};`).join('\n');
    chunks.push(`  // ── ${file} ──\n  (function () {\n${body}\n\n${assigns}\n  })();`);
    exported.push(...names);
  }

  exported.sort();

  const bundle = `/*! Atom UIKit — animations (browser bundle)
 * Global: AtomMotion · ${exported.length} módulos
 * GSAP es peer dependency: cárgalo ANTES que este archivo.
 * Valores de motion salen de los tokens en runtime (--easing-osmo, --duration-*),
 * así que este archivo no cambia cuando cambia un token: carga tokens.css.
 */
(function (root) {
  'use strict';
  var api = {};

${chunks.join('\n\n')}

  /**
   * Inicializa todo lo presente en el DOM. Cada init hace no-op si no encuentra
   * sus data-attributes, así que es seguro llamarlo en cualquier página.
   * Devuelve un cleanup que revierte todos los que se hayan inicializado.
   */
  api.initAll = function (config) {
    var cleanups = [];
    ${JSON.stringify(exported)}.forEach(function (name) {
      try {
        var fn = api[name];
        if (typeof fn === 'function') cleanups.push(fn(config));
      } catch (err) {
        if (root.console) root.console.warn('[atom-uikit] ' + name + ' falló:', err);
      }
    });
    return function () {
      cleanups.forEach(function (c) {
        if (typeof c === 'function') c();
      });
    };
  };

  root.AtomMotion = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
`;

  writeFileSync(outFile, bundle);
  return { outFile, modules: modules.length, exported };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = buildBrowserBundle();
  console.log(`atom-animations.js — ${r.exported.length} inits desde ${r.modules} módulos`);
  console.log(`  ${r.exported.join(', ')}`);
}
