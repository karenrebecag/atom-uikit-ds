import type { WhatsAppButtonConfig } from './config';
import { mergeConfig } from './config';
import { detectLocale, getDefaultMessage, getDefaultLabel } from './i18n';
import { collectTrackingData } from './tracking';
import { buildMessage } from './strategy';
import { sendWebhook } from './webhook';
import { renderFloatingButton } from './render';

export type CleanupFn = () => void;

const DEBOUNCE_MS = 2000;
// Instance-level debounce — one flag for ALL buttons (floating + attach).
// A click on button A blocks button B too. One WhatsApp redirect per 2s window.
let _pending = false;

function handleClick(config: WhatsAppButtonConfig, btn?: HTMLElement): void {
  if (_pending) return;
  _pending = true;
  if (btn) btn.setAttribute('aria-busy', 'true');
  setTimeout(() => {
    _pending = false;
    if (btn) btn.setAttribute('aria-busy', 'false');
  }, DEBOUNCE_MS);

  // 1. Prepare everything synchronously (same tick as user click)
  const data = collectTrackingData();
  const enhanced = buildMessage(data.chatId, config.message!, config.chatIdStrategy!);
  const phone = config.phone.replace(/\D/g, '');
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(enhanced)}`;

  // 2. Open WhatsApp FIRST — must be in the synchronous click handler
  //    to avoid popup blockers on iOS Safari and other mobile browsers
  if (config.openInNewTab) {
    window.open(waUrl, '_blank', 'noopener');
  } else {
    window.location.href = waUrl;
  }

  // 3. Fire-and-forget AFTER navigation (non-blocking)
  sendWebhook(data, config.webhookUrl!, config.companyToken, config.onError);

  // 4. GA4 dataLayer push
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: 'atom_cta_click',
    host: window.location.hostname,
    path: window.location.pathname,
    chat_id: data.chatId,
    device: data.device,
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
      handleClick(
        { ...config, message: btn.dataset.message || config.message },
        btn
      );
    }, { signal: ac.signal });
  });

  return () => controllers.forEach((ac) => ac.abort());
}

export function initWhatsAppButton(
  userConfig: Partial<WhatsAppButtonConfig> & Pick<WhatsAppButtonConfig, 'companyToken' | 'phone'>
): CleanupFn {
  const locale = userConfig.lang || detectLocale();
  const config = mergeConfig({
    ...userConfig,
    lang: locale,
    message: userConfig.message || getDefaultMessage(locale),
    label: userConfig.label || getDefaultLabel(locale),
  });

  if (config.mode === 'attach') {
    return attachToExisting(config);
  }

  // Float mode: render floating button + attach to existing [data-atom-button]
  const btn = renderFloatingButton(config, (el) => handleClick(config, el));
  const detachExisting = attachToExisting(config);

  return () => {
    btn.remove();
    document.getElementById('atom-wa-styles')?.remove();
    detachExisting();
  };
}
