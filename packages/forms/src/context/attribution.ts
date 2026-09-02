/**
 * Arma meta.landingUrl, referrer y submittedAt. No parsea UTM.
 */
import type { RequestMeta } from '../schemas/contract';

export function collectAttribution(): RequestMeta {
  return {
    landingUrl: window.location.href,
    referrer: document.referrer,
    submittedAt: new Date().toISOString(),
  };
}
