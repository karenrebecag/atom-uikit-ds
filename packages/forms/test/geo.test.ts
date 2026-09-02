/**
 * Sin consentimiento no sale ninguna petición. El caso que más importa.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveGeo } from '../src/context/geo';

function clearCookies(): void {
  const source = document.cookie;
  if (source === '') {
    return;
  }
  for (const part of source.split(';')) {
    const name = part.split('=')[0]?.trim();
    if (name !== undefined && name !== '') {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
}

describe('resolveGeo', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    clearCookies();
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ country: 'ZZ' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  afterEach(() => {
    clearCookies();
    fetchSpy.mockRestore();
  });

  it('resolveGeo({}) does not fetch and returns null', async () => {
    const result = await resolveGeo({});
    expect(result).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('consentGranted false with providers does not fetch', async () => {
    const result = await resolveGeo({
      consentGranted: () => false,
      providers: [{ url: 'https://geo.test/lookup', pick: () => ({ country: 'PE' }) }],
    });
    expect(result).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('valid geo cookie wins: no fetch even with consent and providers', async () => {
    document.cookie = `test-geo=${encodeURIComponent(JSON.stringify({ country: 'PE', diallingCode: '51' }))}`;
    const result = await resolveGeo({
      geoCookie: 'test-geo',
      consentGranted: () => true,
      providers: [{ url: 'https://geo.test/lookup', pick: () => ({ country: 'ZZ' }) }],
    });
    expect(result).toEqual({ country: 'PE', diallingCode: '51' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('consentGranted true + providers + no cookie does fetch', async () => {
    const pick = vi.fn((data: unknown) => {
      if (typeof data === 'object' && data !== null && 'country' in data) {
        return { country: String((data as { country: unknown }).country) };
      }
      return { country: 'CL' };
    });
    const result = await resolveGeo({
      consentGranted: () => true,
      providers: [{ url: 'https://geo.test/lookup', pick }],
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://geo.test/lookup',
      expect.objectContaining({ method: 'GET', credentials: 'omit' }),
    );
    expect(result).toEqual({ country: 'ZZ' });
  });

  it('consentGranted throw fail-closes with zero fetch', async () => {
    const result = await resolveGeo({
      consentGranted: () => {
        throw new Error('TEST_CONSENT_THROW');
      },
      providers: [{ url: 'https://geo.test/lookup', pick: () => ({ country: 'PE' }) }],
    });
    expect(result).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
