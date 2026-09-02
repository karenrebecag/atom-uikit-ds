/**
 * formKey → schema. El único lugar que sabe qué schemas existen.
 */
import type { Dict } from '../i18n';
import { createLeadBasicSchema, type LeadBasic } from './lead-basic';

export const FORM_KEYS = ['lead-basic'] as const;

export type FormKey = (typeof FORM_KEYS)[number];

export const SCHEMA_FACTORIES = {
  'lead-basic': createLeadBasicSchema,
} as const;

export function isFormKey(value: string): value is FormKey {
  for (const key of FORM_KEYS) {
    if (key === value) {
      return true;
    }
  }
  return false;
}

export function getSchema(
  formKey: FormKey,
  dict: Dict,
): ReturnType<(typeof SCHEMA_FACTORIES)[FormKey]> {
  return SCHEMA_FACTORIES[formKey](dict);
}

export function resolveSchema(
  formKey: string,
  dict: Dict,
): ReturnType<(typeof SCHEMA_FACTORIES)[FormKey]> | undefined {
  if (!isFormKey(formKey)) {
    return undefined;
  }
  return getSchema(formKey, dict);
}

export { createLeadBasicSchema };
export type { LeadBasic };
