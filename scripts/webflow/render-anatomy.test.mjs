import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAnatomyFromPublished } from './render-anatomy.mjs';
import { generateXscp, structuralEqual } from './generate-xscp.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, '../../public/r');

describe('F8a render-anatomy', () => {
  it('badge renders and is non-empty', async () => {
    const r = await renderAnatomyFromPublished(pub, 'badge');
    assert.ok('html' in r && r.html.includes('badge'));
  });

  it('chip (no manual pilot) renders — F8-C2 candidate', async () => {
    const r = await renderAnatomyFromPublished(pub, 'chip');
    assert.ok('html' in r, JSON.stringify(r));
    assert.ok(r.html.includes('chip'));
    assert.ok(existsSync(join(pub, 'webflow/chip.json')), 'chip must be in webflow channel');
  });

  it('marquee with previewProps includes draggable hooks', async () => {
    const r = await renderAnatomyFromPublished(pub, 'marquee');
    assert.ok('html' in r);
    assert.match(r.html, /data-draggable-marquee/);
  });
});
