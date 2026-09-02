/**
 * Orquesta: validación en vivo, submit, estados, errores, thank-you.
 * Recibe el submitter inyectado; no sabe a dónde va la data.
 */
import type { FormErrorResponse, FormRequest, FormResponse, FormSuccessResponse } from '../schemas/contract';
import { collectTrap, collectValues, getField, setLoading } from './dom';
import {
  applyErrors,
  applyFieldState,
  applyFormMessage,
  clearErrors,
  zodToFieldErrors,
  serverToFieldErrors,
} from './errors';
import type { FieldDef, FormInstance, IntegrationContext } from './types';

type FlightState = { inFlight: boolean };

export function bindForm(form: HTMLFormElement, instance: FormInstance): void {
  form.noValidate = true;
  const touched = new Set<string>();
  const state: FlightState = { inFlight: false };
  bindLiveValidation(form, instance, touched);
  bindSubmit(form, instance, touched, state);
}

function bindLiveValidation(
  form: HTMLFormElement,
  instance: FormInstance,
  touched: Set<string>,
): void {
  for (const def of instance.config.fields) {
    const el = getField(form, def);
    if (!el) {
      continue;
    }
    el.addEventListener('blur', () => {
      touched.add(def.schemaKey);
      validateOne(form, instance, def);
    });
    bindValueListener(el, def, form, instance, touched);
  }
}

function bindValueListener(
  el: HTMLElement,
  def: FieldDef,
  form: HTMLFormElement,
  instance: FormInstance,
  touched: Set<string>,
): void {
  if (def.kind === 'select' || def.kind === 'acceptance') {
    el.addEventListener('change', () => {
      touched.add(def.schemaKey);
      validateOne(form, instance, def);
    });
    return;
  }
  el.addEventListener('input', () => {
    if (touched.has(def.schemaKey)) {
      validateOne(form, instance, def);
    }
  });
}

function validateOne(form: HTMLFormElement, instance: FormInstance, def: FieldDef): void {
  const result = instance.schema.safeParse(collectValues(form, instance.config.fields));
  if (result.success) {
    applyFieldState(form, def, {});
    return;
  }
  applyFieldState(form, def, zodToFieldErrors(result.error));
}

function bindSubmit(
  form: HTMLFormElement,
  instance: FormInstance,
  touched: Set<string>,
  state: FlightState,
): void {
  form.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();
    void runSubmit(form, instance, touched, state);
  });
}

async function runSubmit(
  form: HTMLFormElement,
  instance: FormInstance,
  touched: Set<string>,
  state: FlightState,
): Promise<void> {
  if (state.inFlight) {
    return;
  }
  const fields = instance.config.fields;
  clearErrors(form, fields);
  const parsed = instance.schema.safeParse(collectValues(form, fields));
  if (!parsed.success) {
    for (const def of fields) {
      touched.add(def.schemaKey);
    }
    applyErrors(form, fields, zodToFieldErrors(parsed.error));
    return;
  }
  const payload = toPayload(parsed.data);
  if (instance.landingId === '') {
    applyFormMessage(form, instance.dict.errors.generic);
    return;
  }
  state.inFlight = true;
  setLoading(form, true);
  try {
    await dispatchSubmit(form, instance, payload);
  } finally {
    setLoading(form, false);
    state.inFlight = false;
  }
}

async function dispatchSubmit(
  form: HTMLFormElement,
  instance: FormInstance,
  payload: Record<string, unknown>,
): Promise<void> {
  let response: FormResponse;
  try {
    response = await instance.submitter(buildRequest(instance, form, payload));
  } catch {
    applyFormMessage(form, instance.dict.errors.connection);
    return;
  }
  await applyResponse(form, instance, payload, response);
}

function buildRequest(
  instance: FormInstance,
  form: HTMLFormElement,
  payload: Record<string, unknown>,
): FormRequest {
  const trap = collectTrap(form);
  const request: FormRequest = {
    landingId: instance.landingId,
    formKey: instance.config.key,
    locale: instance.locale,
    payload,
    meta: instance.collectMeta(),
  };
  if (trap === undefined) {
    return request;
  }
  return { ...request, trap };
}

async function applyResponse(
  form: HTMLFormElement,
  instance: FormInstance,
  payload: Record<string, unknown>,
  response: FormResponse,
): Promise<void> {
  if (response.ok) {
    await runIntegrations(instance, form, payload, response);
    const onSuccess = instance.onSuccess ?? instance.config.onSuccess;
    onSuccess?.({ mount: instance.mount, form, response, dict: instance.dict });
    return;
  }
  applyFailure(form, instance, response);
}

function applyFailure(
  form: HTMLFormElement,
  instance: FormInstance,
  response: FormErrorResponse,
): void {
  if (response.code === 'validation_error') {
    applyErrors(
      form,
      instance.config.fields,
      serverToFieldErrors(response.errors, instance.config.fields),
      response.message,
    );
    return;
  }
  const message = response.message !== '' ? response.message : instance.dict.errors.generic;
  applyFormMessage(form, message);
}

async function runIntegrations(
  instance: FormInstance,
  form: HTMLFormElement,
  payload: Record<string, unknown>,
  response: FormSuccessResponse,
): Promise<void> {
  const hooks = instance.config.integrations;
  if (hooks === undefined || hooks.length === 0) {
    return;
  }
  const ctx: IntegrationContext = { values: payload, response, form };
  await Promise.allSettled(hooks.map((hook) => Promise.resolve().then(() => hook(ctx))));
}

function toPayload(data: unknown): Record<string, unknown> {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {};
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    out[key] = value;
  }
  return out;
}
