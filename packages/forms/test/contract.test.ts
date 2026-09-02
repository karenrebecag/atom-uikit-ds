/**
 * El sobre de 03 valida lo que debe y rechaza lo que debe.
 *
 * Payload extra keys: 03+I4 — the envelope is z.record because N formKeys share it.
 * lead-basic is .strict(); extra business keys are rejected there, not on the transport
 * envelope. Covered in schema-isomorph.test.ts via createLeadBasicSchema.
 */
import { describe, expect, it } from 'vitest';
import { requestSchema, responseSchema } from '../src/schemas/contract';

const validRequest = {
  landingId: 'lp-test',
  formKey: 'lead-basic',
  locale: 'en' as const,
  payload: {
    name: 'Ada',
    email: 'ada@example.test',
    acceptance: true,
  },
  meta: {
    landingUrl: 'https://example.test/lp?utm_source=x',
    referrer: '',
    submittedAt: '2026-09-01T18:22:04.113Z',
  },
};

describe('requestSchema', () => {
  it('accepts a valid request', () => {
    const parsed = requestSchema.safeParse(validRequest);
    expect(parsed.success).toBe(true);
  });

  it('rejects an empty landingId', () => {
    expect(requestSchema.safeParse({ ...validRequest, landingId: '' }).success).toBe(false);
    expect(requestSchema.safeParse({ ...validRequest, landingId: '   ' }).success).toBe(false);
  });

  it('accepts trap with a value on the request root', () => {
    const parsed = requestSchema.safeParse({ ...validRequest, trap: 'TEST_BOT' });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.trap).toBe('TEST_BOT');
    }
  });

  it('accepts extra keys inside payload (envelope is a record, not the business schema)', () => {
    const parsed = requestSchema.safeParse({
      ...validRequest,
      payload: { ...validRequest.payload, extra: 'not-in-lead-basic' },
    });
    expect(parsed.success).toBe(true);
  });
});

describe('responseSchema', () => {
  it('rejects a response without ok', () => {
    expect(responseSchema.safeParse({ code: 'server_error', message: 'x' }).success).toBe(false);
    expect(responseSchema.safeParse({ success: true }).success).toBe(false);
  });

  it('accepts {ok:true} and {ok:true, ref}', () => {
    expect(responseSchema.safeParse({ ok: true }).success).toBe(true);
    const withRef = responseSchema.safeParse({ ok: true, ref: 'lead_01J' });
    expect(withRef.success).toBe(true);
    if (withRef.success && withRef.data.ok) {
      expect(withRef.data.ref).toBe('lead_01J');
    }
  });

  it('accepts validation_error with errors', () => {
    const parsed = responseSchema.safeParse({
      ok: false,
      code: 'validation_error',
      message: 'x',
      errors: { email: 'bad' },
    });
    expect(parsed.success).toBe(true);
  });

  it('accepts rate_limited without errors and rejects extra errors (strict)', () => {
    expect(
      responseSchema.safeParse({
        ok: false,
        code: 'rate_limited',
        message: 'slow',
      }).success,
    ).toBe(true);
    expect(
      responseSchema.safeParse({
        ok: false,
        code: 'rate_limited',
        message: 'slow',
        errors: { email: 'no' },
      }).success,
    ).toBe(false);
  });
});
