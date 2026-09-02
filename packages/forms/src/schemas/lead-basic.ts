/**
 * Schema de negocio de `lead-basic`: diez campos.
 *
 * GEMELO de `atom-forms-api/lib/schema.ts`. La validación de aquí es UX; la de allá es
 * la de verdad. Si divergen, el usuario pasa el formulario en el navegador y el
 * endpoint se lo rechaza sin que pueda hacer nada al respecto.
 *
 * Factory del diccionario para que los mensajes viajen traducidos.
 */
import { z } from 'zod';
import { CARGOS, LEADS_MENSUALES, OBJETIVOS, PAISES } from '../data/options';
import type { Dict } from '../i18n';

const PHONE_PATTERN = /^[0-9()#&+*\-=.\s]{8,}$/;
// Acepta con o sin esquema; el servidor normaliza antes de guardar.
const WEB_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

export type LeadBasic = {
  nombre: string;
  email: string;
  whatsapp: string;
  empresa: string;
  cargo: (typeof CARGOS)[number];
  pais: (typeof PAISES)[number];
  leads_mensuales: (typeof LEADS_MENSUALES)[number];
  objetivo: (typeof OBJETIVOS)[number];
  sitio_web?: string;
  aceptacion: boolean;
};

export function createLeadBasicSchema(dict: Dict): z.ZodType<LeadBasic> {
  const v = dict.validation;
  return z
    .object({
      // La etiqueta pide nombre y apellido; validar dos palabras rompe con nombres
      // compuestos y con quien tiene un solo apellido. Se pide en el copy, no aquí.
      nombre: z.string().trim().min(2, v.nombre),
      email: z.string().trim().toLowerCase().email(v.email),
      whatsapp: z.string().trim().regex(PHONE_PATTERN, v.whatsapp),
      empresa: z.string().trim().min(2, v.empresa),
      cargo: z.enum(CARGOS, { errorMap: () => ({ message: v.cargo }) }),
      pais: z.enum(PAISES, { errorMap: () => ({ message: v.pais }) }),
      leads_mensuales: z.enum(LEADS_MENSUALES, { errorMap: () => ({ message: v.leads_mensuales }) }),
      objetivo: z.enum(OBJETIVOS, { errorMap: () => ({ message: v.objetivo }) }),
      sitio_web: z.string().trim().regex(WEB_PATTERN, v.sitio_web).optional().or(z.literal('')),
      // Why: z.literal(true) no propaga message en Zod 3 para invalid_literal.
      aceptacion: z.boolean().refine((value: boolean): boolean => value === true, {
        message: v.aceptacion,
      }),
    })
    .strict();
}
