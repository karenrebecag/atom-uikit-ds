/**
 * Alta, colisión y lectura de formKey inexistente.
 */
import { describe, expect, it } from 'vitest';
import { getForm, registerForm } from '../src/core/registry';
import type { FieldDef, IntegrationHook } from '../src/core/types';
import { testConfig, testFields } from './fixtures/forms';

let seq = 0;

function uniqueKey(): string {
  seq += 1;
  return `test-registry-${seq}`;
}

describe('registerForm / getForm', () => {
  it('registers a config and returns it by key', () => {
    const key = uniqueKey();
    const result = registerForm({ ...testConfig, key });
    expect(result).toEqual({ overwritten: false });
    const stored = getForm(key);
    expect(stored?.key).toBe(key);
    expect(stored?.fields).toEqual(testFields);
  });

  it('collision returns overwritten:true and the second config wins', () => {
    const key = uniqueKey();
    expect(registerForm({ ...testConfig, key, fields: [testFields[0]!] })).toEqual({
      overwritten: false,
    });
    const secondFields: readonly FieldDef[] = [testFields[1]!];
    expect(registerForm({ ...testConfig, key, fields: secondFields })).toEqual({
      overwritten: true,
    });
    expect(getForm(key)?.fields.map((field) => field.schemaKey)).toEqual(['email']);
  });

  it('unknown key returns undefined', () => {
    expect(getForm('does-not-exist-form-key')).toBeUndefined();
  });

  it('getForm returns a copy: mutating fields does not change the store', () => {
    const key = uniqueKey();
    const hook: IntegrationHook = () => undefined;
    registerForm({ ...testConfig, key, integrations: [hook] });
    const first = getForm(key);
    if (first === undefined) {
      throw new Error('expected config');
    }
    (first.fields as FieldDef[]).push({
      kind: 'tel',
      schemaKey: 'phone',
      name: 'phone',
    });
    (first.integrations as IntegrationHook[] | undefined)?.pop();
    const second = getForm(key);
    expect(second?.fields).toHaveLength(testFields.length);
    expect(second?.fields.map((field) => field.schemaKey)).toEqual(['name', 'email', 'acceptance']);
    expect(second?.integrations).toHaveLength(1);
  });
});
