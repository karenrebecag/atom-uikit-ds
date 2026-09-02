/**
 * Preselección de país y prefijo. Cookie de primera parte primero;
 * geo-IP externo SOLO con consentimiento explícito. Nombres de
 * cookie = configuración, no constantes de un sitio ajeno.
 */

const DEFAULT_PROVIDER_TIMEOUT_MS = 2500;

export type GeoResult = {
  country?: string;
  diallingCode?: string;
};

export type GeoProvider = {
  url: string;
  pick: (data: unknown) => GeoResult | null;
};

export type GeoConfig = {
  geoCookie?: string;
  // Why: injector closes over this name inside consentGranted; presence is not consent.
  consentCookie?: string;
  consentGranted?: (cookies: string) => boolean;
  parseGeoCookie?: (raw: string) => GeoResult | null;
  providers?: ReadonlyArray<GeoProvider>;
  timeoutMs?: number;
};

export async function resolveGeo(config: GeoConfig): Promise<GeoResult | null> {
  const fromCookie = readFirstPartyGeo(config);
  if (fromCookie !== null) {
    return fromCookie;
  }
  if (!isConsentGranted(config)) {
    return null;
  }
  return fetchGeoFromProviders(config);
}

function readFirstPartyGeo(config: GeoConfig): GeoResult | null {
  const cookieName = config.geoCookie;
  if (cookieName === undefined || cookieName.length === 0) {
    return null;
  }
  const cookies = cookieSource();
  if (cookies === null) {
    return null;
  }
  const raw = readCookie(cookieName, cookies);
  if (raw === undefined) {
    return null;
  }
  const parser = config.parseGeoCookie ?? parseGeoCookieJson;
  try {
    return normalizeGeo(parser(raw));
  } catch {
    return null;
  }
}

function isConsentGranted(config: GeoConfig): boolean {
  const cookies = cookieSource();
  if (cookies === null || config.consentGranted === undefined) {
    return false;
  }
  try {
    return config.consentGranted(cookies) === true;
  } catch {
    return false;
  }
}

async function fetchGeoFromProviders(config: GeoConfig): Promise<GeoResult | null> {
  const providers = config.providers;
  if (providers === undefined || providers.length === 0) {
    return null;
  }
  const timeoutMs = config.timeoutMs ?? DEFAULT_PROVIDER_TIMEOUT_MS;
  for (const provider of providers) {
    const result = await fetchFromProvider(provider, timeoutMs);
    if (result !== null) {
      return result;
    }
  }
  return null;
}

async function fetchFromProvider(
  provider: GeoProvider,
  timeoutMs: number,
): Promise<GeoResult | null> {
  if (!isHttpsUrl(provider.url)) {
    return null;
  }
  const controller = new AbortController();
  const timer = setTimeout((): void => {
    controller.abort();
  }, timeoutMs);
  try {
    const response = await fetch(provider.url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      // Why: IP is personal data; do not attach first-party cookies to a third party.
      credentials: 'omit',
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }
    const data: unknown = await response.json();
    return pickGeo(provider, data);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function pickGeo(provider: GeoProvider, data: unknown): GeoResult | null {
  try {
    return normalizeGeo(provider.pick(data));
  } catch {
    return null;
  }
}

function parseGeoCookieJson(raw: string): GeoResult | null {
  try {
    const data: unknown = JSON.parse(decodeCookieValue(raw));
    if (!isRecord(data)) {
      return null;
    }
    const country = readString(data, 'country');
    const diallingCode = readString(data, 'diallingCode');
    if (country === undefined && diallingCode === undefined) {
      return null;
    }
    return { country, diallingCode };
  } catch {
    return null;
  }
}

function normalizeGeo(result: GeoResult | null | undefined): GeoResult | null {
  if (result === null || result === undefined) {
    return null;
  }
  const country = trimToUndefined(result.country);
  const diallingRaw = trimToUndefined(result.diallingCode);
  const diallingCode =
    diallingRaw === undefined ? undefined : stripLeadingPlus(diallingRaw);
  const dialling =
    diallingCode === undefined || diallingCode.length === 0
      ? undefined
      : diallingCode;
  if (country === undefined && dialling === undefined) {
    return null;
  }
  return { country, diallingCode: dialling };
}

function cookieSource(): string | null {
  try {
    if (typeof document === 'undefined') {
      return null;
    }
    return document.cookie;
  } catch {
    return null;
  }
}

function readCookie(name: string, source: string): string | undefined {
  const prefix = `${name}=`;
  const parts = source.split(';');
  for (const part of parts) {
    const entry = part.trim();
    if (entry.startsWith(prefix)) {
      return entry.slice(prefix.length);
    }
  }
  return undefined;
}

function decodeCookieValue(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function readString(
  data: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = data[key];
  if (typeof value !== 'string') {
    return undefined;
  }
  return trimToUndefined(value);
}

function trimToUndefined(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function stripLeadingPlus(value: string): string {
  return value.startsWith('+') ? value.slice(1) : value;
}
