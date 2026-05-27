type Locale = 'es' | 'en' | 'pt';

const KNOWN_LOCALES: Locale[] = ['es', 'en', 'pt'];

const MESSAGES: Record<Locale, string> = {
  es: 'Hola, quiero mas informacion',
  en: 'Hi, I want more information',
  pt: 'Ola, quero mais informacoes',
};

const LABELS: Record<Locale, string> = {
  es: 'Contactanos',
  en: 'Contact Us',
  pt: 'Fale Conosco',
};

function isLocale(s: string): s is Locale {
  return KNOWN_LOCALES.includes(s as Locale);
}

export function detectLocale(): Locale {
  // 1. Exact match on first path segment
  const seg = window.location.pathname.split('/')[1]?.toLowerCase();
  if (seg && isLocale(seg)) return seg;
  if (seg === 'pt-br') return 'pt';

  // 2. HTML lang attribute
  const html = document.documentElement.lang;
  if (html) {
    const code = html.split('-')[0].toLowerCase();
    if (isLocale(code)) return code;
  }

  return 'es';
}

export function getDefaultMessage(locale: Locale): string {
  return MESSAGES[locale] || MESSAGES.es;
}

export function getDefaultLabel(locale: Locale): string {
  return LABELS[locale] || LABELS.es;
}
