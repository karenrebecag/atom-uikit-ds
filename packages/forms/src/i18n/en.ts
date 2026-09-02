/**
 * Diccionario inglés. Gemelo de `atom-forms-api/lib/messages.ts` en `validation`.
 *
 * `privacyUrl` apunta al aviso en español porque no existe versión en inglés. Se
 * cambia en cuanto se publique.
 */
import type { Dict } from './index';

export const en: Dict = {
  labels: {
    nombre: 'Full name',
    email: 'Work email',
    whatsapp: 'WhatsApp',
    empresa: 'Company',
    cargo: 'Role',
    pais: 'Country',
    leads_mensuales: 'Monthly WhatsApp leads',
    objetivo: 'What would you like to improve in your company WhatsApp?',
    sitio_web: 'Website',
    aceptacionPrefijo: 'I have read and accept the ',
    aceptacionEnlace: 'privacy policy',
  },
  placeholders: {
    nombre: 'First and last name',
    email: 'name@yourcompany.com',
    whatsapp: '+1 555 123 4567',
    empresa: 'Your company name',
    sitio_web: 'yourcompany.com',
  },
  selectPlaceholder: 'Select an option',
  opcional: 'optional',
  privacyUrl: 'https://atomchat.io/legal/politica-de-privacidad',
  options: {
    cargo: {
      marketing: 'Marketing',
      ventas: 'Sales',
      direccion: 'Executive or C-level',
      operaciones: 'Operations or customer service',
      ti: 'Technology',
      otro: 'Other',
    },
    pais: {
      MX: 'Mexico', CO: 'Colombia', PE: 'Peru', CL: 'Chile', AR: 'Argentina',
      EC: 'Ecuador', BO: 'Bolivia', UY: 'Uruguay', PY: 'Paraguay', VE: 'Venezuela',
      CR: 'Costa Rica', PA: 'Panama', GT: 'Guatemala', SV: 'El Salvador',
      HN: 'Honduras', NI: 'Nicaragua', DO: 'Dominican Republic', PR: 'Puerto Rico',
      BR: 'Brazil', ES: 'Spain', US: 'United States', otro: 'Other',
    },
    leads_mensuales: {
      'menos-100': 'Fewer than 100',
      '100-500': 'Between 100 and 500',
      '500-2000': 'Between 500 and 2,000',
      '2000-10000': 'Between 2,000 and 10,000',
      'mas-10000': 'More than 10,000',
    },
    objetivo: {
      'responder-rapido': 'Reply faster and sell more',
      'atender-mas': 'Handle more without growing the team',
      'filtrar-intencion': 'Filter leads with real intent',
      'recuperar-leads': 'Recover leads that go cold',
      'convertir-chats': 'Turn more chats into sales',
      'conectar-crm': 'Connect WhatsApp to my CRM',
      'atribucion-campanas': 'Know which campaigns drive sales',
      otro: 'Other',
    },
  },
  validation: {
    nombre: 'Enter your first and last name.',
    email: 'Invalid email address.',
    whatsapp: 'Invalid WhatsApp number. Include the country code.',
    empresa: 'Enter your company name.',
    cargo: 'Select your role.',
    pais: 'Select your country.',
    leads_mensuales: 'Select a range.',
    objetivo: 'Select an option.',
    sitio_web: 'Invalid website.',
    aceptacion: 'You must accept the privacy policy to continue.',
  },
  errors: {
    connection: 'Connection error. Please try again.',
    generic: 'We could not submit the form. Please check your details.',
  },
  submit: 'Have someone contact me',
  thankYou: {
    title: 'We got your details',
    message: 'We will reach out on WhatsApp shortly, at the number you gave us.',
  },
};
