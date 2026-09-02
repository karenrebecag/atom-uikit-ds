/**
 * Tipo Dict y resolución de idioma desde data-atom-form-lang. Sin fallback mudo:
 * un idioma desconocido cae a es y lo registra.
 */
import type { Cargo, LeadsMensuales, Objetivo, Pais } from '../data/options';
import { en } from './en';
import { es } from './es';
import { pt } from './pt';

export const LANGS = ['es', 'pt', 'en'] as const;

export type Lang = (typeof LANGS)[number];

export interface Dict {
  labels: {
    nombre: string;
    email: string;
    whatsapp: string;
    empresa: string;
    cargo: string;
    pais: string;
    leads_mensuales: string;
    objetivo: string;
    sitio_web: string;
    /** Texto antes del enlace legal. El enlace lo compone el layout, no un HTML crudo. */
    aceptacionPrefijo: string;
    /** Texto del enlace legal. */
    aceptacionEnlace: string;
  };
  placeholders: {
    nombre: string;
    email: string;
    whatsapp: string;
    empresa: string;
    sitio_web: string;
  };
  /** Opción vacía inicial de todo select. Obliga a elegir en vez de aceptar el default. */
  selectPlaceholder: string;
  /** Marca de campo no obligatorio. Se marca lo opcional, no lo requerido: es uno solo. */
  opcional: string;
  /**
   * Aviso de privacidad por idioma. En pt es OTRO documento (LGPD), no una traducción.
   * `en` apunta al español mientras no exista la versión en inglés.
   */
  privacyUrl: string;
  options: {
    cargo: Record<Cargo, string>;
    pais: Record<Pais, string>;
    leads_mensuales: Record<LeadsMensuales, string>;
    objetivo: Record<Objetivo, string>;
  };
  validation: {
    nombre: string;
    email: string;
    whatsapp: string;
    empresa: string;
    cargo: string;
    pais: string;
    leads_mensuales: string;
    objetivo: string;
    sitio_web: string;
    aceptacion: string;
  };
  errors: {
    connection: string;
    generic: string;
  };
  submit: string;
  thankYou: {
    title: string;
    message: string;
  };
}

export const DICTS: Record<Lang, Dict> = {
  es,
  pt,
  en,
};

export type LangResolution = {
  lang: Lang;
  recognized: boolean;
};

export function isLang(value: string): value is Lang {
  for (const lang of LANGS) {
    if (lang === value) {
      return true;
    }
  }
  return false;
}

export function resolveLang(raw: string | undefined): LangResolution {
  const normalized = (raw ?? '').trim().toLowerCase();
  const primary = normalized.split(/[-_]/)[0] ?? '';
  if (isLang(primary)) {
    return { lang: primary, recognized: true };
  }
  // Why: 04 pide registrar el fallback; 05 prohibe logs en producto y no hay logger.
  return { lang: 'es', recognized: false };
}

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}
