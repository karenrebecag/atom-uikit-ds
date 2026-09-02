/**
 * Map formKey → FormConfig. registerForm / getForm. Avisa al sobreescribir
 * devolviendo `{ overwritten }` — no hay logger en producto.
 */
import type { FormConfig, RegisterResult } from './types';

const registry = new Map<string, FormConfig>();

function cloneConfig(config: FormConfig): FormConfig {
  return {
    ...config,
    fields: [...config.fields],
    integrations: config.integrations ? [...config.integrations] : undefined,
  };
}

export function registerForm(config: FormConfig): RegisterResult {
  const overwritten = registry.has(config.key);
  registry.set(config.key, cloneConfig(config));
  return { overwritten };
}

export function getForm(key: string): FormConfig | undefined {
  const config = registry.get(key);
  if (config === undefined) {
    return undefined;
  }
  return cloneConfig(config);
}
