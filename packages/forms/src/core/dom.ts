/**
 * collectValues, setLoading, getField. Toda consulta al DOM pasa por aquí.
 */
import type { FieldDef } from './types';

const LANDING_ATTR = 'data-atom-form-landing';
const LANG_ATTR = 'data-atom-form-lang';
const KEY_ATTR = 'data-atom-form';
const INIT_ATTR = 'data-atom-form-init';
const FIELD_ATTR = 'data-atom-field';
const STATUS_ATTR = 'data-atom-form-status';

export type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function isControl(el: Element | null): el is FormControl {
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  );
}

function attrSelector(attr: string, value: string): string {
  return `[${attr}="${CSS.escape(value)}"]`;
}

export function getField(form: HTMLFormElement, def: Pick<FieldDef, 'name' | 'schemaKey'>): FormControl | null {
  const byKey = form.querySelector(attrSelector(FIELD_ATTR, def.schemaKey));
  if (isControl(byKey)) {
    return byKey;
  }
  const byName = form.querySelector(attrSelector('name', def.name));
  return isControl(byName) ? byName : null;
}

function fieldGroup(control: FormControl): HTMLElement | null {
  const group = control.closest('.field');
  return group instanceof HTMLElement ? group : null;
}

function errorSlot(group: HTMLElement): HTMLElement | null {
  const slot = group.querySelector('.field__error');
  return slot instanceof HTMLElement ? slot : null;
}

export function collectValues(
  form: HTMLFormElement,
  fields: readonly FieldDef[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const def of fields) {
    const el = getField(form, def);
    if (!el) {
      continue;
    }
    out[def.schemaKey] =
      def.kind === 'acceptance'
        ? el instanceof HTMLInputElement && el.checked
        : el.value;
  }
  return out;
}

export function collectTrap(form: HTMLFormElement): string | undefined {
  const el =
    form.querySelector(attrSelector(FIELD_ATTR, 'trap')) ??
    form.querySelector(attrSelector('name', 'trap'));
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
    return undefined;
  }
  const value = el.value;
  return value === '' ? undefined : value;
}

export function getSubmitButton(
  form: HTMLFormElement,
): HTMLButtonElement | HTMLInputElement | null {
  const el = form.querySelector('[type="submit"]');
  if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
    return el;
  }
  return null;
}

export function setLoading(form: HTMLFormElement, loading: boolean): void {
  const button = getSubmitButton(form);
  if (loading) {
    form.setAttribute('aria-busy', 'true');
    if (button) {
      button.setAttribute('aria-busy', 'true');
      if (button.classList.contains('button')) {
        button.classList.add('button--loading');
      }
    }
    return;
  }
  form.removeAttribute('aria-busy');
  if (button) {
    button.removeAttribute('aria-busy');
    button.classList.remove('button--loading');
  }
}

export function setFieldInvalid(form: HTMLFormElement, def: FieldDef, message: string): void {
  const control = getField(form, def);
  if (!control) {
    return;
  }
  control.setAttribute('aria-invalid', 'true');
  const group = fieldGroup(control);
  if (!group) {
    return;
  }
  group.setAttribute('data-invalid', '');
  const slot = errorSlot(group);
  if (slot) {
    slot.textContent = message;
  }
}

export function clearFieldInvalid(form: HTMLFormElement, def: FieldDef): void {
  const control = getField(form, def);
  if (!control) {
    return;
  }
  control.removeAttribute('aria-invalid');
  const group = fieldGroup(control);
  if (!group) {
    return;
  }
  group.removeAttribute('data-invalid');
  const slot = errorSlot(group);
  if (slot) {
    slot.textContent = '';
  }
}

export function clearAllFieldInvalid(form: HTMLFormElement, fields: readonly FieldDef[]): void {
  for (const def of fields) {
    clearFieldInvalid(form, def);
  }
}

function getOrCreateStatus(form: HTMLFormElement): HTMLElement {
  const existing = form.querySelector(`[${STATUS_ATTR}]`);
  if (existing instanceof HTMLElement) {
    return existing;
  }
  const slot = document.createElement('div');
  slot.setAttribute(STATUS_ATTR, '');
  slot.setAttribute('role', 'alert');
  slot.tabIndex = -1;
  form.prepend(slot);
  return slot;
}

export function setFormStatus(form: HTMLFormElement, message: string): void {
  const slot = getOrCreateStatus(form);
  slot.tabIndex = -1;
  if (!slot.hasAttribute('role')) {
    slot.setAttribute('role', 'alert');
  }
  slot.textContent = message;
}

export function clearFormStatus(form: HTMLFormElement): void {
  const slot = form.querySelector(`[${STATUS_ATTR}]`);
  if (slot instanceof HTMLElement) {
    slot.textContent = '';
  }
}

export function focusField(form: HTMLFormElement, def: FieldDef): boolean {
  const control = getField(form, def);
  if (!control) {
    return false;
  }
  control.focus();
  return true;
}

export function focusStatus(form: HTMLFormElement): void {
  const slot = form.querySelector(`[${STATUS_ATTR}]`);
  if (slot instanceof HTMLElement) {
    slot.focus();
  }
}

export function applySelectValues(
  form: HTMLFormElement,
  fields: readonly FieldDef[],
  values: Readonly<Record<string, string>>,
): void {
  for (const def of fields) {
    if (def.kind !== 'select') {
      continue;
    }
    const value = values[def.schemaKey];
    if (value === undefined || value === '') {
      continue;
    }
    const el = getField(form, def);
    if (!(el instanceof HTMLSelectElement) || el.value !== '') {
      continue;
    }
    el.value = value;
  }
}

export function readAttr(el: HTMLElement, name: string): string {
  return (el.getAttribute(name) ?? '').trim();
}

export function readFormKey(host: HTMLElement): string {
  return readAttr(host, KEY_ATTR);
}

export function readLandingId(host: HTMLElement, form: HTMLFormElement): string {
  const fromHost = readAttr(host, LANDING_ATTR);
  if (fromHost !== '') {
    return fromHost;
  }
  if (host === form) {
    return '';
  }
  return readAttr(form, LANDING_ATTR);
}

export function readLangRaw(host: HTMLElement, form: HTMLFormElement): string | undefined {
  const fromHost = readAttr(host, LANG_ATTR);
  if (fromHost !== '') {
    return fromHost;
  }
  if (host === form) {
    return undefined;
  }
  const fromForm = readAttr(form, LANG_ATTR);
  return fromForm === '' ? undefined : fromForm;
}

export function resolveFormElement(host: HTMLElement): HTMLFormElement | null {
  if (host instanceof HTMLFormElement) {
    return host;
  }
  const inner = host.querySelector('form');
  return inner instanceof HTMLFormElement ? inner : null;
}

export function queryFormHosts(root: ParentNode): HTMLElement[] {
  const found: HTMLElement[] = [];
  if (root instanceof HTMLElement && root.hasAttribute(KEY_ATTR)) {
    found.push(root);
  }
  const nodes = root.querySelectorAll(`[${KEY_ATTR}]`);
  for (const node of nodes) {
    if (node instanceof HTMLElement) {
      found.push(node);
    }
  }
  // Why: host + form inner both with the attr would bind the same <form> twice.
  return found.filter((el) => {
    for (const other of found) {
      if (other !== el && other.contains(el)) {
        return false;
      }
    }
    return true;
  });
}

export function isInitialized(host: HTMLElement): boolean {
  return host.hasAttribute(INIT_ATTR);
}

export function markInitialized(host: HTMLElement): void {
  host.setAttribute(INIT_ATTR, '');
}
