import { initWhatsAppButton } from './button';
import { parseDataAttributes } from './config';

// Capture synchronously — null if script is async/deferred and read later
const _script = document.currentScript as HTMLScriptElement | null;

function autoInit(): void {
  if (!_script) {
    console.warn('[AtomWhatsApp] document.currentScript unavailable. Use AtomWhatsApp.init() manually.');
    return;
  }

  const attrs = parseDataAttributes(_script);

  if (!attrs.companyToken || !attrs.phone) {
    console.warn('[AtomWhatsApp] Missing required data-company-token and data-phone attributes.');
    return;
  }

  const w = window as any;
  const queue: Array<[string, any[]]> = w.AtomWhatsApp?._q || [];

  const cleanup = initWhatsAppButton({
    companyToken: attrs.companyToken,
    phone: attrs.phone,
    ...attrs,
  }, _script);

  w.AtomWhatsApp = {
    init: initWhatsAppButton,
    destroy: cleanup,
    _initialized: true,
  };

  queue.forEach(([method, args]) => {
    if (typeof (w.AtomWhatsApp as any)[method] === 'function') {
      (w.AtomWhatsApp as any)[method](...args);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}
