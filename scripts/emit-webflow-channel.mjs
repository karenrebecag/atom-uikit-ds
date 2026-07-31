/**
 * F6 — Derive public/r/webflow/{slug}.json from canónico public/r items.
 * Pure build-time artifact; the MCP serves it, never re-generates it
 * (fix hallazgo 1: el generador vive SOLO aquí, cero gemelos en el MCP).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateXscp, resolveTokensCss } from './webflow/generate-xscp.mjs';
import {
  getDomContract,
  buildMotionScripts,
  buildConsumeCss,
  validateHtmlAgainstContract,
} from './webflow/dom-contract.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const PILOTS_DIR = path.join(here, 'webflow', 'pilots');

/**
 * @param {string} outDir - public/r
 * @param {{ log?: (msg: string) => void }} [opts]
 */
export async function emitWebflowChannel(outDir, opts = {}) {
  const log = opts.log ?? (() => {});
  const pilotFiles = (await fs.readdir(PILOTS_DIR)).filter((f) => f.endsWith('.html'));
  const webflowDir = path.join(outDir, 'webflow');
  await fs.mkdir(webflowDir, { recursive: true });

  // Tokens resueltos por artefacto (autocontenido): sin foundation cargado en el
  // sitio, toda declaración var() es inválida — verificado en paste real.
  const nestedTokens = JSON.parse(
    await fs.readFile(path.join(outDir, 'tokens-nested.json'), 'utf8'),
  );

  const slugs = [];
  for (const file of pilotFiles) {
    const slug = file.replace(/\.html$/, '');
    const html = await fs.readFile(path.join(PILOTS_DIR, file), 'utf8');

    const itemPath = path.join(outDir, `${slug}.json`);
    const item = JSON.parse(await fs.readFile(itemPath, 'utf8'));
    const css = (item.files ?? [])
      .filter((f) => f.path.endsWith('.css'))
      .map((f) => f.content ?? '')
      .join('\n\n');

    const pkg = generateXscp(html, css, { slug });

    // var() usados en styleLess Y en los chunks del head → :root autocontenido
    const styleLessCss = pkg.clipboard.payload.styles
      .map((s) => [s.styleLess, ...Object.values(s.variants).map((v) => v.styleLess)].join(' '))
      .join(' ');
    const tokens = resolveTokensCss(`${styleLessCss}\n${pkg.headCss}`, nestedTokens);
    for (const name of tokens.unresolved) {
      pkg.unsupported.push({
        prop: `--${name}`,
        selector: ':root',
        reason: 'token not found in tokens-nested.json — resolve upstream or the declaration stays invalid on paste',
      });
    }
    // tokensCss viaja SEPARADO del headCss para soportar los dos modos de
    // distribución (decisión Karen 2026-07-31):
    //  - "connected" (default, no-code): el sitio carga /v1/tokens.css y el
    //    paste consume tokens VIVOS — un cambio de token re-afina lo pegado.
    //    El head se pega SIN tokensCss (pegarlo pisaría la escala fluida --u).
    //  - "standalone" (técnico, estilo shadcn): head = tokensCss + headCss,
    //    autocontenido para sitios ajenos sin el canal /v1.
    //
    // F7: motion scripts + DOM contract derived from registry (peerDeps/hasAnimation)
    // and scripts/webflow/dom-contract.mjs — never hard-coded per slug beyond that map.
    const motion = buildMotionScripts(item, slug);
    const domContract = getDomContract(slug);
    if (domContract) {
      const check = validateHtmlAgainstContract(html, domContract);
      if (!check.ok) {
        throw new Error(
          `webflow pilot "${slug}" fails domContract: missing ${check.missing.join(', ')}`,
        );
      }
    }

    // Manifest de la cadena de dependencias (idea Karen 2026-07-31): la
    // instancia pegada es pura referencia; esto declara EXPLÍCITO qué
    // endpoints la pintan, para que cualquier consumidor (MCP, botón de la
    // docu, compiladores futuros) resuelva la cadena mecánicamente.
    const manifest = {
      channelVersion: 'v1',
      consume: buildConsumeCss(item),
      js: motion.js,
      ...(motion.init ? { init: motion.init } : {}),
      tokens: tokens.resolved,
      ...(domContract
        ? {
            domContract: {
              hooks: domContract.hooks,
              anatomy: domContract.anatomy,
              statesWrittenAsClasses: domContract.statesWrittenAsClasses,
            },
          }
        : {}),
    };

    const artifact = {
      slug,
      format: 'webflow-xscp',
      clipboard: pkg.clipboard,
      headCss: pkg.headCss,
      tokensCss: tokens.tokensCss,
      tokensResolved: tokens.resolved,
      manifest,
      footerNote: pkg.footerNote,
      unsupported: pkg.unsupported,
    };
    await fs.writeFile(
      path.join(webflowDir, `${slug}.json`),
      JSON.stringify(artifact, null, 2),
      'utf8',
    );
    slugs.push(slug);
  }

  await fs.writeFile(
    path.join(webflowDir, 'index.json'),
    JSON.stringify({ format: 'webflow-xscp', pilots: slugs.sort() }, null, 2),
    'utf8',
  );
  log(`  [webflow] emitted ${slugs.length} pilot artifacts + index`);
}
