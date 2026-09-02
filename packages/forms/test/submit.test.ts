/**
 * Timeout, reintento solo por red, y cero reintentos con ok:false.
 *
 * 06 says timeout "aborta y propaga". Implemented as return {ok:false, code:'server_error'}
 * after retries (08-brechas). This file asserts the implemented behavior, not a throw.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FormRequest } from '../src/schemas/contract';
import { FORMS_ENDPOINT } from '../src/transport/endpoint';
import { submitForm } from '../src/transport/submit';

const request: FormRequest = {
  landingId: 'lp-test',
  formKey: 'lead-basic',
  locale: 'en',
  payload: {
    name: 'Ada',
    email: 'ada@example.test',
    phone: '1234567',
    acceptance: true,
  },
  meta: {
    landingUrl: 'https://example.test/lp?utm_source=x',
    referrer: '',
    submittedAt: '2026-09-01T18:22:04.113Z',
  },
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('submitForm', () => {
  it('retries only when fetch throws: 3 attempts, delays 400 then 800', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockRejectedValue(new Error('TEST_NET'));
    vi.stubGlobal('fetch', fetchMock);

    const pending = submitForm(request);
    await Promise.resolve();
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(399);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    await Promise.resolve();
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(799);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    await Promise.resolve();
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const result = await pending;
    expect(result).toMatchObject({ ok: false, code: 'server_error' });
  });

  it('HTTP 200 ok:false validation_error is a single fetch (no retry)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        ok: false,
        code: 'validation_error',
        message: 'x',
        errors: { email: 'bad' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await submitForm(request);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ok: false,
      code: 'validation_error',
      message: 'x',
      errors: { email: 'bad' },
    });
  });

  it('HTTP 500: one call, parses contract or becomes server_error', async () => {
    const parsed = vi.fn().mockResolvedValue(
      jsonResponse({ ok: false, code: 'server_error', message: 'down' }, 500),
    );
    vi.stubGlobal('fetch', parsed);
    const parsedResult = await submitForm(request);
    expect(parsed).toHaveBeenCalledTimes(1);
    expect(parsedResult).toEqual({ ok: false, code: 'server_error', message: 'down' });

    const rotten = vi.fn().mockResolvedValue(new Response('nope', { status: 500 }));
    vi.stubGlobal('fetch', rotten);
    const rottenResult = await submitForm(request);
    expect(rotten).toHaveBeenCalledTimes(1);
    expect(rottenResult).toMatchObject({ ok: false, code: 'server_error' });
  });

  it('JSON that fails the contract is server_error with no extra retries', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ hello: 'world' }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await submitForm(request);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ ok: false, code: 'server_error' });
  });

  it('POSTs FormRequest JSON to FORMS_ENDPOINT with Content-Type application/json', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true, ref: 'lead_01J' }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await submitForm(request);
    expect(result).toEqual({ ok: true, ref: 'lead_01J' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(FORMS_ENDPOINT);
    expect(init.method).toBe('POST');
    const headers = init.headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(String(init.body))).toEqual(request);
  });

  it('timeout aborts via signal and returns server_error after 3 attempts (does not throw)', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn((_url: unknown, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        if (signal === undefined) {
          return;
        }
        const onAbort = (): void => {
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        };
        if (signal.aborted) {
          onAbort();
          return;
        }
        signal.addEventListener('abort', onAbort, { once: true });
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const pending = submitForm(request);
    await vi.advanceTimersByTimeAsync(15_000 + 400 + 15_000 + 800 + 15_000);
    const result = await pending;
    expect(result).toMatchObject({ ok: false, code: 'server_error' });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });
});
