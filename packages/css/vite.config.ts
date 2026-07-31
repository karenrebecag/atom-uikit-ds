import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import {
  renameSync,
  readdirSync,
  existsSync,
  unlinkSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { scopeEmbedCss, findUnscopedSelectors } from './scripts/scope-embed.mjs';
import { prefixWebflowCss, findUnprefixedClasses } from './scripts/prefix-webflow.mjs';

/**
 * Four public artifacts from one package:
 *   dist/tokens.css     — CSS variables only (:root + [data-theme])
 *   dist/foundation.css — tokens + fonts + foundation + utilities
 *   dist/atom.css       — foundation + layout + components
 *   dist/embed.css      — foundation, every selector scoped under .atom-embed
 *
 * Vite emits a JS stub per CSS entry; we drop those stubs after build and
 * rename hashed CSS assets to stable names.
 */
export default defineConfig({
  // Relative font URLs so dist works under /v1/ on the public CDN
  base: './',
  build: {
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        tokens: resolve(__dirname, 'src/entries/tokens.css'),
        foundation: resolve(__dirname, 'src/entries/foundation.css'),
        atom: resolve(__dirname, 'src/entries/atom.css'),
        embed: resolve(__dirname, 'src/entries/embed.css'),
        webflow: resolve(__dirname, 'src/entries/webflow.css'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? '';
          // Fonts keep hashed names under assets/ for cache-busting
          if (/\.(woff2?|ttf|otf)$/i.test(name)) {
            return 'fonts/[name]-[hash][extname]';
          }
          // CSS: temporary name; post-build renames to tokens|foundation|atom.css
          if (name.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      drafts: {
        customMedia: true,
      },
    },
  },
  plugins: [
    {
      name: 'atom-css-artifacts',
      closeBundle() {
        const dist = resolve(__dirname, 'dist');
        const assetsDir = resolve(dist, 'assets');
        if (!existsSync(assetsDir)) return;

        const files = readdirSync(assetsDir);
        const cssFiles = files.filter((f) => f.endsWith('.css'));

        // Map entry-ish names: vite names CSS after the entry chunk (tokens, foundation, atom)
        for (const key of ['tokens', 'foundation', 'atom', 'embed', 'webflow'] as const) {
          const match = cssFiles.find(
            (f) => f === `${key}.css` || f.startsWith(`${key}-`) || f.includes(`${key}-`)
          );
          // Prefer exact entry-named assets
          const candidates = cssFiles.filter((f) => f.startsWith(`${key}-`) || f === `${key}.css`);
          // Pick largest for foundation/atom (full bundle); for tokens the only tokens-*.css
          let pick = candidates[0];
          if (candidates.length > 1) {
            // Prefer the one whose basename starts with key-
            pick =
              candidates.find((f) => f.startsWith(`${key}-`)) ??
              candidates.sort((a, b) => b.length - a.length)[0];
          }
          if (!pick && match) pick = match;
          if (!pick) {
            console.warn(`[atom-css-artifacts] no CSS asset found for "${key}"`);
            continue;
          }
          const dest = resolve(dist, `${key}.css`);
          renameSync(resolve(assetsDir, pick), dest);
          // CSS was emitted under assets/ so font urls are ../fonts/; root needs ./fonts/
          const css = readFileSync(dest, 'utf8').replaceAll(
            'url(../fonts/',
            'url(./fonts/'
          );
          writeFileSync(dest, css);
        }

        // Remove empty JS entry stubs (CSS-only builds)
        for (const f of readdirSync(assetsDir)) {
          if (f.endsWith('.js') || f.endsWith('.js.map')) {
            unlinkSync(resolve(assetsDir, f));
          }
        }

        // Clean leftover CSS still in assets/
        for (const f of readdirSync(assetsDir)) {
          if (f.endsWith('.css')) unlinkSync(resolve(assetsDir, f));
        }
      },
    },
    {
      // Runs after atom-css-artifacts (plugin order = closeBundle order), so
      // dist/embed.css already exists with stable name and rewritten font urls.
      name: 'atom-embed-scope',
      closeBundle() {
        const target = resolve(__dirname, 'dist/embed.css');
        if (!existsSync(target)) {
          console.warn('[atom-embed-scope] dist/embed.css not found — skipped');
          return;
        }
        const scoped = scopeEmbedCss(readFileSync(target, 'utf8'));
        writeFileSync(target, scoped);

        const offenders = findUnscopedSelectors(scoped);
        if (offenders.length > 0) {
          // Fail the build: an unscoped selector here restyles the host page,
          // and no existing gate would catch it.
          throw new Error(
            `[atom-embed-scope] ${offenders.length} unscoped selector(s): ${offenders
              .slice(0, 10)
              .join(', ')}`
          );
        }
        console.log('[atom-embed-scope] dist/embed.css scoped under .atom-embed');
      },
    },
    {
      // Corre despues de atom-css-artifacts, igual que el scope del embed.
      name: 'atom-webflow-prefix',
      closeBundle() {
        const target = resolve(__dirname, 'dist/webflow.css');
        if (!existsSync(target)) {
          console.warn('[atom-webflow-prefix] dist/webflow.css not found — skipped');
          return;
        }
        const prefixed = prefixWebflowCss(readFileSync(target, 'utf8'));
        writeFileSync(target, prefixed);

        const offenders = findUnprefixedClasses(prefixed);
        if (offenders.length > 0) {
          // Falla el build: una clase sin prefijo aqui pisa estilos del sitio
          // anfitrion, que es exactamente lo que este namespace evita.
          throw new Error(
            `[atom-webflow-prefix] ${offenders.length} unprefixed class(es): ${offenders
              .slice(0, 10)
              .join(', ')}`
          );
        }
        console.log('[atom-webflow-prefix] dist/webflow.css namespaced under ds-');
      },
    },
  ],
});
