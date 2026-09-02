/**
 * Hooks de analítica: GA4, GTM, Meta. Corren SOLO tras éxito confirmado, en
 * paralelo y aislados con allSettled. Cero campos de negocio de otro cliente.
 */
import type { IntegrationHook } from '../core/types';

type AnalyticsWindow = Window & {
  gtag?: (command: 'event', eventName: string, params?: Record<string, unknown>) => void;
  fbq?: (command: 'track', eventName: string, params?: Record<string, unknown>) => void;
  dataLayer?: Array<Record<string, unknown>>;
};

function analytics(): AnalyticsWindow {
  return window;
}

export const ga4Lead: IntegrationHook = ({ response }) => {
  const params: Record<string, unknown> = {};
  if (response.ref !== undefined) {
    params.event_id = response.ref;
  }
  analytics().gtag?.('event', 'generate_lead', params);
};

export const gtmLead: IntegrationHook = ({ response }) => {
  const event: Record<string, unknown> = { event: 'generate_lead' };
  if (response.ref !== undefined) {
    event.ref = response.ref;
  }
  analytics().dataLayer?.push(event);
};

export const metaLead: IntegrationHook = () => {
  analytics().fbq?.('track', 'Lead');
};
