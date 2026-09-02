/**
 * Label ligado, aria-describedby en error, foco al primero, aria-busy.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bindForm } from '../src/core/engine';
import type { FormResponse } from '../src/core/types';
import { renderForm } from '../src/ui/organisms/form';
import { renderThankYou } from '../src/ui/organisms/thank-you';
import {
  fillValid,
  submit,
  testConfig,
  testDict,
  testInstance,
} from './fixtures/forms';

function asForm(node: HTMLElement): HTMLFormElement {
  if (node instanceof HTMLFormElement) {
    return node;
  }
  const inner = node.querySelector('form');
  if (inner instanceof HTMLFormElement) {
    return inner;
  }
  throw new Error('renderForm did not produce a form');
}

function isTrap(el: Element): boolean {
  return el.getAttribute('name') === 'trap' || el.getAttribute('data-atom-field') === 'trap';
}

describe('a11y organism markup', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it('every control has a label linked by for/id', () => {
    const rendered = renderForm(testConfig, testDict);
    document.body.append(rendered);
    const form = asForm(rendered);
    const controls = form.querySelectorAll('input, select, textarea');
    expect(controls.length).toBeGreaterThan(0);
    for (const el of controls) {
      if (isTrap(el)) {
        continue;
      }
      expect(el.id, `control ${el.getAttribute('name') ?? el.tagName} missing id`).toBeTruthy();
      const label = form.querySelector(`label[for="${el.id}"]`);
      expect(label, `missing label[for=${el.id}]`).not.toBeNull();
    }
  });

  it('on invalid submit, aria-describedby points at the alert message', async () => {
    const rendered = renderForm(testConfig, testDict);
    document.body.append(rendered);
    const form = asForm(rendered);
    const submitter = vi.fn(async (): Promise<FormResponse> => ({ ok: true }));
    bindForm(form, testInstance(form, { submitter }));
    submit(form);

    await vi.waitFor(() => {
      expect(form.querySelector('[aria-invalid="true"]')).not.toBeNull();
    });
    expect(submitter).not.toHaveBeenCalled();

    const invalid = form.querySelector('[aria-invalid="true"]');
    expect(invalid).toBeInstanceOf(HTMLElement);
    const describedBy = invalid?.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const ids = (describedBy ?? '').split(/\s+/).filter((id) => id !== '');
    const alert = ids
      .map((id) => document.getElementById(id))
      .find((node) => node?.getAttribute('role') === 'alert');
    expect(alert).toBeTruthy();
    expect(alert?.textContent?.trim().length).toBeGreaterThan(0);
  });

  it('after a failed submit, focus is on the first field with an error', () => {
    const rendered = renderForm(testConfig, testDict);
    document.body.append(rendered);
    const form = asForm(rendered);
    bindForm(form, testInstance(form));
    submit(form);
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    expect(firstInvalid).not.toBeNull();
    expect(document.activeElement).toBe(firstInvalid);
  });

  it('loading sets aria-busy=true on the submit button', async () => {
    const rendered = renderForm(testConfig, testDict);
    document.body.append(rendered);
    const form = asForm(rendered);
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
    expect(button?.hasAttribute('disabled')).toBe(false);

    release({ ok: true });
    await vi.waitFor(() => {
      expect(button?.getAttribute('aria-busy')).not.toBe('true');
    });
  });

  it('thank-you receives focus on mount', async () => {
    const node = renderThankYou(testDict);
    document.body.append(node);
    await Promise.resolve();
    expect(document.activeElement).toBe(node);
  });
});
