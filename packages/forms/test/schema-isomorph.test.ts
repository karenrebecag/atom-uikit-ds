/**
 * El MISMO schema se importa desde ESM Node y desde la superficie del índice. Invariante I4.
 *
 * Dist public API does not export the schema (src/index.ts). Dual ESM import of the
 * factory + no-DOM source check is the I4 proof; this file does not change index.ts.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getDict } from '../src/i18n';
import { createLeadBasicSchema } from '../src/schemas/lead-basic';
import { getSchema, isFormKey, resolveSchema } from '../src/schemas/index';

const here = dirname(fileURLToPath(import.meta.url));

const happy = {
  nombre: 'Ada Lovelace',
  email: 'ada@example.test',
  whatsapp: '+52 5512345678',
  empresa: 'Analytical Engines',
  cargo: 'direccion' as const,
  pais: 'MX' as const,
  leads_mensuales: '100-500' as const,
  objetivo: 'responder-rapido' as const,
  sitio_web: 'analyticalengines.test',
  aceptacion: true as const,
};

function issueShape(result: { success: boolean; error?: { issues: readonly { path: readonly (string | number)[]; code: string; message: string }[] } }) {
  if (result.success) {
    return { success: true as const };
  }
  return {
    success: false as const,
    issues: (result.error?.issues ?? []).map((issue) => ({
      path: [...issue.path],
      code: issue.code,
      message: issue.message,
    })),
  };
}

describe('lead-basic isomorphism', () => {
  it('createLeadBasicSchema and getSchema agree for es/pt/en on the same inputs', () => {
    const samples: unknown[] = [
      happy,
      { ...happy, extra: 'nope' },
      { ...happy, aceptacion: false },
      { ...happy, nombre: 'A' },
      { ...happy, email: 'not-an-email' },
      { ...happy, whatsapp: '12' },
      { ...happy, cargo: 'inventado' },
      { ...happy, pais: 'ZZ' },
      { ...happy, leads_mensuales: 'muchos' },
      { ...happy, objetivo: 'inventado' },
      { ...happy, sitio_web: 'no es una url' },
    ];

    for (const lang of ['es', 'pt', 'en'] as const) {
      const dict = getDict(lang);
      const fromModule = createLeadBasicSchema(dict);
      const fromIndex = getSchema('lead-basic', dict);
      for (const sample of samples) {
        expect(issueShape(fromModule.safeParse(sample))).toEqual(issueShape(fromIndex.safeParse(sample)));
      }
    }
  });

  it('happy path passes; extra keys fail; acceptance false fails', () => {
    const schema = createLeadBasicSchema(getDict('en'));
    expect(schema.safeParse(happy).success).toBe(true);
    expect(schema.safeParse({ ...happy, extra: 'nope' }).success).toBe(false);
    expect(schema.safeParse({ ...happy, aceptacion: false }).success).toBe(false);
    // sitio_web es el unico opcional: sin el, y vacio, el schema pasa.
    const { sitio_web: _omitido, ...sinWeb } = happy;
    expect(schema.safeParse(sinWeb).success).toBe(true);
    expect(schema.safeParse({ ...happy, sitio_web: '' }).success).toBe(true);
  });

  it('index lookup resolves only lead-basic', () => {
    expect(isFormKey('lead-basic')).toBe(true);
    expect(isFormKey('test-lead')).toBe(false);
    expect(resolveSchema('lead-basic', getDict('es'))).toBeDefined();
    expect(resolveSchema('missing', getDict('es'))).toBeUndefined();
  });

  it('lead-basic.ts and contract.ts source contain no window, document, or querySelector', () => {
    const lead = readFileSync(join(here, '../src/schemas/lead-basic.ts'), 'utf8');
    const contract = readFileSync(join(here, '../src/schemas/contract.ts'), 'utf8');
    for (const src of [lead, contract]) {
      expect(src).not.toMatch(/\bwindow\b/);
      expect(src).not.toMatch(/\bdocument\b/);
      expect(src).not.toMatch(/\bquerySelector\b/);
    }
  });

  it('public package index does not re-export the schema (I4 via src dual-import only)', async () => {
    const pub = await import('../src/index');
    expect(pub).not.toHaveProperty('createLeadBasicSchema');
    expect(pub).not.toHaveProperty('getSchema');
  });
});
