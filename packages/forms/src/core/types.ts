/**
 * FieldDef unión discriminada: fuente única de render, name de envío y
 * schemaKey. FormConfig, FormInstance, IntegrationHook. Cero tipos de
 * plataforma de origen.
 */
import type { ZodType } from 'zod';
import type { Dict, Lang } from '../i18n';
import type { FormRequest, FormResponse, FormSuccessResponse, RequestMeta } from '../schemas/contract';

export type { FormRequest, FormResponse, FormSuccessResponse, RequestMeta };

export type Submitter = (request: FormRequest) => Promise<FormResponse>;

export type FieldErrors = Record<string, string>;

export type ColSpan = 100 | 50 | 33 | 30 | 25 | 20;

export type OptionsRef = 'cargo' | 'pais' | 'leads_mensuales' | 'objetivo';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface BaseField {
  readonly schemaKey: string;
  readonly name: string;
  readonly required?: boolean;
  readonly colSpan?: ColSpan;
}

export type FieldDef =
  | (BaseField & { readonly kind: 'text' | 'email' | 'tel'; readonly pattern?: string })
  | (BaseField & {
      readonly kind: 'select';
      /**
       * Qué conjunto de opciones usa. Las ETIQUETAS viven en el diccionario, así que
       * los campos no pueden llevarlas horneadas: cambiarían con el idioma.
       */
      readonly optionsRef?: OptionsRef;
      readonly options?: readonly SelectOption[];
      readonly searchable?: boolean;
    })
  | (BaseField & { readonly kind: 'acceptance'; readonly defaultChecked?: boolean });

export interface IntegrationContext {
  readonly values: Readonly<Record<string, unknown>>;
  readonly response: FormSuccessResponse;
  readonly form: HTMLFormElement;
}

export type IntegrationHook = (ctx: IntegrationContext) => void | Promise<void>;

export interface SuccessContext {
  readonly mount: HTMLElement;
  readonly form: HTMLFormElement;
  readonly response: FormSuccessResponse;
  readonly dict: Dict;
}

export type SuccessHandler = (ctx: SuccessContext) => void;

export type FormSchema = ZodType<unknown>;

export interface FormConfig {
  readonly key: string;
  readonly fields: readonly FieldDef[];
  readonly createSchema: (dict: Dict) => FormSchema;
  readonly integrations?: readonly IntegrationHook[];
  readonly onSuccess?: SuccessHandler;
}

export interface FormInstance {
  readonly config: FormConfig;
  readonly schema: FormSchema;
  readonly dict: Dict;
  readonly mount: HTMLElement;
  readonly submitter: Submitter;
  readonly landingId: string;
  readonly locale: Lang;
  readonly collectMeta: () => RequestMeta;
  readonly onSuccess?: SuccessHandler;
}

export type RegisterResult = {
  readonly overwritten: boolean;
};

// Why: ui-anatomy (Ola 2) pinta; el engine solo bindea. 04 no nombra el atributo de
// landingId — se honra `data-atom-form-landing` en el host `[data-atom-form]` o el <form>.
// Control: `[data-atom-field="{schemaKey}"]` o `[name="{FieldDef.name}"]`.
// Honeypot: `name="trap"` / `data-atom-field="trap"`, raíz del request, no payload.
// Grupo `.field` + `data-invalid`; mensaje `.field__error`; control `aria-invalid`.
// Banner de form: `[data-atom-form-status]` — el DS no tiene clase de alerta de form.
