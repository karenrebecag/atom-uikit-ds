import type { WhatsAppButtonConfig } from './config';

const WHATSAPP_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const STYLE_ID = 'atom-wa-styles';

function isValidHex(v: string): boolean {
  return /^#([0-9a-fA-F]{3,8})$/.test(v);
}

const CSS = (color: string, textColor: string, position: string) => `
.atom-wa-btn {
  position: fixed;
  ${position === 'bottom-left' ? 'left' : 'right'}: 20px;
  bottom: 20px;
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${isValidHex(color) ? color : '#25D366'};
  color: ${isValidHex(textColor) ? textColor : '#FFFFFF'};
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0,0,0,0.16);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}
.atom-wa-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}
.atom-wa-btn:active {
  transform: scale(0.97);
}
.atom-wa-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
.atom-wa-btn svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
.atom-wa-btn__label {
  white-space: nowrap;
}
@media (max-width: 480px) {
  .atom-wa-btn__label { display: none; }
  .atom-wa-btn { padding: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .atom-wa-btn { transition: none; }
}
`;

function injectStyles(color: string, textColor: string, position: string): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS(color, textColor, position);
  document.head.appendChild(style);
}

export function renderFloatingButton(
  config: WhatsAppButtonConfig,
  onClick: (btn: HTMLButtonElement) => void
): HTMLButtonElement {
  injectStyles(config.color!, config.textColor!, config.position!);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'atom-wa-btn';
  btn.setAttribute('aria-label', config.label!);

  // Icon via innerHTML (static SVG, no user input)
  const iconWrap = document.createElement('span');
  iconWrap.innerHTML = WHATSAPP_ICON;

  // Label via textContent (prevents XSS from user-controlled config.label)
  const labelSpan = document.createElement('span');
  labelSpan.className = 'atom-wa-btn__label';
  labelSpan.textContent = config.label!;

  btn.appendChild(iconWrap.firstElementChild!);
  btn.appendChild(labelSpan);

  btn.addEventListener('click', () => onClick(btn));

  document.body.appendChild(btn);
  return btn;
}
