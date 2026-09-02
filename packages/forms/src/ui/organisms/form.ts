/**
 * Arma el <form> desde FormConfig.fields. novalidate: la validación es
 * nuestra. Es lo que un consumidor de código instancia.
 */
import type { FormConfig } from '../../core/types';
import type { Dict, Lang } from '../../i18n';
import { button } from '../atoms/button';
import { fieldGroup } from '../molecules/field-group';

export interface FormRenderAttrs {
  readonly landingId?: string;
  readonly locale?: Lang;
}

export function renderForm(
  config: FormConfig,
  dict: Dict,
  attrs?: FormRenderAttrs,
): HTMLFormElement {
  const form = document.createElement('form');
  form.noValidate = true;
  form.method = 'post';
  form.setAttribute('data-atom-form', config.key);
  if (attrs?.landingId !== undefined && attrs.landingId !== '') {
    form.setAttribute('data-atom-form-landing', attrs.landingId);
  }
  if (attrs?.locale !== undefined) {
    form.setAttribute('data-atom-form-lang', attrs.locale);
  }

  form.appendChild(statusBanner());
  form.appendChild(honeypot());
  for (const def of config.fields) {
    form.appendChild(fieldGroup(def, dict));
  }
  form.appendChild(button({ label: dict.submit }));
  return form;
}

function statusBanner(): HTMLDivElement {
  const el = document.createElement('div');
  el.setAttribute('data-atom-form-status', '');
  el.setAttribute('role', 'alert');
  el.tabIndex = -1;
  return el;
}

function honeypot(): HTMLInputElement {
  // Why: el DS no publica visually-hidden; type=hidden oculta a humanos y AT,
  // y caza menos bots que un texto clippeado.
  const el = document.createElement('input');
  el.type = 'hidden';
  el.name = 'trap';
  el.setAttribute('data-atom-field', 'trap');
  el.setAttribute('aria-hidden', 'true');
  el.tabIndex = -1;
  el.autocomplete = 'off';
  return el;
}
