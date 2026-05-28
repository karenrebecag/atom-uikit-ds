import type { CTA } from './config';

type Locale = 'es' | 'en' | 'pt';

const KNOWN_LOCALES: Locale[] = ['es', 'en', 'pt'];

const MESSAGES: Record<Locale, Record<CTA, string>> = {
  es: {
    agendar_demo: 'Hola, quiero agendar una demo de Atom',
    hablar_asesor: 'Hola, quiero hablar con un asesor',
    demo_5min: 'Hola, quiero una demo de 5 minutos',
    consultar_precio: 'Hola, quiero consultar precios',
    default: 'Hola, quiero mas informacion',
  },
  en: {
    agendar_demo: 'Hi, I want to book an Atom demo',
    hablar_asesor: 'Hi, I want to speak with a consultant',
    demo_5min: 'Hi, I want a 5-minute demo',
    consultar_precio: 'Hi, I want to check pricing',
    default: 'Hi, I want more information',
  },
  pt: {
    agendar_demo: 'Ola, quero agendar uma demo do Atom',
    hablar_asesor: 'Ola, quero falar com um consultor',
    demo_5min: 'Ola, quero uma demo de 5 minutos',
    consultar_precio: 'Ola, quero consultar precos',
    default: 'Ola, quero mais informacoes',
  },
};

const LABELS: Record<Locale, Record<CTA, string>> = {
  es: {
    agendar_demo: 'Agendar Demo',
    hablar_asesor: 'Hablar con Asesor',
    demo_5min: 'Demo 5 Min',
    consultar_precio: 'Consultar Precio',
    default: 'Contactanos',
  },
  en: {
    agendar_demo: 'Book A Demo',
    hablar_asesor: 'Talk to an Advisor',
    demo_5min: '5-Min Demo',
    consultar_precio: 'Check Pricing',
    default: 'Contact Us',
  },
  pt: {
    agendar_demo: 'Agendar Demo',
    hablar_asesor: 'Falar com Consultor',
    demo_5min: 'Demo 5 Min',
    consultar_precio: 'Consultar Precos',
    default: 'Fale Conosco',
  },
};

function isLocale(s: string): s is Locale {
  return KNOWN_LOCALES.includes(s as Locale);
}

export function detectLocale(): Locale {
  const seg = window.location.pathname.split('/')[1]?.toLowerCase();
  if (seg && isLocale(seg)) return seg;
  if (seg === 'pt-br') return 'pt';

  const html = document.documentElement.lang;
  if (html) {
    const code = html.split('-')[0].toLowerCase();
    if (isLocale(code)) return code;
  }

  return 'es';
}

export function getDefaultMessage(locale: Locale, cta: CTA = 'default'): string {
  const msgs = MESSAGES[locale] || MESSAGES.es;
  return msgs[cta] || msgs.default;
}

export function getDefaultLabel(locale: Locale, cta: CTA = 'default'): string {
  const lbls = LABELS[locale] || LABELS.es;
  return lbls[cta] || lbls.default;
}
