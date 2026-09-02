/**
 * Valores de los selects de `lead-basic`.
 *
 * GEMELO EXACTO de `atom-forms-api/lib/options.ts`. Si aquí se agrega una opción y
 * allá no, el endpoint rechaza el envío con `validation_error` y el usuario ve un
 * error que no puede resolver.
 *
 * Los VALORES son estables y en kebab-case; las ETIQUETAS viven en los diccionarios
 * de `../i18n`. Lo que viaja al endpoint y cae en la hoja es el valor, para que un
 * cambio de copy en pt o en en no parta la analítica histórica.
 */
import type { OptionsRef } from '../core/types';
import type { Dict } from '../i18n';

export const CARGOS = ['marketing', 'ventas', 'direccion', 'operaciones', 'ti', 'otro'] as const;

export const LEADS_MENSUALES = [
  'menos-100',
  '100-500',
  '500-2000',
  '2000-10000',
  'mas-10000',
] as const;

// Metas, no problemas: la gente elige aspiraciones más fácil de lo que admite fallas.
// Cruzado contra landing_id dice si el ángulo comprado es el dolor que el lead se
// reconoce.
export const OBJETIVOS = [
  'responder-rapido',
  'atender-mas',
  'filtrar-intencion',
  'recuperar-leads',
  'convertir-chats',
  'conectar-crm',
  'atribucion-campanas',
  'otro',
] as const;

// ISO 3166-1 alpha-2. LATAM primero por volumen de pauta; el resto cae en 'otro'.
export const PAISES = [
  'MX', 'CO', 'PE', 'CL', 'AR', 'EC', 'BO', 'UY', 'PY', 'VE',
  'CR', 'PA', 'GT', 'SV', 'HN', 'NI', 'DO', 'PR', 'BR', 'ES', 'US',
  'otro',
] as const;

export type Cargo = (typeof CARGOS)[number];
export type LeadsMensuales = (typeof LEADS_MENSUALES)[number];
export type Objetivo = (typeof OBJETIVOS)[number];
export type Pais = (typeof PAISES)[number];

/**
 * Resuelve un conjunto de opciones a pares valor/etiqueta en el idioma activo.
 * Es el puente entre `FieldDef.optionsRef` (estático) y el diccionario (por idioma).
 */
export function resolveOptions(
  ref: OptionsRef,
  dict: Dict,
): readonly { readonly value: string; readonly label: string }[] {
  const grupo = dict.options[ref];
  return Object.entries(grupo).map(([value, label]) => ({ value, label: label as string }));
}
