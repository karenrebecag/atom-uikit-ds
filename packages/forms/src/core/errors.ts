/**
 * zod → errores por campo, sobre del servidor → campo, foco al primero.
 * No inventa mensajes: los toma del dict o del sobre. Delega el DOM a dom.ts.
 */
import type { ZodError } from 'zod';
import type { FieldDef, FieldErrors } from './types';
import {
  clearAllFieldInvalid,
  clearFieldInvalid,
  clearFormStatus,
  focusField,
  focusStatus,
  setFieldInvalid,
  setFormStatus,
} from './dom';

export function zodToFieldErrors(error: ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '');
    if (key !== '' && !(key in out)) {
      out[key] = issue.message;
    }
  }
  return out;
}

export function serverToFieldErrors(
  serverErrors: Readonly<Record<string, string>>,
  fields: readonly FieldDef[],
): FieldErrors {
  const allowed = new Set<string>();
  for (const def of fields) {
    allowed.add(def.schemaKey);
  }
  const out: FieldErrors = {};
  for (const [key, message] of Object.entries(serverErrors)) {
    if (allowed.has(key) && message !== '') {
      out[key] = message;
    }
  }
  return out;
}

export function clearErrors(form: HTMLFormElement, fields: readonly FieldDef[]): void {
  clearAllFieldInvalid(form, fields);
  clearFormStatus(form);
}

export function focusFirstError(
  form: HTMLFormElement,
  fields: readonly FieldDef[],
  errors: FieldErrors,
): boolean {
  for (const def of fields) {
    if (def.schemaKey in errors && focusField(form, def)) {
      return true;
    }
  }
  return false;
}

export function applyFieldState(
  form: HTMLFormElement,
  def: FieldDef,
  errors: FieldErrors,
): void {
  const message = errors[def.schemaKey];
  if (message !== undefined) {
    setFieldInvalid(form, def, message);
    return;
  }
  clearFieldInvalid(form, def);
}

export function applyFormMessage(form: HTMLFormElement, message: string): void {
  setFormStatus(form, message);
  focusStatus(form);
}

export function applyErrors(
  form: HTMLFormElement,
  fields: readonly FieldDef[],
  fieldErrors: FieldErrors,
  formMessage?: string,
): void {
  for (const def of fields) {
    applyFieldState(form, def, fieldErrors);
  }
  if (formMessage !== undefined && formMessage !== '') {
    setFormStatus(form, formMessage);
  } else {
    clearFormStatus(form);
  }
  if (focusFirstError(form, fields, fieldErrors)) {
    return;
  }
  if (formMessage !== undefined && formMessage !== '') {
    focusStatus(form);
  }
}
