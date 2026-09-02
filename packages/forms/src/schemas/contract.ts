/**
 * El sobre de 03-contrato-endpoint: petición y respuesta como Zod + tipos.
 * Esta es la frontera con el validador. Cambiarla es cambiar el programa.
 */
import { z } from 'zod';
import { LANGS } from '../i18n';

export const requestMetaSchema = z
  .object({
    landingUrl: z.string().min(1),
    referrer: z.string(),
    submittedAt: z.string().datetime(),
  })
  .strict();

export const requestSchema = z
  .object({
    landingId: z.string().trim().min(1),
    formKey: z.string().trim().min(1),
    locale: z.enum(LANGS),
    // Why: N formKeys comparten el sobre; las claves de negocio viven en cada schema.
    payload: z.record(z.string(), z.unknown()),
    meta: requestMetaSchema,
    // Why: 03 pone el honeypot en la raíz y el validador rechaza si trae valor;
    // el sobre debe aceptarlo para que el validador lo vea, no strippearlo.
    trap: z.string().optional(),
  })
  .strict();

export const successResponseSchema = z
  .object({
    ok: z.literal(true),
    ref: z.string().min(1).optional(),
  })
  .strict();

export const validationErrorResponseSchema = z
  .object({
    ok: z.literal(false),
    code: z.literal('validation_error'),
    message: z.string().min(1),
    errors: z.record(z.string(), z.string()),
  })
  .strict();

export const transportErrorResponseSchema = z
  .object({
    ok: z.literal(false),
    code: z.enum(['rate_limited', 'unknown_landing', 'server_error']),
    message: z.string().min(1),
  })
  .strict();

export const responseSchema = z.union([
  successResponseSchema,
  validationErrorResponseSchema,
  transportErrorResponseSchema,
]);

export type RequestMeta = z.infer<typeof requestMetaSchema>;
export type FormRequest = z.infer<typeof requestSchema>;
export type FormSuccessResponse = z.infer<typeof successResponseSchema>;
export type ValidationErrorResponse = z.infer<typeof validationErrorResponseSchema>;
export type TransportErrorResponse = z.infer<typeof transportErrorResponseSchema>;
export type FormErrorResponse = ValidationErrorResponse | TransportErrorResponse;
export type FormResponse = z.infer<typeof responseSchema>;
export type FormErrorCode = FormErrorResponse['code'];
