/**
 * zod → campo, sobre del servidor → campo, y el foco al primer error.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  applySelectValues,
  isInitialized,
  markInitialized,
  queryFormHosts,
  readFormKey,
  readLandingId,
  readLangRaw,
  resolveFormElement,
  setFormStatus,
} from '../src/core/dom';
import {
  applyErrors,
  clearErrors,
  serverToFieldErrors,
  zodToFieldErrors,
} from '../src/core/errors';
import type { FieldDef } from '../src/core/types';
import {
  TEST_ACCEPTANCE_REQUIRED,
  TEST_EMAIL_INVALID,
  TEST_NAME_REQUIRED,
  control,
  createTestSchema,
  fieldGroup,
  fillValid,
  mountForm,
  testDict,
  testFields,
} from './fixtures/forms';

describe('errors', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('zodToFieldErrors keys are schemaKeys with the first issue per key', () => {
    const parsed = createTestSchema(testDict).safeParse({
      name: 'A',
      email: 'not-an-email',
      acceptance: false,
    });
    expect(parsed.success).toBe(false);
    if (parsed.success) {
      return;
    }
    const errors = zodToFieldErrors(parsed.error);
    expect(errors).toEqual({
      name: TEST_NAME_REQUIRED,
      email: TEST_EMAIL_INVALID,
      acceptance: TEST_ACCEPTANCE_REQUIRED,
    });
  });

  it('serverToFieldErrors keeps schemaKeys and ignores unknown or empty messages', () => {
    const errors = serverToFieldErrors(
      {
        email: 'TEST_SERVER_EMAIL',
        unknown: 'TEST_IGNORE',
        name: '',
        acceptance: 'TEST_SERVER_ACCEPTANCE',
      },
      testFields,
    );
    expect(errors).toEqual({
      email: 'TEST_SERVER_EMAIL',
      acceptance: 'TEST_SERVER_ACCEPTANCE',
    });
    expect(errors).not.toHaveProperty('unknown');
    expect(errors).not.toHaveProperty('name');
  });

  it('applyErrors paints fields and focuses the first FieldDef with an error', () => {
    const form = mountForm(testFields);
    fillValid(form);
    applyErrors(form, testFields, { email: 'TEST_SERVER_EMAIL', acceptance: 'TEST_SERVER_ACCEPTANCE' });

    const name = control(form, 'name');
    const email = control(form, 'email');
    const acceptance = control(form, 'acceptance');

    expect(name.getAttribute('aria-invalid')).toBeNull();
    expect(fieldGroup(name).hasAttribute('data-invalid')).toBe(false);

    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(fieldGroup(email).hasAttribute('data-invalid')).toBe(true);
    expect(fieldGroup(email).querySelector('.field__error')?.textContent).toBe('TEST_SERVER_EMAIL');

    expect(acceptance.getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(email);
  });

  it('clearErrors removes data-invalid, aria-invalid, and slot text', () => {
    const form = mountForm(testFields);
    applyErrors(form, testFields, { name: TEST_NAME_REQUIRED }, 'TEST_FORM_MSG');
    expect(control(form, 'name').getAttribute('aria-invalid')).toBe('true');
    expect(form.querySelector('[data-atom-form-status]')?.textContent).toBe('TEST_FORM_MSG');

    clearErrors(form, testFields);

    const name = control(form, 'name');
    expect(name.getAttribute('aria-invalid')).toBeNull();
    expect(fieldGroup(name).hasAttribute('data-invalid')).toBe(false);
    expect(fieldGroup(name).querySelector('.field__error')?.textContent).toBe('');
    expect(form.querySelector('[data-atom-form-status]')?.textContent).toBe('');
  });
});

describe('dom helpers', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('queryFormHosts keeps the ancestor when host and nested form share the attr', () => {
    const host = document.createElement('div');
    host.setAttribute('data-atom-form', 'test-lead');
    const inner = document.createElement('form');
    inner.setAttribute('data-atom-form', 'test-lead');
    host.append(inner);
    document.body.append(host);
    expect(queryFormHosts(host)).toEqual([host]);
    expect(queryFormHosts(document.body)).toEqual([host]);
  });

  it('readLandingId prefers host, then form; empty host===form is empty string', () => {
    const host = document.createElement('div');
    const form = document.createElement('form');
    host.append(form);
    host.setAttribute('data-atom-form-landing', 'from-host');
    form.setAttribute('data-atom-form-landing', 'from-form');
    expect(readLandingId(host, form)).toBe('from-host');

    host.setAttribute('data-atom-form-landing', '');
    expect(readLandingId(host, form)).toBe('from-form');
    expect(readLandingId(form, form)).toBe('from-form');
    form.removeAttribute('data-atom-form-landing');
    expect(readLandingId(form, form)).toBe('');
  });

  it('readLangRaw prefers host; missing on host===form is undefined', () => {
    const host = document.createElement('div');
    const form = document.createElement('form');
    host.append(form);
    host.setAttribute('data-atom-form-lang', 'pt');
    form.setAttribute('data-atom-form-lang', 'es');
    expect(readLangRaw(host, form)).toBe('pt');

    host.removeAttribute('data-atom-form-lang');
    expect(readLangRaw(host, form)).toBe('es');
    form.removeAttribute('data-atom-form-lang');
    expect(readLangRaw(host, form)).toBeUndefined();
    expect(readLangRaw(form, form)).toBeUndefined();
  });

  it('resolveFormElement / readFormKey / markInitialized', () => {
    const form = document.createElement('form');
    form.setAttribute('data-atom-form', 'test-lead');
    expect(resolveFormElement(form)).toBe(form);
    expect(readFormKey(form)).toBe('test-lead');

    const wrap = document.createElement('div');
    expect(resolveFormElement(wrap)).toBeNull();
    wrap.append(form);
    expect(resolveFormElement(wrap)).toBe(form);
    expect(readFormKey(wrap)).toBe('');

    expect(isInitialized(wrap)).toBe(false);
    markInitialized(wrap);
    expect(isInitialized(wrap)).toBe(true);
  });

  it('setFormStatus creates the banner when missing and fills role', () => {
    const form = document.createElement('form');
    document.body.append(form);
    setFormStatus(form, 'TEST_STATUS');
    const created = form.querySelector('[data-atom-form-status]');
    expect(created).toBeInstanceOf(HTMLElement);
    expect(created?.textContent).toBe('TEST_STATUS');
    expect(created?.getAttribute('role')).toBe('alert');

    created?.removeAttribute('role');
    setFormStatus(form, 'TEST_STATUS_2');
    expect(created?.getAttribute('role')).toBe('alert');
    expect(created?.textContent).toBe('TEST_STATUS_2');
  });

  it('applySelectValues fills empty selects only; skips non-select and empty values', () => {
    const country: FieldDef = { kind: 'select', schemaKey: 'country', name: 'country' };
    const name: FieldDef = { kind: 'text', schemaKey: 'name', name: 'name' };
    const form = mountForm([country, name]);
    const select = form.querySelector('[data-atom-field="country"]');
    if (!(select instanceof HTMLSelectElement)) {
      throw new Error('missing select');
    }
    select.append(new Option('', ''), new Option('PE', 'PE'), new Option('CL', 'CL'));
    const nameInput = control(form, 'name');
    nameInput.value = 'Ada';

    applySelectValues(form, [country, name], { country: '', name: 'X' });
    expect(select.value).toBe('');
    expect(nameInput.value).toBe('Ada');

    applySelectValues(form, [country, name], { country: 'PE' });
    expect(select.value).toBe('PE');

    applySelectValues(form, [country, name], { country: 'CL' });
    expect(select.value).toBe('PE');
  });
});
