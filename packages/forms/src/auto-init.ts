/**
 * Escanea [data-atom-form], resuelve config y monta. Idempotente:
 * data-atom-form-init; llamarlo dos veces no duplica listeners.
 */
import { initAll } from './index';

export { getForm, initAll, registerForm } from './index';
export type {
  AtomFormsApi,
  FieldDef,
  FormConfig,
  FormInstance,
  IntegrationHook,
  RegisterResult,
  Submitter,
  SuccessHandler,
} from './index';

function boot(): void {
  initAll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
