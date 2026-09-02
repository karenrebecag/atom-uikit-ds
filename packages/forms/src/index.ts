/**
 * API pública y única. Exporta initAll, registerForm, tipos. Monta el global AtomForms.
 */
import { collectAttribution } from './context/attribution';
import { resolveGeo, type GeoResult } from './context/geo';
import { bindForm } from './core/engine';
import { getForm, registerForm } from './core/registry';
import {
  applySelectValues,
  isInitialized,
  markInitialized,
  queryFormHosts,
  readFormKey,
  readLandingId,
  readLangRaw,
  resolveFormElement,
} from './core/dom';
import type { FieldDef, FormConfig, FormInstance } from './core/types';
import { getDict, resolveLang } from './i18n';
import { ga4Lead, gtmLead, metaLead } from './integrations';
import { createLeadBasicSchema } from './schemas';
import { submitForm } from './transport/submit';

export { getForm, registerForm } from './core/registry';
export { ga4Lead, gtmLead, metaLead } from './integrations';

export type {
  FieldDef,
  FieldErrors,
  FormConfig,
  FormInstance,
  FormSchema,
  IntegrationContext,
  IntegrationHook,
  RegisterResult,
  SelectOption,
  Submitter,
  SuccessContext,
  SuccessHandler,
} from './core/types';

export type { FormRequest, FormResponse, FormSuccessResponse, RequestMeta } from './schemas/contract';

export interface AtomFormsApi {
  initAll: typeof initAll;
  registerForm: typeof registerForm;
  getForm: typeof getForm;
}

declare global {
  interface Window {
    AtomForms?: AtomFormsApi;
  }
}

// colSpan reparte el ancho: los pares comparten fila en desktop, todo apila en mobile.
const LEAD_BASIC_FIELDS: readonly FieldDef[] = [
  { kind: 'text', schemaKey: 'nombre', name: 'nombre', required: true, colSpan: 100 },
  { kind: 'email', schemaKey: 'email', name: 'email', required: true, colSpan: 50 },
  { kind: 'tel', schemaKey: 'whatsapp', name: 'whatsapp', required: true, colSpan: 50 },
  { kind: 'text', schemaKey: 'empresa', name: 'empresa', required: true, colSpan: 50 },
  { kind: 'select', schemaKey: 'cargo', name: 'cargo', required: true, optionsRef: 'cargo', colSpan: 50 },
  // searchable: 22 países no caben en un select cómodo de tocar en móvil.
  { kind: 'select', schemaKey: 'pais', name: 'pais', required: true, optionsRef: 'pais', searchable: true, colSpan: 50 },
  { kind: 'select', schemaKey: 'leads_mensuales', name: 'leads_mensuales', required: true, optionsRef: 'leads_mensuales', colSpan: 50 },
  { kind: 'select', schemaKey: 'objetivo', name: 'objetivo', required: true, optionsRef: 'objetivo', colSpan: 100 },
  { kind: 'text', schemaKey: 'sitio_web', name: 'sitio_web', colSpan: 100 },
  { kind: 'acceptance', schemaKey: 'aceptacion', name: 'aceptacion', required: true, colSpan: 100 },
];

export function initAll(root?: ParentNode): void {
  ensureBuiltinForms();
  exposeGlobal();
  const scope = root ?? document;
  for (const host of queryFormHosts(scope)) {
    if (isInitialized(host)) {
      continue;
    }
    if (mountHost(host)) {
      markInitialized(host);
    }
  }
}

function exposeGlobal(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.AtomForms = { initAll, registerForm, getForm };
}

function ensureBuiltinForms(): void {
  if (getForm('lead-basic') !== undefined) {
    return;
  }
  registerForm({
    key: 'lead-basic',
    fields: LEAD_BASIC_FIELDS,
    createSchema: createLeadBasicSchema,
    integrations: [ga4Lead, gtmLead, metaLead],
  });
}

function mountHost(host: HTMLElement): boolean {
  const formKey = readFormKey(host);
  if (formKey === '') {
    return false;
  }
  const config = getForm(formKey);
  if (config === undefined) {
    return false;
  }
  const form = resolveFormElement(host);
  if (form === null) {
    return false;
  }
  bindForm(form, buildInstance(host, form, config));
  void applyGeo(form, config);
  return true;
}

function buildInstance(
  host: HTMLElement,
  form: HTMLFormElement,
  config: FormConfig,
): FormInstance {
  const locale = resolveLang(readLangRaw(host, form)).lang;
  const dict = getDict(locale);
  return {
    config,
    schema: config.createSchema(dict),
    dict,
    mount: host,
    submitter: submitForm,
    landingId: readLandingId(host, form),
    locale,
    collectMeta: collectAttribution,
  };
}

async function applyGeo(form: HTMLFormElement, config: FormConfig): Promise<void> {
  // Why: 08-brechas — cookies y consentimiento no están decididos; {} no fetchea.
  const result = await resolveGeo({});
  if (result === null) {
    return;
  }
  applySelectValues(form, config.fields, geoSelectValues(result));
}

function geoSelectValues(result: GeoResult): Record<string, string> {
  const out: Record<string, string> = {};
  if (result.country !== undefined) {
    out.pais = result.country;
  }
  return out;
}

if (typeof window !== 'undefined') {
  exposeGlobal();
}
