// Rutas a los artefactos REALES del DS que este módulo consume. Al vivir dentro del repo del DS
// (tools/layout-converter), se resuelven por ruta relativa — sin checkout aparte ni MCP, siempre
// la versión viva del repo. WHY: el emisor debe validar contra el contrato y los tokens vigentes.
import { resolve } from 'node:path';

// src/atom/ds-paths.ts -> cuatro niveles arriba = raíz del repo del DS.
export const DS_ROOT = resolve(import.meta.dir, '../../../..');

export const DS_PATHS = {
  layoutContract: resolve(DS_ROOT, 'conformance/layout-contract.json'),
  tokensCss: resolve(DS_ROOT, 'public-dist/out/v1/tokens.css'),
  foundationCss: resolve(DS_ROOT, 'public-dist/out/v1/foundation.css'),
  atomCss: resolve(DS_ROOT, 'public-dist/out/v1/atom.css'),
  layoutsSrc: resolve(DS_ROOT, 'packages/layouts/src'),
  registry: resolve(DS_ROOT, 'registry.json'),
} as const;
