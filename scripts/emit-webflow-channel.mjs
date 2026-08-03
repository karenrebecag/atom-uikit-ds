/**
 * F6/F7/F8 — Derive public/r/webflow/{slug}.json from canónico registry items.
 * F8a: HTML from renderToStaticMarkup(React dist); pilots/*.html = regression fixtures only.
 * Generator lives ONLY here; MCP serves artifacts, never regenerates them.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { generateXscp, resolveTokensCss, structuralEqual } from './webflow/generate-xscp.mjs';
import {
  getDomContract,
  getDomContractSync,
  loadDomContracts,
  buildMotionScripts,
  buildConsumeCss,
  validateHtmlAgainstContract,
  countContractHooks,
} from './webflow/dom-contract.mjs';
import { renderAnatomy } from './webflow/render-anatomy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.join(here, 'webflow', 'fixtures', 'pilots');
const LEGACY_PILOTS_DIR = path.join(here, 'webflow', 'pilots');

/**
 * @param {string} outDir - public/r
 * @param {{ log?: (msg: string) => void }} [opts]
 */
export async function emitWebflowChannel(outDir, opts = {}) {
  const log = opts.log ?? (() => {});
  const webflowDir = path.join(outDir, 'webflow');
  await fs.mkdir(webflowDir, { recursive: true });

  // F8b: contracts from behavior exports
  try {
    await loadDomContracts();
  } catch (e) {
    log(`  [webflow] dom-contract load warning: ${e.message} (using sync fallback)`);
  }

  const nestedTokens = JSON.parse(
    await fs.readFile(path.join(outDir, 'tokens-nested.json'), 'utf8'),
  );
  const index = JSON.parse(await fs.readFile(path.join(outDir, 'index.json'), 'utf8'));
  const components = index.filter((i) => i.kind === 'component');

  const emitted = [];
  const excluded = [];

  for (const entry of components) {
    const slug = entry.name;
    const safe = slug.replace(/\//g, '--');
    const itemPath = path.join(outDir, `${safe}.json`);
    if (!existsSync(itemPath)) {
      excluded.push({ name: slug, reason: 'missing published registry item' });
      continue;
    }
    const item = JSON.parse(await fs.readFile(itemPath, 'utf8'));

    // Exclusión declarada en la fuente: decisión, no error de pipeline.
    const declaredExclude = item.meta?.webflow?.exclude;
    if (typeof declaredExclude === 'string' && declaredExclude.length) {
      excluded.push({ name: slug, reason: `declared: ${declaredExclude}` });
      continue;
    }

    // Layouts are kind:layout — not in this loop. Components only.
    const rendered = await renderAnatomy(item);
    if ('reason' in rendered && !('html' in rendered)) {
      excluded.push({ name: slug, reason: rendered.reason });
      continue;
    }

    let html = rendered.html;

    // F8a: regression fixtures (ex-pilots) must structuralEqual the render path
    const fixturePath = fixturePathFor(slug);
    if (fixturePath) {
      const fixtureHtml = readFileSync(fixturePath, 'utf8');
      const css = cssFromItem(item);
      const fromRender = generateXscp(html, css, { slug });
      const fromFixture = generateXscp(fixtureHtml, css, { slug });
      if (!structuralEqual(fromRender.clipboard, fromFixture.clipboard)) {
        // Prefer fixture HTML only if render is missing required motion hooks
        const contract = getDomContract(slug);
        if (contract) {
          const renderOk = validateHtmlAgainstContract(html, contract);
          const fixtureOk = validateHtmlAgainstContract(fixtureHtml, contract);
          if (!renderOk.ok && fixtureOk.ok) {
            // previewProps not set yet — use fixture but warn
            log(
              `  [webflow] ${slug}: render missing domContract hooks — using fixture until meta.webflow.previewProps is set (${renderOk.missing?.join(', ')})`,
            );
            html = fixtureHtml;
          } else if (renderOk.ok && !fixtureOk.ok) {
            log(`  [webflow] ${slug}: fixture stale vs render; keeping render (truth)`);
          } else if (!renderOk.ok && !fixtureOk.ok) {
            excluded.push({
              name: slug,
              reason: `domContract fail on render and fixture: ${renderOk.missing?.join(', ')}`,
            });
            continue;
          } else {
            // both ok but structural differ — fail build (anti-drift)
            throw new Error(
              `webflow fixture regression ${slug}: render XscpData diverges from fixtures/pilots/${slug}.html — update fixture or previewProps`,
            );
          }
        } else {
          // static: class structure must match — soft: prefer render as truth, log
          log(
            `  [webflow] ${slug}: fixture structural mismatch — keeping render as truth (update fixture)`,
          );
        }
      }
    }

    const css = cssFromItem(item);
    if (!css.trim()) {
      excluded.push({ name: slug, reason: 'no CSS in registry item' });
      continue;
    }

    const result = await buildArtifact({ slug, html, css, item, nestedTokens });
    if (!result.ok) {
      excluded.push({ name: slug, reason: result.reason });
      continue;
    }
    if (result.artifact.unsupported?.some((u) => u.prop === 'motion')) {
      const why = result.artifact.unsupported.find((u) => u.prop === 'motion')?.reason ?? '';
      log(`  [webflow] ${slug}: motion OMITTED — ${why}`);
    }

    await fs.writeFile(
      path.join(webflowDir, `${safe}.json`),
      JSON.stringify(result.artifact, null, 2),
      'utf8',
    );
    emitted.push(slug);
  }

  const layouts = index.filter((i) => i.kind === 'layout');
  log(`  [webflow] layouts skipped this wave: ${layouts.length} (F8d later)`);

  // Remove orphan webflow json not in emitted
  const expected = new Set([...emitted.map((s) => `${s.replace(/\//g, '--')}.json`), 'index.json']);
  for (const file of await fs.readdir(webflowDir)) {
    if (file.endsWith('.json') && !expected.has(file)) {
      await fs.rm(path.join(webflowDir, file));
      log(`  [webflow] removed orphan ${file}`);
    }
  }

  await fs.writeFile(
    path.join(webflowDir, 'index.json'),
    JSON.stringify(
      {
        format: 'webflow-xscp',
        pilots: emitted.sort(),
        emitted: emitted.sort(),
        excluded: excluded.map((e) => ({ name: e.name, reason: e.reason })),
      },
      null,
      2,
    ),
    'utf8',
  );

  const eligible = components.length;
  log(`  [webflow] elegibles=${eligible} emitidos=${emitted.length} excluidos=${excluded.length}`);
  for (const e of excluded) {
    log(`  [webflow] excluded ${e.name}: ${e.reason}`);
  }

  if (eligible !== emitted.length + excluded.length) {
    throw new Error(
      `webflow emit accounting error: ${eligible} !== ${emitted.length}+${excluded.length}`,
    );
  }

  return { emitted, excluded };
}

function fixturePathFor(slug) {
  const a = path.join(FIXTURES_DIR, `${slug}.html`);
  const b = path.join(LEGACY_PILOTS_DIR, `${slug}.html`);
  if (existsSync(a)) return a;
  if (existsSync(b)) return b;
  return null;
}

function cssFromItem(item) {
  return (item.files ?? [])
    .filter((f) => f.path?.endsWith('.css'))
    .map((f) => f.content ?? '')
    .join('\n\n');
}

/**
 * @param {{ slug: string, html: string, css: string, item: object, nestedTokens: object }} args
 */
async function buildArtifact({ slug, html, css, item, nestedTokens }) {
  try {
    const pkg = generateXscp(html, css, { slug });

    const styleLessCss = pkg.clipboard.payload.styles
      .map((s) => [s.styleLess, ...Object.values(s.variants || {}).map((v) => v.styleLess)].join(' '))
      .join(' ');
    const tokens = resolveTokensCss(`${styleLessCss}\n${pkg.headCss}`, nestedTokens);
    for (const name of tokens.unresolved) {
      pkg.unsupported.push({
        prop: `--${name}`,
        selector: ':root',
        reason:
          'token not found in tokens-nested.json — resolve upstream or the declaration stays invalid on paste',
      });
    }

    let motion = buildMotionScripts(item, slug);
    if (motion.motionOmitted) {
      // Ruidoso, nunca silencioso: pintura sí, JS no-verificado no. Queda en
      // unsupported (visible en artefacto/docs) y el caller lo loguea.
      pkg.unsupported.push({
        prop: 'motion',
        selector: slug,
        reason: 'animated component without a verifiable behavior contract — emitted static',
      });
    }

    // Semántica opt-in (auditoría F10): 0 hooks del contrato en el render =
    // el componente NO activa el behavior → estático (no excluir); hooks
    // parciales = anatomía rota de verdad → excluir.
    let domContract = getDomContract(slug) ?? getDomContractSync(slug);
    if (domContract) {
      const present = countContractHooks(html, domContract);
      if (present === 0) {
        motion = { js: [], init: '', motionOmitted: true };
        domContract = null;
        pkg.unsupported.push({
          prop: 'motion',
          selector: slug,
          reason: 'motion opt-in hooks not present in canonical render (e.g. animated=false default) — emitted static; set meta.webflow.previewProps to enable',
        });
      } else {
        const check = validateHtmlAgainstContract(html, domContract);
        if (!check.ok) {
          return {
            ok: false,
            reason: `domContract fail: missing ${check.missing.join(', ')}`,
          };
        }
      }
    }

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

    return {
      ok: true,
      artifact: {
        slug,
        format: 'webflow-xscp',
        clipboard: pkg.clipboard,
        headCss: pkg.headCss,
        tokensCss: tokens.tokensCss,
        tokensResolved: tokens.resolved,
        manifest,
        footerNote: pkg.footerNote,
        unsupported: pkg.unsupported,
      },
    };
  } catch (e) {
    return { ok: false, reason: `generate failed: ${e.message}` };
  }
}
