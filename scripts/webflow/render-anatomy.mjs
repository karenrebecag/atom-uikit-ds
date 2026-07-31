/**
 * F8a — Render canónico HTML from components-react dist (SSR).
 * Source of truth for Webflow anatomy — pilots/*.html become regression fixtures only.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const REACT_PKG = path.join(ROOT, 'packages/components-react/package.json');
const DIST = path.join(ROOT, 'packages/components-react/dist');

/**
 * @typedef {{ html: string, exportName: string, distPath: string }} RenderOk
 * @typedef {{ reason: string }} RenderFail
 */

/**
 * Resolve dist file for a registry component file path.
 * @param {string} registryPath e.g. components/atoms/Badge.tsx
 */
export function resolveDistPath(registryPath) {
  const cleaned = registryPath
    .replace(/^components\//, '')
    .replace(/\.tsx$/, '.js');
  const candidates = [
    path.join(DIST, cleaned),
    path.join(DIST, 'atoms', path.basename(cleaned)),
    path.join(DIST, 'molecules', path.basename(cleaned)),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

/**
 * Build preview props from item discovery + optional meta.webflow.previewProps.
 * @param {Record<string, unknown>} item
 */
export function buildPreviewProps(item) {
  const discovery = item.atom?.discovery ?? {};
  const wf = item.meta?.webflow ?? {};
  const preview = wf.previewProps && typeof wf.previewProps === 'object' ? { ...wf.previewProps } : {};
  const props = { ...preview };

  if (props.variant === undefined && discovery.defaultVariant) {
    const vp = discovery.variantProp || 'variant';
    props[vp] = discovery.defaultVariant;
  }
  if (props.size === undefined && discovery.defaultSize) {
    props.size = discovery.defaultSize;
  }
  return props;
}

/**
 * @param {Record<string, unknown>} item - published registry item JSON
 * @returns {Promise<RenderOk | RenderFail>}
 */
export async function renderAnatomy(item) {
  const slug = item.name;
  if (!fs.existsSync(REACT_PKG)) {
    return { reason: 'components-react package.json missing' };
  }
  if (!fs.existsSync(DIST)) {
    return { reason: 'components-react dist missing — run pnpm --filter @atom-uikit/components-react build' };
  }

  const tsx = (item.files ?? []).find((f) => typeof f.path === 'string' && f.path.endsWith('.tsx'));
  if (!tsx) {
    return { reason: 'no React source (css-only / no-tsx)' };
  }

  const distPath = resolveDistPath(tsx.path);
  if (!distPath) {
    return { reason: `missing dist for ${tsx.path}` };
  }

  let React;
  let renderToStaticMarkup;
  try {
    const req = createRequire(REACT_PKG);
    React = req('react');
    ({ renderToStaticMarkup } = req('react-dom/server'));
  } catch (e) {
    return { reason: `react resolve failed: ${e.message}` };
  }

  let mod;
  try {
    mod = await import(pathToFileURL(distPath).href);
  } catch (e) {
    return { reason: `import failed: ${e.message}` };
  }

  const base = path.basename(tsx.path, '.tsx');
  let Component = mod[base] ?? mod.default;
  if (!Component) {
    // Prefer first function export with capital name
    Component = Object.entries(mod).find(
      ([k, v]) => /^[A-Z]/.test(k) && (typeof v === 'function' || (typeof v === 'object' && v !== null)),
    )?.[1];
  }
  if (!Component) {
    return { reason: `no component export (have: ${Object.keys(mod).slice(0, 8).join(', ')})` };
  }

  const props = buildPreviewProps(item);
  const discovery = item.atom?.discovery ?? {};
  const needsChildren = (discovery.props ?? []).some((p) => p.name === 'children' && p.required);
  const wf = item.meta?.webflow ?? {};
  const previewChildren = wf.previewChildren;

  let children = undefined;
  if (Array.isArray(previewChildren) && previewChildren.length) {
    // Marquee: prefer MarqueeItem if exported
    const Item = mod.MarqueeItem;
    children = previewChildren.map((label) =>
      Item
        ? React.createElement(Item, { key: String(label) }, label)
        : React.createElement('div', { key: String(label), className: 'marquee__item' }, label),
    );
  } else if (needsChildren) {
    children = wf.previewChild ?? 'Atom';
  }

  try {
    const el =
      children !== undefined
        ? React.createElement(Component, props, ...(Array.isArray(children) ? children : [children]))
        : React.createElement(Component, props);
    const html = renderToStaticMarkup(el);
    if (!html || html.length < 3) {
      return { reason: 'empty HTML from renderToStaticMarkup' };
    }
    return { html, exportName: base, distPath };
  } catch (e) {
    return { reason: `render error: ${e.message}` };
  }
}

/**
 * @param {string} publicRDir
 * @param {string} slug
 */
export async function renderAnatomyFromPublished(publicRDir, slug) {
  const safe = slug.replace(/\//g, '--');
  const itemPath = path.join(publicRDir, `${safe}.json`);
  if (!fs.existsSync(itemPath)) return { reason: 'registry item not found' };
  const item = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
  return renderAnatomy(item);
}
