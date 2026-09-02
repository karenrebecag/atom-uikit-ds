/**
 * Diccionario español. Etiquetas, opciones de select, mensajes de error, thank-you.
 * Los mensajes de `validation` son gemelos de los de `atom-forms-api/lib/messages.ts`.
 */
import type { Dict } from './index';

export const es: Dict = {
  labels: {
    nombre: 'Nombre y apellido',
    email: 'Correo corporativo',
    whatsapp: 'WhatsApp',
    empresa: 'Empresa',
    cargo: 'Cargo',
    pais: 'País',
    leads_mensuales: 'Leads mensuales por WhatsApp',
    objetivo: '¿Qué quieres mejorar en WhatsApp de tu empresa?',
    sitio_web: 'Sitio web',
    aceptacionPrefijo: 'He leído y acepto la ',
    aceptacionEnlace: 'política de privacidad',
  },
  placeholders: {
    nombre: 'Como aparece en tu credencial',
    email: 'nombre@tuempresa.com',
    whatsapp: '+52 55 1234 5678',
    empresa: 'Nombre de tu empresa',
    sitio_web: 'tuempresa.com',
  },
  selectPlaceholder: 'Selecciona una opción',
  opcional: 'opcional',
  privacyUrl: 'https://atomchat.io/legal/politica-de-privacidad',
  options: {
    cargo: {
      marketing: 'Marketing',
      ventas: 'Ventas',
      direccion: 'Dirección o C-level',
      operaciones: 'Operaciones o servicio al cliente',
      ti: 'Tecnología',
      otro: 'Otro',
    },
    pais: {
      MX: 'México', CO: 'Colombia', PE: 'Perú', CL: 'Chile', AR: 'Argentina',
      EC: 'Ecuador', BO: 'Bolivia', UY: 'Uruguay', PY: 'Paraguay', VE: 'Venezuela',
      CR: 'Costa Rica', PA: 'Panamá', GT: 'Guatemala', SV: 'El Salvador',
      HN: 'Honduras', NI: 'Nicaragua', DO: 'República Dominicana', PR: 'Puerto Rico',
      BR: 'Brasil', ES: 'España', US: 'Estados Unidos', otro: 'Otro',
    },
    leads_mensuales: {
      'menos-100': 'Menos de 100',
      '100-500': 'Entre 100 y 500',
      '500-2000': 'Entre 500 y 2.000',
      '2000-10000': 'Entre 2.000 y 10.000',
      'mas-10000': 'Más de 10.000',
    },
    objetivo: {
      'responder-rapido': 'Responder rápido y vender más',
      'atender-mas': 'Atender más sin ampliar el equipo',
      'filtrar-intencion': 'Filtrar leads con intención real',
      'recuperar-leads': 'Recuperar leads que se enfrían',
      'convertir-chats': 'Convertir más chats en ventas',
      'conectar-crm': 'Conectar WhatsApp con mi CRM',
      'atribucion-campanas': 'Saber qué campañas generan ventas',
      otro: 'Otro',
    },
  },
  validation: {
    nombre: 'Ingresa tu nombre y apellido.',
    email: 'Correo no válido.',
    whatsapp: 'Número de WhatsApp no válido. Incluye el código de país.',
    empresa: 'Ingresa el nombre de tu empresa.',
    cargo: 'Selecciona tu cargo.',
    pais: 'Selecciona tu país.',
    leads_mensuales: 'Selecciona un rango.',
    objetivo: 'Selecciona una opción.',
    sitio_web: 'Sitio web no válido.',
    aceptacion: 'Debes aceptar la política de privacidad para continuar.',
  },
  errors: {
    connection: 'Error de conexión. Intenta de nuevo.',
    generic: 'No pudimos enviar el formulario. Revisa los datos.',
  },
  submit: 'Quiero que me contacten',
  thankYou: {
    title: 'Recibimos tus datos',
    message: 'Te escribimos por WhatsApp en breve, al número que nos diste.',
  },
};
