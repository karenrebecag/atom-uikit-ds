import type { WhatsAppButtonConfig, ButtonSize } from './config';

const WHATSAPP_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const STYLE_ID = 'atom-wa-styles';

function isValidHex(v: string): boolean {
  return /^#([0-9a-fA-F]{3,8})$/.test(v);
}

// button-009 pattern: em-based sizing, scales with font-size
const SIZES: Record<ButtonSize, { fontSize: string }> = {
  xs: { fontSize: '11px' },
  s:  { fontSize: '13px' },
  m:  { fontSize: '14px' },
  l:  { fontSize: '16px' },
  xl: { fontSize: '18px' },
};

function buildCSS(color: string, textColor: string, position: string): string {
  const bg = isValidHex(color) ? color : '#25D366';
  const fg = isValidHex(textColor) ? textColor : '#FFFFFF';
  const side = position === 'bottom-left' ? 'left' : 'right';

  let sizeRules = '';
  for (const [key, val] of Object.entries(SIZES)) {
    sizeRules += `
.atom-wa-btn--${key} { font-size: ${val.fontSize}; }`;
  }

  return `
/* -- Base: grid layout for bg layer -- */
.atom-wa-btn {
  color: ${fg};
  -webkit-user-select: none;
  user-select: none;
  background-color: transparent;
  outline-style: none;
  padding: 0;
  border: none;
  line-height: 1;
  text-decoration: none;
  display: inline-grid;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
}

/* -- Focus ring (pseudo, outside bg) -- */
.atom-wa-btn::after {
  content: '';
  display: block;
  position: absolute;
  inset: -2px;
  border-radius: 0.75em;
  transition: box-shadow 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  pointer-events: none;
  z-index: 1;
}
.atom-wa-btn:focus-visible::after {
  box-shadow: 0 0 0 2px ${bg};
}

/* -- Background layer -- */
.atom-wa-btn__bg {
  background-color: ${bg};
  border-radius: 0.625em;
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  transition: background-color 0.3s cubic-bezier(0, 0, 0.2, 1);
}
.atom-wa-btn:hover .atom-wa-btn__bg {
  background-color: ${darkenHex(bg, 0.12)};
}
.atom-wa-btn:active:not([aria-busy="true"]) .atom-wa-btn__bg {
  background-color: ${darkenHex(bg, 0.22)};
}

/* -- Inner: content container with overflow clip -- */
.atom-wa-btn__inner {
  pointer-events: none;
  gap: 0.375em;
  padding: 0.75em 0.75em 0.75em 1em;
  z-index: 1;
  border-radius: 0.625em;
  overflow: clip;
  grid-area: 1 / 1;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
}

/* -- Icon -- */
.atom-wa-btn__icon {
  width: 0.875em;
  height: 0.875em;
  flex: none;
}
.atom-wa-btn__icon svg {
  width: 100%;
  height: 100%;
}

/* -- Label -- */
.atom-wa-btn__label {
  flex: none;
  white-space: nowrap;
}

${sizeRules}

/* -- Variant: pill (fixed, floating) -- */
.atom-wa-btn--pill {
  position: fixed;
  ${side}: 20px;
  bottom: 20px;
  z-index: 9999;
}
.atom-wa-btn--pill .atom-wa-btn__bg {
  box-shadow: 0 4px 14px rgba(0,0,0,0.16);
}
.atom-wa-btn--pill:hover .atom-wa-btn__bg {
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

/* -- Variant: icon (fixed, floating, circle, icon-only) -- */
.atom-wa-btn--icon {
  position: fixed;
  ${side}: 20px;
  bottom: 20px;
  z-index: 9999;
}
.atom-wa-btn--icon .atom-wa-btn__bg {
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.16);
}
.atom-wa-btn--icon:hover .atom-wa-btn__bg {
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}
.atom-wa-btn--icon .atom-wa-btn__inner {
  border-radius: 999px;
}
.atom-wa-btn--icon .atom-wa-btn__inner {
  padding: 0.75em;
}
.atom-wa-btn--icon .atom-wa-btn__label,
.atom-wa-btn--icon .atom-wa-btn__icon.is--left {
  display: none;
}

/* -- Variant: inline (static) -- */
.atom-wa-btn--inline {
  position: static;
  z-index: auto;
}

/* ================================================================
   ANIMATED — icon slide (button-009 pattern)
   Default: [icon-left hidden] [text] [icon-right visible]
   Hover:   [icon-left slides in] [text shifts] [icon-right slides out]
   ================================================================ */

/* -- Not animated: static, no transitions -- */
.atom-wa-btn:not(.atom-wa-btn--animated) .atom-wa-btn__icon.is--left {
  display: none;
}

/* -- Animated: click scale -- */
.atom-wa-btn--animated {
  transition: scale 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.atom-wa-btn--animated:active:not([aria-busy="true"]) {
  scale: 0.955 0.925;
}

/* -- Animated: icon + label transitions -- */
.atom-wa-btn--animated .atom-wa-btn__icon {
  transition: translate 0.5s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.15s ease-out;
}
.atom-wa-btn--animated .atom-wa-btn__label {
  transition: translate 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

/* Left icon: hidden, offset to the left */
.atom-wa-btn--animated .atom-wa-btn__icon.is--left {
  position: absolute;
  left: 1em;
  opacity: 0;
  translate: -1.5em 0 0;
}

/* Right icon: visible, in place */
.atom-wa-btn--animated .atom-wa-btn__icon.is--right {
  opacity: 1;
  translate: 0 0 0;
}

/* -- Hover: slide icons + shift text -- */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .atom-wa-btn--animated:is(:hover, :focus-visible) .atom-wa-btn__label,
  [data-hover]:is(:hover, :focus-visible) .atom-wa-btn--animated .atom-wa-btn__label {
    translate: calc(0.875em + 0.375em + 0.75em - 1em) 0 0;
    transition: translate 0.5s 0.075s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .atom-wa-btn--animated:is(:hover, :focus-visible) .atom-wa-btn__icon.is--left,
  [data-hover]:is(:hover, :focus-visible) .atom-wa-btn--animated .atom-wa-btn__icon.is--left {
    translate: 0 0 0;
    opacity: 1;
    transition: translate 0.5s 0.075s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.15s 0.075s ease-out;
  }

  .atom-wa-btn--animated:is(:hover, :focus-visible) .atom-wa-btn__icon.is--right,
  [data-hover]:is(:hover, :focus-visible) .atom-wa-btn--animated .atom-wa-btn__icon.is--right {
    translate: 1.5em 0 0;
    opacity: 0;
    transition: translate 0.5s 0.05s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.15s 0.075s ease-out;
  }
}

/* -- Responsive: pill collapses to icon on mobile -- */
@media (max-width: 480px) {
  .atom-wa-btn--pill .atom-wa-btn__label { display: none; }
  .atom-wa-btn--pill .atom-wa-btn__icon.is--left { display: none; }
  .atom-wa-btn--pill .atom-wa-btn__inner { padding: 0.75em; }
  .atom-wa-btn--pill .atom-wa-btn__bg { border-radius: 999px; }
}

/* -- Reduced motion -- */
@media (prefers-reduced-motion: reduce) {
  .atom-wa-btn,
  .atom-wa-btn .atom-wa-btn__icon,
  .atom-wa-btn .atom-wa-btn__label { transition-duration: 0ms !important; }
  .atom-wa-btn--animated:active { scale: 1; }
}
`;
}

function darkenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.round(((num >> 16) & 0xFF) * (1 - amount)));
  const g = Math.max(0, Math.round(((num >> 8) & 0xFF) * (1 - amount)));
  const b = Math.max(0, Math.round((num & 0xFF) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function injectStyles(config: WhatsAppButtonConfig): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = buildCSS(
    config.color!,
    config.textColor!,
    config.position!,
  );
  document.head.appendChild(style);
}

export function renderButton(
  config: WhatsAppButtonConfig,
  onClick: (btn: HTMLButtonElement) => void,
  anchor?: HTMLElement,
): HTMLButtonElement {
  injectStyles(config);

  const variant = config.variant || 'inline';
  const size = config.size || 'm';
  const animated = config.animated !== false;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `atom-wa-btn atom-wa-btn--${variant} atom-wa-btn--${size}`;
  if (animated) btn.classList.add('atom-wa-btn--animated');
  btn.setAttribute('aria-label', config.label!);

  // Inner container (overflow: clip for slide animation)
  const inner = document.createElement('span');
  inner.className = 'atom-wa-btn__inner';

  if (animated && variant !== 'icon') {
    // Left icon: slides in on hover
    const iconLeft = document.createElement('span');
    iconLeft.className = 'atom-wa-btn__icon is--left';
    iconLeft.innerHTML = WHATSAPP_ICON;
    inner.appendChild(iconLeft);
  }

  // Label
  if (variant !== 'icon') {
    const labelSpan = document.createElement('span');
    labelSpan.className = 'atom-wa-btn__label';
    labelSpan.textContent = config.label!;
    inner.appendChild(labelSpan);
  }

  // Right icon (or only icon for non-animated / icon variant)
  const iconRight = document.createElement('span');
  iconRight.className = `atom-wa-btn__icon${animated && variant !== 'icon' ? ' is--right' : ''}`;
  iconRight.innerHTML = WHATSAPP_ICON;
  inner.appendChild(iconRight);

  btn.appendChild(inner);

  // Background layer
  const bg = document.createElement('span');
  bg.className = 'atom-wa-btn__bg';
  btn.appendChild(bg);

  btn.addEventListener('click', () => onClick(btn));

  if (variant === 'inline' && anchor) {
    anchor.insertAdjacentElement('afterend', btn);
  } else {
    document.body.appendChild(btn);
  }

  return btn;
}
