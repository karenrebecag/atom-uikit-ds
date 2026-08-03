/**
 * F16a — Content coverage board.
 * Reads emitted artifacts only (public/r, docs/editorial, webflow index, animations).
 * Writes public/r/content-coverage.json + prints a noisy table.
 *
 * Usage:
 *   node scripts/content-coverage.mjs
 *   node scripts/content-coverage.mjs --check-no-regression  # F16d: exit 1 if score dropped
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_R = path.join(ROOT, 'public', 'r');
const EDITORIAL_DIR = path.join(ROOT, 'docs', 'editorial');
const ANIM_DIST = path.join(ROOT, 'packages', 'animations', 'dist');
const OUT_PATH = path.join(PUBLIC_R, 'content-coverage.json');

/** Category priority for agent/editorial batches (higher first). */
const CATEGORY_PRIORITY = {
  actions: 100,
  forms: 90,
  indicators: 80,
  navigation: 70,
  surfaces: 60,
  'data-display': 50,
  layout: 40,
  foundation: 10,
  hook: 5,
};

const BATCH_SIZE = 12;

/**
 * @param {string} root
 * @returns {import('./content-coverage-types').CoverageReport}
 */
export function buildContentCoverage(root = ROOT) {
  const publicR = path.join(root, 'public', 'r');
  const editorialDir = path.join(root, 'docs', 'editorial');
  const animDist = path.join(root, 'packages', 'animations', 'dist');

  const indexPath = path.join(publicR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`content-coverage: missing ${indexPath} — run build:registry first`);
  }
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const entries = Array.isArray(index) ? index : index.items || [];

  const editorialSet = new Set();
  if (fs.existsSync(editorialDir)) {
    for (const f of fs.readdirSync(editorialDir)) {
      if (f.endsWith('.md')) editorialSet.add(f.replace(/\.md$/, ''));
    }
  }

  const webflow = loadWebflowIndex(path.join(publicR, 'webflow', 'index.json'));
  const motionModules = listMotionModules(animDist);

  /** @type {Array<Record<string, unknown>>} */
  const items = [];
  let sumScore = 0;

  for (const entry of entries) {
    const slug = entry.name;
    const safe = String(slug).replace(/\//g, '--');
    const itemPath = path.join(publicR, `${safe}.json`);
    if (!fs.existsSync(itemPath)) continue;

    const item = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
    const kind = entry.kind || item.type || 'unknown';
    const category = item.atom?.discovery?.category || entry.discovery?.category || kind;
    // Prefer real published files over registry flag (whatsapp-button had hasReact:true
    // with only .css + config.ts — Webflow correctly said "no React source").
    const hasReact = itemHasReactSource(item);
    const hasCss =
      itemHasCssSource(item) || !!item.atom?.implementation?.hasCss;

    const metaAgent = classifyAgent(item.meta?.agent);
    const editorial = editorialSet.has(safe) || editorialSet.has(String(slug).split('/').pop());
    const derivedPartials = item.meta?.derived?.degradeReasons || [];
    const derivedOk = !!item.meta?.derived?.sourceCommit;
    const webflowStatus = classifyWebflow(slug, kind, webflow);
    const motionContract = hasMotionContract(slug, item, motionModules);

    const eligibleAgent = kind === 'component' && hasReact;
    const excludedAgent = !eligibleAgent
      ? excludeReason(kind, hasReact, slug)
      : null;

    const contentScore = scoreItem({
      metaAgent,
      editorial,
      derivedOk,
      derivedPartials,
      webflowStatus,
      motionContract,
      eligibleAgent,
    });
    sumScore += contentScore;

    items.push({
      slug,
      kind,
      category,
      hasReact,
      hasCss,
      metaAgent,
      editorial,
      derivedPartials,
      derivedOk,
      webflow: webflowStatus.status,
      webflowReason: webflowStatus.reason || null,
      motionContract,
      eligibleAgent,
      excludedAgent,
      contentScore,
    });
  }

  const totals = summarize(items);
  const batches = buildBatches(items);
  const generatedAt = new Date().toISOString();

  /** @type {Record<string, unknown> | null} */
  let previous = null;
  if (fs.existsSync(OUT_PATH)) {
    try {
      previous = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
    } catch {
      previous = null;
    }
  }

  const prevScore = previous?.totals?.aggregateScore ?? null;
  const delta =
    prevScore == null ? null : Math.round((totals.aggregateScore - prevScore) * 10) / 10;

  const report = {
    generatedAt,
    source: 'public/r + docs/editorial + webflow index + animations dist',
    scoreRubric: {
      metaAgentFull: 40,
      metaAgentPartial: 20,
      editorial: 25,
      derivedOk: 15,
      derivedNoPartial: 5,
      webflowEmitted: 10,
      webflowExcluded: 5,
      motionContract: 5,
      max: 100,
    },
    totals,
    batches,
    items,
  };

  // La comparacion contra la corrida anterior se calcula pero NO se serializa.
  //
  // Escribirla dentro del artefacto lo vuelve irreproducible por construccion:
  // "lo de antes" no sale del codigo fuente, sale del propio historial del
  // archivo, asi que cada build desplaza los dos campos y el check de deriva se
  // pone rojo sin que nada haya cambiado de verdad. Un gate con falsos positivos
  // entrena a ignorarlo.
  //
  // El gate de no-regresion (F16d) y la tabla las siguen leyendo igual: son
  // propiedades normales, solo que invisibles para JSON.stringify.
  Object.defineProperty(report, 'previousAggregateScore', { value: prevScore, enumerable: false });
  Object.defineProperty(report, 'deltaAggregateScore', { value: delta, enumerable: false });

  return report;
}

function classifyAgent(agent) {
  if (!agent || typeof agent !== 'object') return 'none';
  const hasUsage = typeof agent.usage === 'string' && agent.usage.trim();
  const conf = Array.isArray(agent.configurables) ? agent.configurables : [];
  const gotchas = Array.isArray(agent.gotchas) ? agent.gotchas : [];
  // full: usage + (configurables with what/how OR empty conf for compound + gotchas)
  if (hasUsage && conf.length > 0) {
    const ok = conf.every(
      (c) => c && typeof c.prop === 'string' && typeof c.what === 'string' && typeof c.how === 'string',
    );
    return ok ? 'full' : 'partial';
  }
  if (hasUsage && gotchas.length > 0) return 'full'; // compound roots (accordion, select)
  if (hasUsage || conf.length || gotchas.length) return 'partial';
  return 'none';
}

/** True if published item embeds a React/TSX source file (not the registry flag). */
export function itemHasReactSource(item) {
  const files = item?.files;
  if (!Array.isArray(files)) return false;
  return files.some((f) => {
    const p = typeof f?.path === 'string' ? f.path : typeof f?.outputPath === 'string' ? f.outputPath : '';
    return /\.(tsx|jsx)$/i.test(p);
  });
}

/** True if published item embeds a CSS file. */
export function itemHasCssSource(item) {
  const files = item?.files;
  if (!Array.isArray(files)) return false;
  return files.some((f) => {
    const p = typeof f?.path === 'string' ? f.path : typeof f?.outputPath === 'string' ? f.outputPath : '';
    return /\.css$/i.test(p);
  });
}

function loadWebflowIndex(p) {
  if (!fs.existsSync(p)) return { emitted: new Set(), excluded: new Map() };
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const emitted = new Set([...(j.emitted || j.pilots || [])]);
  /** @type {Map<string, string>} */
  const excluded = new Map();
  if (Array.isArray(j.excluded)) {
    for (const e of j.excluded) {
      if (typeof e === 'string') excluded.set(e, 'excluded');
      else if (e?.name || e?.slug) {
        excluded.set(e.name || e.slug, e.reason || 'excluded');
      }
    }
  } else if (j.excluded && typeof j.excluded === 'object') {
    for (const [k, v] of Object.entries(j.excluded)) {
      excluded.set(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  }
  return { emitted, excluded };
}

function listMotionModules(animDist) {
  if (!fs.existsSync(animDist)) return new Set();
  return new Set(
    fs
      .readdirSync(animDist)
      .filter((f) => f.endsWith('.js') && !f.includes('index') && !f.includes('browser')),
  );
}

function hasMotionContract(slug, item, motionModules) {
  if (!item.atom?.discovery?.hasAnimation && !(item.atom?.implementation?.peerDeps || []).includes('gsap')) {
    return false;
  }
  // heuristic: any animation dist module counts as infra present for animated items
  return motionModules.size > 0;
}

function classifyWebflow(slug, kind, webflow) {
  if (kind === 'layout' || kind === 'hook' || kind === 'foundation') {
    return { status: 'n/a', reason: kind };
  }
  if (webflow.emitted.has(slug)) return { status: 'emitted' };
  if (webflow.excluded.has(slug)) {
    return { status: 'excluded', reason: webflow.excluded.get(slug) };
  }
  // not in index — treat as n/a for non-components or missing
  return { status: 'n/a', reason: 'not-in-webflow-index' };
}

function excludeReason(kind, hasReact, slug) {
  if (kind === 'foundation') return 'foundation — not a UI component for agent manifests';
  if (kind === 'hook') return 'hook — animation hook, not registry:ui consumer surface';
  if (kind === 'layout') return 'layout — composition block; agent manifest deferred';
  if (!hasReact) return 'no React source';
  if (String(slug).startsWith('layout/')) return 'layout path';
  return 'not eligible';
}

function scoreItem({
  metaAgent,
  editorial,
  derivedOk,
  derivedPartials,
  webflowStatus,
  motionContract,
  eligibleAgent,
}) {
  let s = 0;
  if (metaAgent === 'full') s += 40;
  else if (metaAgent === 'partial') s += 20;
  if (editorial) s += 25;
  if (derivedOk) {
    s += 15;
    if (!derivedPartials?.length) s += 5;
  }
  if (webflowStatus.status === 'emitted') s += 10;
  else if (webflowStatus.status === 'excluded') s += 5;
  if (motionContract) s += 5;
  // ineligible agents shouldn't tank the narrative — still score derived/webflow
  if (!eligibleAgent && metaAgent === 'none') {
    // no penalty beyond missing points
  }
  return Math.min(100, s);
}

function summarize(items) {
  const eligible = items.filter((i) => i.eligibleAgent);
  const agentFull = eligible.filter((i) => i.metaAgent === 'full').length;
  const agentPartial = eligible.filter((i) => i.metaAgent === 'partial').length;
  const agentNone = eligible.filter((i) => i.metaAgent === 'none').length;
  const editorialEligible = items.filter((i) => i.kind === 'component' && i.hasReact);
  const editorialYes = editorialEligible.filter((i) => i.editorial).length;
  const derivedOk = items.filter((i) => i.derivedOk).length;
  const webflowEmitted = items.filter((i) => i.webflow === 'emitted').length;
  const webflowExcluded = items.filter((i) => i.webflow === 'excluded').length;
  const aggregateScore =
    items.length === 0
      ? 0
      : Math.round((items.reduce((a, i) => a + i.contentScore, 0) / items.length) * 10) / 10;

  return {
    items: items.length,
    eligibleAgent: eligible.length,
    metaAgent: {
      full: agentFull,
      partial: agentPartial,
      none: agentNone,
      fullPct: eligible.length ? Math.round((agentFull / eligible.length) * 1000) / 10 : 0,
    },
    editorial: {
      yes: editorialYes,
      eligible: editorialEligible.length,
      pct: editorialEligible.length
        ? Math.round((editorialYes / editorialEligible.length) * 1000) / 10
        : 0,
    },
    derived: { withSourceCommit: derivedOk },
    webflow: { emitted: webflowEmitted, excluded: webflowExcluded },
    aggregateScore,
  };
}

function buildBatches(items) {
  const missing = items
    .filter((i) => i.eligibleAgent && i.metaAgent !== 'full')
    .sort((a, b) => {
      const pa = CATEGORY_PRIORITY[a.category] ?? 0;
      const pb = CATEGORY_PRIORITY[b.category] ?? 0;
      if (pb !== pa) return pb - pa;
      // prefer no agent over partial
      if (a.metaAgent !== b.metaAgent) {
        return a.metaAgent === 'none' ? -1 : 1;
      }
      return a.slug.localeCompare(b.slug);
    });

  /** @type {Array<{ id: string, kind: string, slugs: string[], categories: string[] }>} */
  const batches = [];
  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const chunk = missing.slice(i, i + BATCH_SIZE);
    const cats = [...new Set(chunk.map((c) => c.category))];
    batches.push({
      id: `meta-agent-${batches.length + 1}`,
      kind: 'meta.agent',
      slugs: chunk.map((c) => c.slug),
      categories: cats,
    });
  }

  const needEditorial = items
    .filter((i) => i.kind === 'component' && i.hasReact && !i.editorial)
    .sort((a, b) => {
      const pa = CATEGORY_PRIORITY[a.category] ?? 0;
      const pb = CATEGORY_PRIORITY[b.category] ?? 0;
      if (pb !== pa) return pb - pa;
      return a.slug.localeCompare(b.slug);
    });

  for (let i = 0; i < needEditorial.length; i += BATCH_SIZE) {
    const chunk = needEditorial.slice(i, i + BATCH_SIZE);
    const cats = [...new Set(chunk.map((c) => c.category))];
    batches.push({
      id: `editorial-${Math.floor(i / BATCH_SIZE) + 1}`,
      kind: 'editorial',
      slugs: chunk.map((c) => c.slug),
      categories: cats,
    });
  }

  return batches;
}

export function formatCoverageTable(report) {
  const t = report.totals;
  const lines = [
    '',
    '  ── F16 content coverage ─────────────────────────────────',
    `  items=${t.items}  aggregateScore=${t.aggregateScore}${
      report.deltaAggregateScore != null ? `  Δ=${report.deltaAggregateScore}` : ''
    }`,
    `  meta.agent (eligible ${t.eligibleAgent}): full=${t.metaAgent.full} partial=${t.metaAgent.partial} none=${t.metaAgent.none} (${t.metaAgent.fullPct}%)`,
    `  editorial (eligible ${t.editorial.eligible}): ${t.editorial.yes} (${t.editorial.pct}%)`,
    `  derived sourceCommit: ${t.derived.withSourceCommit}/${t.items}`,
    `  webflow: emitted=${t.webflow.emitted} excluded=${t.webflow.excluded}`,
    `  batches pending: ${report.batches.length} (next: ${report.batches[0]?.id || '—'} → ${(report.batches[0]?.slugs || []).slice(0, 5).join(', ')}${(report.batches[0]?.slugs?.length || 0) > 5 ? '…' : ''})`,
    '  ────────────────────────────────────────────────────────',
    '',
  ];
  return lines.join('\n');
}

export function writeContentCoverage(root = ROOT) {
  const report = buildContentCoverage(root);
  const out = path.join(root, 'public', 'r', 'content-coverage.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n', 'utf8');
  return report;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('content-coverage.mjs')) {
  try {
    const report = writeContentCoverage();
    process.stdout.write(formatCoverageTable(report));
    console.log(`  wrote ${OUT_PATH}`);

    if (process.argv.includes('--check-no-regression')) {
      if (report.deltaAggregateScore != null && report.deltaAggregateScore < 0) {
        console.error(
          `F16d FAIL: aggregateScore dropped by ${-report.deltaAggregateScore} (was ${report.previousAggregateScore}, now ${report.totals.aggregateScore})`,
        );
        process.exit(1);
      }
      console.log('  F16d no-regression: OK');
    }
  } catch (e) {
    console.error(e.message || e);
    process.exit(1);
  }
}
