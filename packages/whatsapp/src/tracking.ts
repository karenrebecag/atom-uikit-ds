import type { TrackingData } from './config';
import { generateChatId } from './chat-id';

export function detectDevice(): string {
  try {
    const urlDevice = new URLSearchParams(window.location.search).get('device');
    if (urlDevice) {
      const d = urlDevice.toLowerCase();
      if (d === 'mobile' || d === 'tablet' || d === 'desktop') return d;
    }
  } catch { /* ignore */ }

  const ua = navigator.userAgent || '';
  if (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return 'mobile';
  if (/ipad|android(?!.*mobile)|tablet/i.test(ua)) return 'tablet';
  if (/windows|macintosh|linux/i.test(ua) && !/mobile|android|iphone/i.test(ua)) return 'desktop';

  if (window.screen?.width) {
    return window.screen.width <= 768 ? 'mobile' : window.screen.width <= 1024 ? 'tablet' : 'desktop';
  }
  return 'unknown';
}

export function getGclid(): string | undefined {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('gclid');
    if (fromUrl) return fromUrl;

    const cookie = document.cookie
      .split(';')
      .find((c) => c.trim().startsWith('_gcl_aw='));
    return cookie?.split('.').pop() || undefined;
  } catch {
    return undefined;
  }
}

export function collectTrackingData(): TrackingData {
  const params: Record<string, string> = {};
  try {
    new URLSearchParams(window.location.search).forEach((v, k) => { params[k] = v; });
  } catch { /* ignore */ }

  const chatId = generateChatId();
  const url = window.location.origin + window.location.pathname;
  const device = detectDevice();
  const gclid = getGclid();

  return { ...params, chatId, url, device, ...(gclid ? { gclid } : {}) };
}
