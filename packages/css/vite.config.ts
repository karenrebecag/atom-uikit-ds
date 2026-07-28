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

/**
 * Three public artifacts from one package:
 *   dist/tokens.css     — CSS variables only (:root + [data-theme])
 *   dist/foundation.css — tokens + fonts + foundation + utilities
 *   dist/atom.css       — foundation + layout + components
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
        for (const key of ['tokens', 'foundation', 'atom'] as const) {
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
  ],
});
