/**
 * POST JSON con timeout y reintento por fallo de RED. No reintenta
 * cuando el servidor sí respondió, aunque ok:false.
 */
import type { FormRequest, FormResponse } from '../schemas/contract';
import { FORMS_ENDPOINT } from './endpoint';
import { parseResponse } from './response';

const TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;

type AttemptResult =
  | { readonly kind: 'response'; readonly value: FormResponse }
  | { readonly kind: 'network' };

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function readBody(response: Response): Promise<FormResponse> {
  try {
    const payload: unknown = await response.json();
    return parseResponse(payload);
  } catch {
    return parseResponse(undefined);
  }
}

async function attemptSubmit(body: string): Promise<AttemptResult> {
  const controller = new AbortController();
  const timer = setTimeout((): void => {
    controller.abort();
  }, TIMEOUT_MS);

  try {
    const response = await fetch(FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: controller.signal,
    });
    return { kind: 'response', value: await readBody(response) };
  } catch {
    return { kind: 'network' };
  } finally {
    clearTimeout(timer);
  }
}

export async function submitForm(request: FormRequest): Promise<FormResponse> {
  const body = JSON.stringify(request);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const result = await attemptSubmit(body);
    // Why: a Response is a business outcome (4xx/5xx/ok:false/rotten JSON); do not retry it.
    if (result.kind === 'response') {
      return result.value;
    }
    if (attempt < MAX_RETRIES) {
      await delay(400 * (attempt + 1));
    }
  }

  return parseResponse(undefined);
}
