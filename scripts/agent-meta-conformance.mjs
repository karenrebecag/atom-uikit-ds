/**
 * F4 — Conformance meta.agent.configurables ↔ published React source.
 * Pure comparison + optional CLI over public/r.
 * Canonical module; MCP tests may duplicate the small check (no shared package).
 */

/**
 * Extract { propName → defaultString | undefined } from published React source.
 * Supports:
 *   export function X({ a = 1, b = 'x' }) { … }
 *   export const X = forwardRef( ({ a = 1 }, ref) => { … })
 *   ({ a = 1 }) => …
 * Returns null if no props destructuring signature is found (unparseable).
 *
 * @param {string} reactSource
 * @returns {Map<string, string | undefined> | null}
 */
/**
 * @param {string} reactSource
 * @param {string} [componentHint] — registry slug or PascalCase name; prefers that export in multi-export files
 * @returns {Map<string, string | undefined> | null}
 */
export function parseReactProps(reactSource, componentHint) {
  if (typeof reactSource !== 'string' || !reactSource.trim()) return null;

  const body = extractDestructureBody(reactSource, componentHint);
  if (body == null) return null;

  const props = new Map();
  // Skip rest (...props). Capture name and optional default.
  const re = /(\.\.\.\w+)|(\w+)(?:\s*=\s*([^,}\n]+))?/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    if (m[1]) continue; // rest
    const name = m[2];
    if (!name) continue;
    if (m[3] !== undefined) {
      props.set(name, normalizeDefault(m[3]));
    } else {
      props.set(name, undefined);
    }
  }

  return props.size > 0 ? props : null;
}

/** @param {string} slug */
function slugToPascal(slug) {
  return String(slug)
    .split(/[-_/]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

/**
 * @param {string} src
 * @param {string} [componentHint]
 * @returns {string | null}
 */
function extractDestructureBody(src, componentHint) {
  // After `}` allow optional TS type annotation (`}: Props`) before `,` or `)`.
  const afterBrace = String.raw`\}\s*(?::\s*[^=,{()]+)?\s*`;
  const pascal = componentHint ? slugToPascal(componentHint) : null;

  // Prefer the named primary export (button-group → ButtonGroup) so multi-export
  // files (Group + Separator + Text) do not yield the first helper's props only.
  if (pascal) {
    const named = [
      new RegExp(
        String.raw`(?:export\s+)?(?:default\s+)?function\s+${pascal}\s*\(\s*\{([\s\S]*?)${afterBrace}[,)]`,
      ),
      new RegExp(
        String.raw`(?:export\s+)?const\s+${pascal}\s*=\s*forwardRef\s*(?:<[^>]*>)?\s*\(\s*\(\s*\{([\s\S]*?)\}\s*,`,
      ),
      new RegExp(
        String.raw`(?:export\s+)?const\s+${pascal}\s*=\s*\(\s*\{([\s\S]*?)${afterBrace}\)\s*=>`,
      ),
    ];
    for (const re of named) {
      const m = src.match(re);
      if (m?.[1] != null) return m[1];
    }
  }

  const patterns = [
    // function Component({ ... }) / function Component({ ... }: Props)
    new RegExp(
      String.raw`(?:export\s+)?(?:default\s+)?function\s+\w+\s*\(\s*\{([\s\S]*?)${afterBrace}[,)]`,
    ),
    // forwardRef( ({ ... }, ref) =>
    /forwardRef\s*(?:<[^>]*>)?\s*\(\s*\(\s*\{([\s\S]*?)\}\s*,/,
    // const X = ({ ... }) =>  or  ({ ... }: Props) =>
    new RegExp(
      String.raw`(?:export\s+)?const\s+\w+\s*=\s*\(\s*\{([\s\S]*?)${afterBrace}\)\s*=>`,
    ),
    // bare ({ ... }) =>
    new RegExp(String.raw`^\s*\(\s*\{([\s\S]*?)${afterBrace}\)\s*=>`, 'm'),
  ];
  for (const re of patterns) {
    const m = src.match(re);
    if (m?.[1] != null) return m[1];
  }
  return null;
}

/**
 * @param {string} raw
 * @returns {string}
 */
export function normalizeDefault(raw) {
  let s = String(raw).trim();
  // strip trailing comments
  s = s.replace(/\/\/.*$/, '').trim();
  // strip surrounding quotes
  if (
    (s.startsWith("'") && s.endsWith("'")) ||
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith('`') && s.endsWith('`'))
  ) {
    s = s.slice(1, -1);
  }
  return s;
}

/**
 * @typedef {{ prop: string, type?: string, default?: string }} AgentConfigurable
 * @typedef {{
 *   slug: string,
 *   missing: string[],
 *   mismatched: Array<{ prop: string, manifest: string, source: string }>,
 *   unparseable: boolean
 * }} ConformanceReport
 */

/**
 * @param {string} slug
 * @param {AgentConfigurable[]} configurables
 * @param {string} reactSource
 * @returns {ConformanceReport}
 */
export function checkConformance(slug, configurables, reactSource) {
  const props = parseReactProps(reactSource, slug);
  if (props === null) {
    return { slug, missing: [], mismatched: [], unparseable: true };
  }

  const list = Array.isArray(configurables) ? configurables : [];
  const missing = [];
  const mismatched = [];

  for (const c of list) {
    if (!c || typeof c.prop !== 'string') continue;
    if (!props.has(c.prop)) {
      missing.push(c.prop);
      continue;
    }
    if (c.default === undefined || c.default === null) continue;
    const sourceDef = props.get(c.prop);
    const manifestDef = normalizeDefault(String(c.default));
    if (sourceDef === undefined) {
      mismatched.push({ prop: c.prop, manifest: manifestDef, source: '(none)' });
    } else if (String(sourceDef) !== String(manifestDef)) {
      mismatched.push({ prop: c.prop, manifest: manifestDef, source: String(sourceDef) });
    }
  }

  return { slug, missing, mismatched, unparseable: false };
}

/**
 * Scan public/r/*.json for items with meta.agent; compare to embedded React.
 * @param {string} publicRDir
 * @param {{ readFileSync: Function, readdirSync: Function }} fs
 * @param {{ join: Function }} path
 * @returns {{ reports: ConformanceReport[], failures: number }}
 */
export function runPublishedConformance(publicRDir, fs, path) {
  const reports = [];
  let failures = 0;

  if (!fs.existsSync?.(publicRDir) && !fs.readdirSync) {
    return { reports, failures: 1 };
  }

  let files;
  try {
    files = fs.readdirSync(publicRDir).filter((f) => f.endsWith('.json') && f !== 'index.json' && f !== 'tokens-nested.json');
  } catch {
    return { reports, failures: 1 };
  }

  for (const file of files) {
    const raw = fs.readFileSync(path.join(publicRDir, file), 'utf8');
    let item;
    try {
      item = JSON.parse(raw);
    } catch {
      continue;
    }
    const agent = item.meta?.agent;
    if (!agent?.configurables?.length) continue;

    const reactFile = (item.files ?? []).find(
      (f) => typeof f.path === 'string' && (f.path.endsWith('.tsx') || f.path.endsWith('.jsx')),
    );
    const reactSource = reactFile?.content ?? '';
    const report = checkConformance(item.name ?? file, agent.configurables, reactSource);
    reports.push(report);

    if (report.unparseable || report.missing.length || report.mismatched.length) {
      failures++;
    }
  }

  return { reports, failures };
}

/**
 * Format one report line for CI logs.
 * @param {ConformanceReport} r
 */
export function formatReport(r) {
  if (r.unparseable) return `${r.slug}: unparseable React props signature`;
  const parts = [];
  if (r.missing.length) parts.push(`missing props [${r.missing.join(', ')}]`);
  for (const m of r.mismatched) {
    parts.push(`${m.prop}: manifest="${m.manifest}" source="${m.source}"`);
  }
  return parts.length ? `${r.slug}: ${parts.join('; ')}` : `${r.slug}: ok`;
}

// CLI: node scripts/agent-meta-conformance.mjs
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('agent-meta-conformance.mjs')) {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const root = path.resolve(import.meta.dirname, '..');
  const pub = path.join(root, 'public', 'r');
  const { reports, failures } = runPublishedConformance(pub, fs, path);
  for (const r of reports) {
    const line = formatReport(r);
    if (r.unparseable || r.missing.length || r.mismatched.length) {
      console.error(`  FAIL  [agent-meta] ${line}`);
    } else {
      console.log(`  OK    [agent-meta] ${line}`);
    }
  }
  if (reports.length === 0) {
    console.log('  OK    [agent-meta] no items with meta.agent (nothing to check)');
  }
  console.log(failures ? `\n${failures} agent-meta conformance failure(s)` : '\nagent-meta conformance green');
  process.exit(failures ? 1 : 0);
}
