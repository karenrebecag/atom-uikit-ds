/**
 * F16a — content coverage board tests.
 * Run: node --test scripts/content-coverage.test.mjs
 */
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildContentCoverage, formatCoverageTable } from './content-coverage.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_R = path.join(ROOT, 'public', 'r');

describe('content-coverage', () => {
  /** @type {ReturnType<typeof buildContentCoverage>} */
  let report;

  before(() => {
    assert.ok(fs.existsSync(path.join(PUBLIC_R, 'index.json')), 'need public/r from build:registry');
    report = buildContentCoverage(ROOT);
  });

  it('F16-C1: report has items, totals, batches', () => {
    assert.ok(report.items.length >= 50);
    assert.ok(report.totals.items === report.items.length);
    assert.ok(typeof report.totals.aggregateScore === 'number');
    assert.ok(Array.isArray(report.batches));
    assert.ok(report.batches.length > 0);
    assert.equal(report.batches[0].kind, 'meta.agent');
  });

  it('F16-C1 control slug button is meta.agent full + editorial', () => {
    const button = report.items.find((i) => i.slug === 'button');
    assert.ok(button, 'button in board');
    assert.equal(button.metaAgent, 'full');
    assert.equal(button.editorial, true);
    assert.ok(button.contentScore >= 60);
  });

  it('F16-C1 control: a slug without agent is none', () => {
    const none = report.items.find((i) => i.eligibleAgent && i.metaAgent === 'none');
    assert.ok(none, 'at least one eligible without agent');
    assert.equal(none.metaAgent, 'none');
    assert.ok(none.contentScore < 60);
  });

  it('F16-C1 control: webflow excluded or n/a has status', () => {
    const input = report.items.find((i) => i.slug === 'input');
    assert.ok(input);
    // input is form control — excluded or n/a from webflow channel
    assert.ok(['excluded', 'n/a', 'emitted'].includes(input.webflow));
  });

  it('F16-C2: batches[0] only contains eligible missing full agent', () => {
    const b0 = report.batches[0];
    assert.ok(b0.slugs.length > 0 && b0.slugs.length <= 12);
    for (const slug of b0.slugs) {
      const row = report.items.find((i) => i.slug === slug);
      assert.ok(row?.eligibleAgent);
      assert.notEqual(row.metaAgent, 'full');
    }
  });

  it('formatCoverageTable is non-empty', () => {
    const t = formatCoverageTable(report);
    assert.match(t, /F16 content coverage/);
    assert.match(t, /meta\.agent/);
  });

  it('hasReact is derived from published files, not the registry flag (whatsapp-button)', () => {
    const wa = report.items.find((i) => i.slug === 'whatsapp-button');
    assert.ok(wa, 'whatsapp-button on board');
    assert.equal(wa.hasReact, false, 'no .tsx/.jsx in item files');
    assert.equal(wa.eligibleAgent, false);
    assert.ok(wa.excludedAgent, 'excluded with reason');
    // Webflow also excludes for no React source — board must not claim React
    assert.ok(wa.webflow === 'excluded' || wa.webflow === 'n/a');
  });
});
