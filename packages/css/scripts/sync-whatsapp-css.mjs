// Sincroniza whatsapp-button.css desde su fuente única de verdad: el endpoint estable del repo
// atom-whatsapp-buttons. Ese repo es el núcleo del widget (decidido el 2026-07-22, D1 de su
// spec/07); este paquete solo VENDORIZA la hoja para servirla por el MCP — nunca la edita.
//
// Uso:  node scripts/sync-whatsapp-css.mjs
// La URL sirve la hoja fuente (comentada) con cache de 5 min: tras un deploy del widget, el sync
// ve lo vigente en cuanto expira.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_URL = 'https://atom-whatsapp-buttons.vercel.app/v1/styles.css';
const TARGET = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src/components/buttons/whatsapp-button.css',
);

const BANNER = `/* ============================================================================
   ARCHIVO GENERADO — NO EDITAR A MANO.
   Fuente única de verdad: ${SOURCE_URL}
   (repo AtomGrowth/atom_whatsapp_buttons — su spec/ documenta cada decisión)
   Para actualizar:  pnpm --filter @atom-uikit/css sync:whatsapp
   ============================================================================ */

`;

const res = await fetch(SOURCE_URL, { headers: { 'Cache-Control': 'no-cache' } });
if (!res.ok) {
  console.error(`sync-whatsapp-css: ${SOURCE_URL} respondió ${res.status}`);
  process.exit(1);
}
const css = await res.text();

// Sanity mínimo: si el endpoint devolviera HTML de error o una hoja vacía, no pisar la local.
if (!css.includes('.atom-wa-btn') || css.length < 1000) {
  console.error('sync-whatsapp-css: la respuesta no parece la hoja del widget; no se escribe nada');
  process.exit(1);
}

writeFileSync(TARGET, BANNER + css);
console.log(`sync-whatsapp-css: ${css.length} bytes -> ${TARGET}`);
