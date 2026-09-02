/**
 * FormConfig de prueba. No importa schemas de negocio reales.
 */
import { z } from 'zod';

// Why: jsdom 26 has no CSS.escape; product/dom.ts uses it (browser API). Not a softened assertion.
if (typeof CSS === 'undefined' || typeof CSS.escape !== 'function') {
  const escape = (value: string): string =>
    String(value).replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
  Object.defineProperty(globalThis, 'CSS', {
    value: { ...(typeof CSS === 'object' && CSS !== null ? CSS : {}), escape },
    configurable: true,
  });
}
import type { Dict } from '../../src/i18n';
import type {
  FieldDef,
  FormConfig,
  FormInstance,
  FormSchema,
  RequestMeta,
} from '../../src/core/types';

export const TEST_NAME_REQUIRED = 'TEST_NAME_REQUIRED';
export const TEST_EMAIL_INVALID = 'TEST_EMAIL_INVALID';
export const TEST_ACCEPTANCE_REQUIRED = 'TEST_ACCEPTANCE_REQUIRED';
export const TEST_PHONE_INVALID = 'TEST_PHONE_INVALID';
export const TEST_CONNECTION = 'TEST_CONNECTION';
export const TEST_GENERIC = 'TEST_GENERIC';

export const testDict: Dict = {
  labels: {
    name: 'TEST_LABEL_NAME',
    email: 'TEST_LABEL_EMAIL',
    phone: 'TEST_LABEL_PHONE',
    acceptance: 'TEST_LABEL_ACCEPTANCE',
  },
  placeholders: {
    name: 'TEST_PH_NAME',
    email: 'TEST_PH_EMAIL',
    phone: 'TEST_PH_PHONE',
  },
  validation: {
    name: TEST_NAME_REQUIRED,
    email: TEST_EMAIL_INVALID,
    phone: TEST_PHONE_INVALID,
    acceptance: TEST_ACCEPTANCE_REQUIRED,
  },
  errors: {
    connection: TEST_CONNECTION,
    generic: TEST_GENERIC,
  },
  submit: 'TEST_SUBMIT',
  thankYou: {
    title: 'TEST_THANKS_TITLE',
    message: 'TEST_THANKS_MESSAGE',
  },
};

export function createTestSchema(_dict: Dict = testDict): FormSchema {
  return z
    .object({
      name: z.string().trim().min(2, TEST_NAME_REQUIRED),
      email: z.string().trim().email(TEST_EMAIL_INVALID),
      acceptance: z.boolean().refine((value: boolean): boolean => value === true, {
        message: TEST_ACCEPTANCE_REQUIRED,
      }),
    })
    .strict();
}

export const testFields: readonly FieldDef[] = [
  { kind: 'text', schemaKey: 'name', name: 'name', required: true },
  { kind: 'email', schemaKey: 'email', name: 'email', required: true },
  { kind: 'acceptance', schemaKey: 'acceptance', name: 'acceptance', required: true },
];

export const testConfig: FormConfig = {
  key: 'test-lead',
  fields: testFields,
  createSchema: createTestSchema,
};

export function testCollectMeta(): RequestMeta {
  return {
    landingUrl: 'https://example.test/lp?utm_source=x',
    referrer: '',
    submittedAt: new Date().toISOString(),
  };
}

export function testInstance(
  form: HTMLFormElement,
  overrides: Partial<FormInstance> = {},
): FormInstance {
  return {
    config: testConfig,
    schema: createTestSchema(testDict),
    dict: testDict,
    mount: form,
    submitter: async () => ({ ok: true }),
    landingId: 'lp-test',
    locale: 'en',
    collectMeta: testCollectMeta,
    ...overrides,
  };
}

function controlType(kind: FieldDef['kind']): string {
  if (kind === 'acceptance') {
    return 'checkbox';
  }
  if (kind === 'email') {
    return 'email';
  }
  if (kind === 'tel') {
    return 'tel';
  }
  return 'text';
}

function labelText(schemaKey: string): string {
  if (schemaKey === 'name') {
    return testDict.labels.name;
  }
  if (schemaKey === 'email') {
    return testDict.labels.email;
  }
  if (schemaKey === 'phone') {
    return testDict.labels.phone;
  }
  if (schemaKey === 'acceptance') {
    return testDict.labels.acceptance;
  }
  return schemaKey;
}

export function mountForm(fields: readonly FieldDef[]): HTMLFormElement {
  const form = document.createElement('form');
  form.setAttribute('data-atom-form', testConfig.key);
  form.setAttribute('data-atom-form-landing', 'lp-test');
  form.setAttribute('data-atom-form-lang', 'en');

  for (const def of fields) {
    const group = document.createElement('div');
    group.className = 'field';
    const id = `atom-test-${def.schemaKey}`;

    const label = document.createElement('label');
    label.className = 'field__label';
    label.htmlFor = id;
    label.textContent = labelText(def.schemaKey);
    group.append(label);

    if (def.kind === 'select') {
      const select = document.createElement('select');
      select.className = 'select';
      select.id = id;
      select.name = def.name;
      select.setAttribute('data-atom-field', def.schemaKey);
      group.append(select);
    } else {
      const input = document.createElement('input');
      input.type = controlType(def.kind);
      input.className = def.kind === 'acceptance' ? 'checkbox' : 'input';
      input.id = id;
      input.name = def.name;
      input.setAttribute('data-atom-field', def.schemaKey);
      group.append(input);
    }

    const error = document.createElement('p');
    error.className = 'field__error';
    group.append(error);
    form.append(group);
  }

  const trap = document.createElement('input');
  trap.type = 'text';
  trap.name = 'trap';
  trap.setAttribute('data-atom-field', 'trap');
  trap.setAttribute('autocomplete', 'off');
  trap.tabIndex = -1;
  form.append(trap);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button';
  const buttonLabel = document.createElement('span');
  buttonLabel.className = 'button__label';
  buttonLabel.textContent = testDict.submit;
  button.append(buttonLabel);
  form.append(button);

  document.body.append(form);
  return form;
}

export function fillValid(form: HTMLFormElement): void {
  const name = form.querySelector('[data-atom-field="name"]');
  const email = form.querySelector('[data-atom-field="email"]');
  const acceptance = form.querySelector('[data-atom-field="acceptance"]');
  if (name instanceof HTMLInputElement) {
    name.value = 'Ada';
  }
  if (email instanceof HTMLInputElement) {
    email.value = 'ada@example.test';
  }
  if (acceptance instanceof HTMLInputElement) {
    acceptance.checked = true;
  }
}

export function control(form: HTMLFormElement, schemaKey: string): HTMLInputElement {
  const el = form.querySelector(`[data-atom-field="${schemaKey}"]`);
  if (!(el instanceof HTMLInputElement)) {
    throw new Error(`missing control ${schemaKey}`);
  }
  return el;
}

export function fieldGroup(el: Element): HTMLElement {
  const group = el.closest('.field');
  if (!(group instanceof HTMLElement)) {
    throw new Error('missing .field group');
  }
  return group;
}

export function submit(form: HTMLFormElement): void {
  form.requestSubmit();
}
