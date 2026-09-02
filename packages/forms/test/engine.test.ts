/**
 * El ciclo completo con un submitter falso: válido, inválido, error de red.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bindForm } from '../src/core/engine';
import type { FormRequest, FormResponse, IntegrationHook } from '../src/core/types';
import {
  TEST_ACCEPTANCE_REQUIRED,
  TEST_CONNECTION,
  TEST_EMAIL_INVALID,
  TEST_GENERIC,
  TEST_NAME_REQUIRED,
  control,
  fieldGroup,
  fillValid,
  mountForm,
  submit,
  testConfig,
  testDict,
  testFields,
  testInstance,
} from './fixtures/forms';

function okSubmitter(overrides: Partial<FormResponse> = {}) {
  return vi.fn(async (_request: FormRequest): Promise<FormResponse> => ({
    ok: true,
    ...overrides,
  }));
}

describe('bindForm', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it('valid submit calls submitter once with schema keys only; empty trap omitted', async () => {
    const form = mountForm(testFields);
    const submitter = okSubmitter();
    bindForm(form, testInstance(form, { submitter }));
    fillValid(form);
    submit(form);

    await vi.waitFor(() => {
      expect(submitter).toHaveBeenCalledTimes(1);
    });

    const request = submitter.mock.calls[0]?.[0];
    expect(request).toMatchObject({
      landingId: 'lp-test',
      formKey: testConfig.key,
      locale: 'en',
      payload: {
        name: 'Ada',
        email: 'ada@example.test',
        acceptance: true,
      },
      meta: {
        landingUrl: 'https://example.test/lp?utm_source=x',
        referrer: '',
      },
    });
    expect(request?.meta.submittedAt).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
    expect(request).not.toHaveProperty('trap');
    expect(Object.keys(request?.payload ?? {}).sort()).toEqual(['acceptance', 'email', 'name']);
  });

  it('invalid submit does not call submitter and marks every field', () => {
    const form = mountForm(testFields);
    const submitter = okSubmitter();
    bindForm(form, testInstance(form, { submitter }));
    submit(form);

    expect(submitter).not.toHaveBeenCalled();
    expect(form.querySelectorAll('.field[data-invalid]')).toHaveLength(3);

    const name = control(form, 'name');
    const email = control(form, 'email');
    const acceptance = control(form, 'acceptance');
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(acceptance.getAttribute('aria-invalid')).toBe('true');
    expect(fieldGroup(name).querySelector('.field__error')?.textContent).toBe(TEST_NAME_REQUIRED);
    expect(fieldGroup(email).querySelector('.field__error')?.textContent).toBe(TEST_EMAIL_INVALID);
    expect(fieldGroup(acceptance).querySelector('.field__error')?.textContent).toBe(
      TEST_ACCEPTANCE_REQUIRED,
    );
    expect(document.activeElement).toBe(name);
  });

  it('submitter throw shows connection error, keeps values, loading off, button not disabled', async () => {
    const form = mountForm(testFields);
    const submitter = vi.fn(async (): Promise<FormResponse> => {
      throw new Error('TEST_NETWORK');
    });
    bindForm(form, testInstance(form, { submitter }));
    fillValid(form);
    submit(form);

    await vi.waitFor(() => {
      expect(form.querySelector('[data-atom-form-status]')?.textContent).toBe(TEST_CONNECTION);
    });

    expect(control(form, 'name').value).toBe('Ada');
    expect(control(form, 'email').value).toBe('ada@example.test');
    expect(control(form, 'acceptance').checked).toBe(true);

    const button = form.querySelector('[type="submit"]');
    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button?.hasAttribute('disabled')).toBe(false);
    expect(button?.getAttribute('aria-busy')).not.toBe('true');
    expect(form.getAttribute('aria-busy')).not.toBe('true');
    expect(button?.classList.contains('button--loading')).toBe(false);
  });

  it('integrations run only after ok:true; a throwing hook does not block onSuccess', async () => {
    const form = mountForm(testFields);
    const throwingHook: IntegrationHook = vi.fn(() => {
      throw new Error('TEST_HOOK_FAIL');
    });
    const okHook: IntegrationHook = vi.fn();
    const onSuccess = vi.fn();
    const submitter = okSubmitter({ ref: 'lead_01J' });
    bindForm(
      form,
      testInstance(form, {
        submitter,
        onSuccess,
        config: { ...testConfig, integrations: [throwingHook, okHook] },
      }),
    );
    fillValid(form);
    submit(form);

    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
    expect(throwingHook).toHaveBeenCalledTimes(1);
    expect(okHook).toHaveBeenCalledTimes(1);
    expect(onSuccess.mock.calls[0]?.[0]).toMatchObject({
      mount: form,
      form,
      dict: testDict,
      response: { ok: true, ref: 'lead_01J' },
    });
  });

  it('integrations do not run when the submitter returns ok:false', async () => {
    const form = mountForm(testFields);
    const hook: IntegrationHook = vi.fn();
    const onSuccess = vi.fn();
    const submitter = vi.fn(async (): Promise<FormResponse> => ({
      ok: false,
      code: 'server_error',
      message: 'TEST_SERVER',
    }));
    bindForm(
      form,
      testInstance(form, {
        submitter,
        onSuccess,
        config: { ...testConfig, integrations: [hook] },
      }),
    );
    fillValid(form);
    submit(form);

    await vi.waitFor(() => {
      expect(submitter).toHaveBeenCalledTimes(1);
    });
    expect(hook).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('blur marks touched and validates; input skips until touched, then revalidates', () => {
    const form = mountForm(testFields);
    bindForm(form, testInstance(form));
    const name = control(form, 'name');
    const group = fieldGroup(name);

    name.value = 'A';
    name.dispatchEvent(new Event('input', { bubbles: true }));
    expect(group.hasAttribute('data-invalid')).toBe(false);
    expect(name.getAttribute('aria-invalid')).toBeNull();

    name.dispatchEvent(new Event('blur', { bubbles: true }));
    expect(group.hasAttribute('data-invalid')).toBe(true);
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(group.querySelector('.field__error')?.textContent).toBe(TEST_NAME_REQUIRED);

    name.value = 'Ada';
    name.dispatchEvent(new Event('input', { bubbles: true }));
    expect(group.hasAttribute('data-invalid')).toBe(false);
    expect(name.getAttribute('aria-invalid')).toBeNull();
    expect(group.querySelector('.field__error')?.textContent).toBe('');
  });

  it('maps validation_error by schemaKey and focuses the first field with an error', async () => {
    const form = mountForm(testFields);
    const submitter = vi.fn(async (): Promise<FormResponse> => ({
      ok: false,
      code: 'validation_error',
      message: 'TEST_SERVER_MSG',
      errors: { email: 'TEST_SERVER_EMAIL', unknown: 'TEST_IGNORE' },
    }));
    bindForm(form, testInstance(form, { submitter }));
    fillValid(form);
    submit(form);

    await vi.waitFor(() => {
      expect(control(form, 'email').getAttribute('aria-invalid')).toBe('true');
    });

    const email = control(form, 'email');
    expect(fieldGroup(email).querySelector('.field__error')?.textContent).toBe('TEST_SERVER_EMAIL');
    expect(control(form, 'name').getAttribute('aria-invalid')).toBeNull();
    expect(fieldGroup(control(form, 'name')).querySelector('.field__error')?.textContent).toBe('');
    expect(document.activeElement).toBe(email);
  });

  it('empty landingId does not call submitter', () => {
    const form = mountForm(testFields);
    const submitter = okSubmitter();
    bindForm(form, testInstance(form, { submitter, landingId: '' }));
    fillValid(form);
    submit(form);

    expect(submitter).not.toHaveBeenCalled();
    expect(form.querySelector('[data-atom-form-status]')?.textContent).toBe(TEST_GENERIC);
  });

  it('double submit while in-flight calls submitter once', async () => {
    const form = mountForm(testFields);
    let release!: (value: FormResponse) => void;
    const submitter = vi.fn(
      () =>
        new Promise<FormResponse>((resolve) => {
          release = resolve;
        }),
    );
    bindForm(form, testInstance(form, { submitter }));
    fillValid(form);
    submit(form);
    submit(form);

    await vi.waitFor(() => {
      expect(submitter).toHaveBeenCalledTimes(1);
    });
    expect(submitter).toHaveBeenCalledTimes(1);
    release({ ok: true });
    await vi.waitFor(() => {
      expect(form.querySelector('[type="submit"]')?.getAttribute('aria-busy')).not.toBe('true');
    });
  });

  it('sets aria-busy=true on the button during the submitter await', async () => {
    const form = mountForm(testFields);
    let release!: (value: FormResponse) => void;
    const submitter = vi.fn(
      () =>
        new Promise<FormResponse>((resolve) => {
          release = resolve;
        }),
    );
    bindForm(form, testInstance(form, { submitter }));
    fillValid(form);
    submit(form);

    const button = form.querySelector('[type="submit"]');
    await vi.waitFor(() => {
      expect(button?.getAttribute('aria-busy')).toBe('true');
    });
    expect(form.getAttribute('aria-busy')).toBe('true');
    expect(button?.hasAttribute('disabled')).toBe(false);

    release({ ok: true });
    await vi.waitFor(() => {
      expect(button?.getAttribute('aria-busy')).not.toBe('true');
    });
  });

  it('filled trap travels on the request root, not in payload', async () => {
    const form = mountForm(testFields);
    const submitter = okSubmitter();
    bindForm(form, testInstance(form, { submitter }));
    fillValid(form);
    const trap = form.querySelector('[name="trap"]');
    if (!(trap instanceof HTMLInputElement)) {
      throw new Error('missing trap');
    }
    trap.value = 'TEST_BOT';
    submit(form);

    await vi.waitFor(() => {
      expect(submitter).toHaveBeenCalledTimes(1);
    });
    const request = submitter.mock.calls[0]?.[0];
    expect(request?.trap).toBe('TEST_BOT');
    expect(request?.payload).not.toHaveProperty('trap');
  });
});
