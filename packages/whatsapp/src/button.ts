import type { WhatsAppButtonConfig } from './config';
import { mergeConfig } from './config';
import { detectLocale, getDefaultMessage, getDefaultLabel } from './i18n';
import { collectTrackingData } from './tracking';
import { buildMessage } from './strategy';
import { sendWebhook } from './webhook';
import { renderButton } from './render';

export type CleanupFn = () => void;

const DEBOUNCE_MS = 2000;
let _pending = false;

function handleClick(config: WhatsAppButtonConfig, btn?: HTMLElement): void {
  if (_pending) return;
  _pending = true;
  if (btn) btn.setAttribute('aria-busy', 'true');
  setTimeout(() => {
    _pending = false;
    if (btn) btn.setAttribute('aria-busy', 'false');
  }, DEBOUNCE_MS);

  const data = collectTrackingData();
  const enhanced = buildMessage(data.chatId, config.message!, config.chatIdStrategy!);
  const phone = config.phone.replace(/\D/g, '');
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(enhanced)}`;

  if (config.openInNewTab) {
    window.open(waUrl, '_blank', 'noopener');
  } else {
    window.location.href = waUrl;
  }

  sendWebhook(data, config.webhookUrl!, config.companyToken, config.onError);

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: 'atom_cta_click',
    host: window.location.hostname,
    path: window.location.pathname,
    chat_id: data.chatId,
    device: data.device,
    cta: config.cta,
  });
}

function attachToExisting(config: WhatsAppButtonConfig): CleanupFn {
  const scope = config.scope || document;
  const buttons = scope.querySelectorAll<HTMLElement>('[data-atom-button]');
  const controllers: AbortController[] = [];

  buttons.forEach((btn) => {
    const ac = new AbortController();
    controllers.push(ac);

    if (btn.tagName === 'A') {
      const phone = config.phone.replace(/\D/g, '');
      (btn as HTMLAnchorElement).href =
        `https://wa.me/${phone}?text=${encodeURIComponent(config.message!)}`;
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const btnCta = btn.dataset.cta as WhatsAppButtonConfig['cta'];
      const locale = config.lang!;
      handleClick(
        {
          ...config,
          message: btn.dataset.message || (btnCta ? getDefaultMessage(locale, btnCta) : config.message),
          cta: btnCta || config.cta,
        },
        btn
      );
    }, { signal: ac.signal });
  });

  return () => controllers.forEach((ac) => ac.abort());
}

export function initWhatsAppButton(
  userConfig: Partial<WhatsAppButtonConfig> & Pick<WhatsAppButtonConfig, 'companyToken' | 'phone'>,
  scriptEl?: HTMLElement,
): CleanupFn {
  const locale = userConfig.lang || detectLocale();
  const cta = userConfig.cta || 'default';
  const config = mergeConfig({
    ...userConfig,
    lang: locale,
    cta,
    message: userConfig.message || getDefaultMessage(locale, cta),
    label: userConfig.label || getDefaultLabel(locale, cta),
  });

  if (config.mode === 'attach') {
    return attachToExisting(config);
  }

  const variant = config.variant || 'inline';

  // inline renders where the script tag is; pill/icon float fixed
  const btn = renderButton(
    config,
    (el) => handleClick(config, el),
    variant === 'inline' ? scriptEl : undefined,
  );
  const detachExisting = attachToExisting(config);

  return () => {
    btn.remove();
    document.getElementById('atom-wa-styles')?.remove();
    detachExisting();
  };
}
