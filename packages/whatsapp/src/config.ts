export type ButtonVariant = 'inline' | 'pill' | 'icon';
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type CTA = 'agendar_demo' | 'hablar_asesor' | 'demo_5min' | 'consultar_precio' | 'default';

export interface WhatsAppButtonConfig {
  companyToken: string;
  phone: string;
  label?: string;
  color?: string;
  textColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  message?: string;
  lang?: 'es' | 'en' | 'pt';
  chatIdStrategy?: 'url' | 'referenceCode';
  mode?: 'float' | 'attach';
  variant?: ButtonVariant;
  size?: ButtonSize;
  cta?: CTA;
  animated?: boolean;
  webhookUrl?: string;
  openInNewTab?: boolean;
  /** DOM scope for querySelectorAll('[data-atom-button]'). Only used in 'attach' mode or combined with 'float'. Not configurable via data-attributes. */
  scope?: HTMLElement | Document;
  /** Optional error callback for webhook failures. Useful for custom observability. */
  onError?: (error: unknown) => void;
}

export interface TrackingData {
  chatId: string;
  url: string;
  device: string;
  gclid?: string;
  [key: string]: string | undefined;
}

export const DEFAULTS: Required<Omit<WhatsAppButtonConfig, 'companyToken' | 'phone' | 'scope' | 'onError'>> = {
  label: 'Contactanos',
  color: '#25D366',
  textColor: '#FFFFFF',
  position: 'bottom-right',
  message: 'Hola, quiero mas informacion',
  lang: 'es',
  chatIdStrategy: 'url',
  mode: 'float',
  variant: 'inline',
  size: 'm',
  cta: 'default',
  animated: true,
  webhookUrl: 'https://api.atomchat.io/wci',
  openInNewTab: true,
};

export function parseDataAttributes(el: HTMLElement): Partial<WhatsAppButtonConfig> {
  const d = el.dataset;
  return {
    companyToken: d.companyToken,
    phone: d.phone,
    label: d.label,
    color: d.color,
    textColor: d.textColor,
    position: d.position as WhatsAppButtonConfig['position'],
    message: d.message,
    lang: d.lang as WhatsAppButtonConfig['lang'],
    chatIdStrategy: d.strategy as WhatsAppButtonConfig['chatIdStrategy'],
    mode: d.mode as WhatsAppButtonConfig['mode'],
    variant: d.variant as WhatsAppButtonConfig['variant'],
    size: d.size as WhatsAppButtonConfig['size'],
    cta: d.cta as WhatsAppButtonConfig['cta'],
    animated: d.animated === undefined ? undefined : d.animated !== 'false',
  };
}

export function mergeConfig(
  overrides: Partial<WhatsAppButtonConfig>
): WhatsAppButtonConfig {
  return { ...DEFAULTS, ...strip(overrides) } as WhatsAppButtonConfig;
}

function strip<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}
