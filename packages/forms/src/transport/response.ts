/**
 * Parsea el sobre con el Zod de contract.ts. Si no valida →
 * server_error. Nunca confiar a ciegas en el JSON.
 */
import { responseSchema, type FormResponse } from '../schemas/contract';

// Why: i18n is not this layer's; a stable generic string, no status or stack.
const UNTRUSTED_RESPONSE_MESSAGE =
  'No pudimos enviar el formulario. Intenta de nuevo.';

export function parseResponse(input: unknown): FormResponse {
  const parsed = responseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: 'server_error',
      message: UNTRUSTED_RESPONSE_MESSAGE,
    };
  }
  return parsed.data;
}
