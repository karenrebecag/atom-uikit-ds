/**
 * extract-component-metadata.ts
 *
 * Extracts structured metadata from DS source files and produces
 * AtomField (discovery + implementation) for each registry item.
 *
 * Called by build-registry.mjs after embedding source content.
 * Reads the same source files referenced in registry.json.
 *
 * Ported from: atom-uikit-cms-db/mcp/scripts/embed-source.ts (lines 146-227)
 * Reference: plan-registry-consolidation.md, Wave 1
 *
 * ## Known limitations (documented for v1)
 *
 * 1. COMPOUND COMPONENTS: For components that export multiple sub-components
 *    (e.g. Dialog → DialogContent, DialogTitle, DialogClose), only the main
 *    Props interface/type is extracted. Sub-component props are not captured.
 *    Impact: props[] will be incomplete for compound components.
 *
 * 2. VARIANT/SIZE DETECTION: Only detects explicit `type XxxVariant = 'a' | 'b'`
 *    unions or `variant?: 'a' | 'b'` inline annotations. Components that use
 *    programmatic variant logic (e.g. computed from props) will show empty arrays.
 *
 * 3. CATEGORY INFERENCE: Uses CSS directory path + manual overrides map.
 *    New components in unexpected directories need a CATEGORY_OVERRIDES entry.
 *
 * 4. REGEX-BASED: All extraction is regex-based (not AST). Complex type expressions,
 *    multi-file type imports, or conditional types may not parse correctly.
 *    This is intentional for build speed — AST parsing adds 2-3s to the build.
 *
 * 5. DEFAULT VALUES: Only detects string literal defaults from destructuring
 *    patterns (`{ variant = 'primary' }`). Boolean defaults or computed defaults
 *    are not captured.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';

import type {
  AtomField,
  AtomDiscovery,
  AtomImplementation,
  AtomPropDescriptor,
  AtomCategory,
  AtomRegistryItem,
} from './registry-schema';

/* ---- Types ---- */

export interface ExtractionResult {
  slug: string;
  atom: AtomField;
}

export interface ExtractionReport {
  results: Map<string, AtomField>;
  skipped: string[];
  errors: Array<{ slug: string; error: string }>;
}

/* ---- Category inference ---- */

const CSS_DIR_TO_CATEGORY: Record<string, AtomCategory> = {
  buttons: 'actions',
  actions: 'actions',
  forms: 'forms',
  indicators: 'indicators',
  navigation: 'navigation',
  layout: 'layout',
  feedback: 'surfaces',
  surfaces: 'surfaces',
  atoms: 'actions',
  molecules: 'surfaces',
};

/**
 * Manual category overrides for components whose CSS directory
 * doesn't match their semantic category.
 */
const CATEGORY_OVERRIDES: Record<string, AtomCategory> = {
  // Overlay surfaces (live in layout/ dir but are surfaces)
  dialog: 'surfaces',
  'alert-dialog': 'surfaces',
  sheet: 'surfaces',
  drawer: 'surfaces',
  toast: 'surfaces',
  tooltip: 'surfaces',
  // Navigation (live in forms/ dir but are navigation)
  'dropdown-menu': 'navigation',
  'context-menu': 'navigation',
  combobox: 'forms',
  // Data display
  table: 'data-display',
  calendar: 'data-display',
  // Layout
  accordion: 'layout',
  resizable: 'layout',
  sidebar: 'navigation',
};

function inferCategory(item: AtomRegistryItem): AtomCategory {
  if (item.kind === 'foundation') return 'foundation';
  if (item.kind === 'hook') return 'hook';

  // Check explicit overrides first
  if (item.name in CATEGORY_OVERRIDES) {
    return CATEGORY_OVERRIDES[item.name];
  }

  // Infer from CSS sourcePath directory
  for (const file of item.files) {
    if (file.sourcePath.endsWith('.css')) {
      const parts = file.sourcePath.split('/');
      // e.g. packages/css/src/components/buttons/button.css → "buttons"
      const dirIdx = parts.indexOf('components');
      if (dirIdx !== -1 && parts[dirIdx + 1]) {
        const dir = parts[dirIdx + 1];
        if (dir in CSS_DIR_TO_CATEGORY) {
          return CSS_DIR_TO_CATEGORY[dir];
        }
      }
    }
  }

  return 'actions'; // fallback
}

/* ---- Extraction helpers (ported from embed-source.ts) ---- */

/**
 * Extract union type literals from TypeScript source.
 * e.g. type ButtonVariant = 'primary' | 'secondary' → ['primary', 'secondary']
 */
function extractUnionLiterals(source: string, pattern: RegExp): string[] {
  const match = source.match(pattern);
  if (!match) return [];
  const literals = match[0].match(/'([^']+)'/g);
  return literals ? literals.map((l) => l.slice(1, -1)) : [];
}

/**
 * Extract variant names from React source.
 * Looks for: type XxxVariant = 'a' | 'b' | 'c'
 * Fallback: variant?: 'a' | 'b' | 'c' in interface
 */
function extractVariants(react: string): string[] {
  const typeBlock = react.match(/type\s+\w*Variant\w*\s*=\s*([^;]+)/s);
  if (typeBlock) return extractUnionLiterals(typeBlock[0], /=\s*([^;]+)/s);

  const propLine = react.match(/variant\??\s*:\s*([^;}\n]+)/);
  if (propLine) {
    const literals = propLine[1].match(/'([^']+)'/g);
    if (literals) return literals.map((l) => l.slice(1, -1));
  }
  return [];
}

/**
 * Extract size names from React source.
 * Looks for: type XxxSize = 'xs' | 's' | 'm'
 * Fallback: size?: 'xs' | 's' | 'm' in interface
 */
function extractSizes(react: string): string[] {
  const typeBlock = react.match(/type\s+\w*Size\w*\s*=\s*([^;]+)/s);
  if (typeBlock) return extractUnionLiterals(typeBlock[0], /=\s*([^;]+)/s);

  const propLine = react.match(/size\??\s*:\s*([^;}\n]+)/);
  if (propLine) {
    const literals = propLine[1].match(/'([^']+)'/g);
    if (literals) return literals.map((l) => l.slice(1, -1));
  }
  return [];
}

/**
 * Extract props from exported Props type/interface.
 * Skips internal props (className, style).
 */
function extractProps(react: string): AtomPropDescriptor[] {
  const propsMatch = react.match(
    /(?:export\s+)?(?:type|interface)\s+\w*Props\w*\s*=?\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s,
  );
  if (!propsMatch) return [];

  const block = propsMatch[1];
  const props: AtomPropDescriptor[] = [];
  const lineRegex = /(\w+)(\?)?:\s*([^;]+)/g;
  let m: RegExpExecArray | null;

  while ((m = lineRegex.exec(block))) {
    const name = m[1];
    if (['className', 'style'].includes(name)) continue;
    const optional = !!m[2];
    let type = m[3].trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
    props.push({ name, type, required: !optional });
  }

  return props;
}

/**
 * Resolve type aliases to their union literal representation.
 * e.g. type ButtonVariant = 'primary' | 'secondary' → Map<"ButtonVariant", "'primary' | 'secondary'">
 * This allows props to show the actual union instead of the alias name.
 */
function resolveTypeAliases(react: string): Map<string, string> {
  const aliases = new Map<string, string>();
  // Match: type Xxx = 'a' | 'b' | 'c';
  const typeRegex = /type\s+(\w+)\s*=\s*([^;]+)/gs;
  let m: RegExpExecArray | null;
  while ((m = typeRegex.exec(react))) {
    const name = m[1];
    const value = m[2].trim();
    // Only resolve if it's a string union (contains quotes)
    if (value.includes("'") || value.includes('"')) {
      // Clean up: remove leading pipe, normalize whitespace
      const cleaned = value.replace(/\s+/g, ' ').replace(/^\s*\|\s*/, '');
      aliases.set(name, cleaned);
    }
  }
  return aliases;
}

/**
 * Extract default values from destructured params.
 * e.g. { variant = 'primary', size = 'm' }
 */
function extractDefaults(react: string): Record<string, string> {
  const defaults: Record<string, string> = {};
  const regex = /(\w+)\s*=\s*'([^']+)'/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(react))) {
    defaults[m[1]] = m[2];
  }
  return defaults;
}

/**
 * Extract required ARIA attributes from the React Props interface.
 * A prop is "required aria" if it starts with 'aria-' and is NOT optional (no '?').
 * e.g. 'aria-label': string → required; 'aria-label'?: string → optional
 */
function extractAriaRequired(react: string): string[] {
  const propsBlock = react.match(
    /(?:export\s+)?(?:type|interface)\s+\w*Props\w*\s*=?\s*\{([\s\S]*?)\}/,
  );
  if (!propsBlock) return [];

  const ariaProps: string[] = [];
  const lines = propsBlock[1].split('\n');

  for (const line of lines) {
    const match = line.match(/['"]?(aria-[\w-]+)['"]?\s*(\??):\s*/);
    if (match && match[2] !== '?') {
      ariaProps.push(match[1]);
    }
  }

  return ariaProps;
}

/**
 * Detect the type of children from the React Props interface.
 * Returns 'string' if children is typed as `string`, undefined otherwise.
 * ReactNode is the default — no need to annotate it.
 */
function extractChildrenType(react: string): 'string' | undefined {
  const propsBlock = react.match(
    /(?:export\s+)?(?:type|interface)\s+\w*Props\w*\s*=?\s*\{([\s\S]*?)\}/,
  );
  if (!propsBlock) return undefined;

  const match = propsBlock[1].match(/children\s*\??:\s*(string)\b/);
  return match ? 'string' : undefined;
}

/**
 * Extract BEM CSS class names from CSS source, scoped to the component.
 *
 * Strategy:
 * 1. If item declares `cssClassPrefixes` in registry.json, use those as authoritative.
 * 2. Otherwise, auto-discover root blocks by finding all classes in the CSS
 *    that start with the slug and don't contain BEM separators (-- or __).
 * 3. Keep only classes that belong to one of the identified root blocks
 *    (exact match, or starts with block-- or block__).
 * 4. Filter out state classes (is--*, has--*) which are cross-component utilities.
 *
 * This handles multi-block components (e.g. .input + .input-group in same file)
 * while excluding contextual selectors from other components.
 */
function extractCssClasses(css: string, slug: string, declaredPrefixes?: string[]): string[] {
  const matches = css.match(/\.[\w-]+(?=[^}]*\{)/g);
  if (!matches) return [];

  const raw = [...new Set(matches.map((m) => m.slice(1)))].filter(
    (c) => !c.startsWith('--') && c.length > 1,
  );

  // Determine root blocks (BEM block-level classes that scope this component)
  let rootBlocks: string[];

  if (declaredPrefixes && declaredPrefixes.length > 0) {
    // Use explicit prefixes from registry.json
    rootBlocks = declaredPrefixes;
  } else {
    // Auto-discover: find all root-level classes that start with the slug
    rootBlocks = raw.filter(
      (c) => !c.includes('--') && !c.includes('__') && c.startsWith(slug),
    );
    // Fallback: if nothing found, use slug itself
    if (rootBlocks.length === 0) rootBlocks = [slug];
  }

  // Keep classes that belong to any identified root block
  return raw.filter((c) => {
    // Skip state utility classes
    if (c.startsWith('is--') || c.startsWith('has--')) return false;

    return rootBlocks.some(
      (block) =>
        c === block || c.startsWith(`${block}--`) || c.startsWith(`${block}__`),
    );
  });
}

/**
 * Derive base CSS class from the component's class list.
 * The base class is the slug itself if it appears in the classes.
 * Fallback: the root class with the most BEM descendants.
 */
function deriveBaseClass(cssClasses: string[], slug: string): string {
  if (cssClasses.length === 0) return '';

  // Priority: if the slug itself is a class, it's the baseClass
  if (cssClasses.includes(slug)) return slug;

  // Only root-level classes can be base classes (no -- or __ in them)
  const rootClasses = cssClasses.filter(
    (c) => !c.includes('--') && !c.includes('__'),
  );

  if (rootClasses.length === 0) {
    const sorted = [...cssClasses].sort((a, b) => a.length - b.length);
    return sorted[0].split('--')[0].split('__')[0];
  }

  // Score each root class by how many others it parents
  let best = rootClasses[0];
  let bestScore = 0;

  for (const candidate of rootClasses) {
    const score = cssClasses.filter(
      (c) => c !== candidate && (c.startsWith(`${candidate}--`) || c.startsWith(`${candidate}__`)),
    ).length;
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}

/**
 * Known slug-to-animation-file mappings.
 * If a component has a corresponding animation module, it has animation.
 */
const ANIMATION_SLUG_MAP: Record<string, string> = {
  button: 'button-hover.ts',
  'icon-button': 'button-hover.ts',
  'link-button': 'button-hover.ts',
  'text-reveal': 'text-reveal.ts',
  sidebar: 'sidebar.ts',
  'progress-nav': 'progress-nav.ts',
  marquee: 'marquee-draggable.ts',
  'video-player': 'video-player.ts',
  'menu-button': 'menu-button.ts',
  // These components have GSAP animation modules but the component
  // source doesn't import them directly (user invokes separately)
  checkbox: 'button-hover.ts', // uses same hover animation
};

/**
 * Detect if a component uses GSAP animations.
 * Strategy 1: Check for animation file mapping by slug.
 * Strategy 2: Check for animation-related imports or function calls in source.
 */
function detectHasAnimation(sources: string[], slug: string, dsRoot: string): boolean {
  // Strategy 1: known animation file exists for this slug
  const animFile = ANIMATION_SLUG_MAP[slug];
  if (animFile) {
    const animPath = resolve(dsRoot, 'packages/animations/src', animFile);
    if (existsSync(animPath)) return true;
  }

  // Strategy 2: source imports or references animations
  const combined = sources.join('\n');
  return (
    combined.includes('@atom-uikit/animations') ||
    combined.includes('initButtonHover') ||
    combined.includes('initTextReveal') ||
    combined.includes('initSidebarAnimation') ||
    combined.includes('initProgressNav') ||
    combined.includes('initMarqueeDraggable') ||
    combined.includes('initVideoPlayer') ||
    combined.includes('initCounter') ||
    combined.includes('initStatsCard')
  );
}

/**
 * Detect peer dependencies from source imports.
 * Currently only detects GSAP as peer dep (via animation modules).
 */
function detectPeerDeps(
  sources: string[],
  dsRoot: string,
  hasAnimation: boolean,
): string[] {
  if (!hasAnimation) return [];

  const animPkgPath = resolve(dsRoot, 'packages/animations/package.json');
  if (existsSync(animPkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(animPkgPath, 'utf-8'));
      const peers = pkg.peerDependencies ?? {};
      return Object.keys(peers);
    } catch {
      /* ignore */
    }
  }

  return ['gsap']; // fallback
}

/* ---- Main extraction ---- */

/**
 * Extract AtomField metadata for a single registry item.
 * Reads the actual source files referenced in registry.json.
 */
export function extractMetadataForItem(
  item: AtomRegistryItem,
  dsRoot: string,
): AtomField | null {
  // Collect source content from files
  let cssSource = '';
  let reactSource = '';
  const allSources: string[] = [];

  for (const file of item.files) {
    const absPath = resolve(dsRoot, file.sourcePath);
    if (!existsSync(absPath)) continue;

    const content = readFileSync(absPath, 'utf-8');
    allSources.push(content);

    if (file.sourcePath.endsWith('.css')) {
      cssSource += content + '\n';
    } else if (file.sourcePath.endsWith('.tsx') || file.sourcePath.endsWith('.ts')) {
      reactSource += content + '\n';
    }
  }

  // For foundations/hooks with no extractable metadata, return minimal atom
  if (item.kind !== 'component') {
    const category = inferCategory(item);
    const hasAnim = detectHasAnimation(allSources, item.name, dsRoot);
    return {
      discovery: {
        name: item.title,
        description: item.description,
        category,
        variants: [],
        sizes: [],
        defaultVariant: '',
        defaultSize: '',
        hasAnimation: hasAnim,
        props: [],
      },
      implementation: {
        baseClass: '',
        cssClasses: [],
        peerDeps: hasAnim ? detectPeerDeps(allSources, dsRoot, true) : [],
        hasCss: cssSource.length > 0,
        hasReact: reactSource.length > 0,
      },
    };
  }

  // Extract from component sources
  const variants = extractVariants(reactSource);
  const sizes = extractSizes(reactSource);
  const props = extractProps(reactSource);
  const defaults = extractDefaults(reactSource);
  const cssClasses = extractCssClasses(cssSource, item.name, item.cssClassPrefixes);
  const baseClass = deriveBaseClass(cssClasses, item.name);
  const hasAnimation = detectHasAnimation(allSources, item.name, dsRoot);
  const peerDeps = detectPeerDeps(allSources, dsRoot, hasAnimation);
  const category = inferCategory(item);

  // Resolve type aliases to their union values where possible
  const typeAliases = resolveTypeAliases(reactSource);

  // Apply defaults and resolve types
  for (const prop of props) {
    if (defaults[prop.name] && !prop.default) {
      prop.default = defaults[prop.name];
    }
    // Resolve type alias to union literal if available
    if (typeAliases.has(prop.type)) {
      prop.type = typeAliases.get(prop.type)!;
    }
  }

  const ariaRequired = reactSource.length > 0 ? extractAriaRequired(reactSource) : [];
  const childrenType = reactSource.length > 0 ? extractChildrenType(reactSource) : undefined;

  const discovery: AtomDiscovery = {
    name: item.title,
    description: item.description,
    category,
    variants,
    sizes,
    defaultVariant: defaults['variant'] ?? (variants[0] || ''),
    defaultSize: defaults['size'] ?? (sizes[0] || ''),
    hasAnimation,
    props,
    ...(ariaRequired.length > 0 && { ariaRequired }),
    ...(childrenType && { childrenType }),
  };

  const implementation: AtomImplementation = {
    baseClass,
    cssClasses,
    peerDeps,
    hasCss: cssSource.length > 0,
    hasReact: reactSource.length > 0,
  };

  return { discovery, implementation };
}

/**
 * Extract metadata for all items in the registry.
 * Returns a report with results, skipped items, and errors.
 */
export function extractAllMetadata(
  items: AtomRegistryItem[],
  dsRoot: string,
): ExtractionReport {
  const results = new Map<string, AtomField>();
  const skipped: string[] = [];
  const errors: Array<{ slug: string; error: string }> = [];

  for (const item of items) {
    try {
      const atom = extractMetadataForItem(item, dsRoot);
      if (atom) {
        results.set(item.name, atom);
      } else {
        skipped.push(item.name);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ slug: item.name, error: message });
    }
  }

  return { results, skipped, errors };
}
