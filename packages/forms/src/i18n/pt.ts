/**
 * Diccionario portugués (Brasil). Gemelo de `atom-forms-api/lib/messages.ts` en
 * `validation`.
 *
 * OJO con `privacyUrl`: en pt el aviso NO es una traducción del español, es otro
 * documento por LGPD. Mientras no exista la versión pt publicada, apunta al español
 * — y eso es una deuda legal, no un detalle de copy.
 */
import type { Dict } from './index';

export const pt: Dict = {
  labels: {
    nombre: 'Nome e sobrenome',
    email: 'E-mail corporativo',
    whatsapp: 'WhatsApp',
    empresa: 'Empresa',
    cargo: 'Cargo',
    pais: 'País',
    leads_mensuales: 'Leads mensais por WhatsApp',
    objetivo: 'O que você quer melhorar no WhatsApp da sua empresa?',
    sitio_web: 'Site',
    aceptacionPrefijo: 'Li e aceito a ',
    aceptacionEnlace: 'política de privacidade',
  },
  placeholders: {
    nombre: 'Como aparece no seu documento',
    email: 'nome@suaempresa.com',
    whatsapp: '+55 11 91234 5678',
    empresa: 'Nome da sua empresa',
    sitio_web: 'suaempresa.com',
  },
  selectPlaceholder: 'Selecione uma opção',
  opcional: 'opcional',
  privacyUrl: 'https://atomchat.io/legal/politica-de-privacidad',
  options: {
    cargo: {
      marketing: 'Marketing',
      ventas: 'Vendas',
      direccion: 'Diretoria ou C-level',
      operaciones: 'Operações ou atendimento',
      ti: 'Tecnologia',
      otro: 'Outro',
    },
    pais: {
      MX: 'México', CO: 'Colômbia', PE: 'Peru', CL: 'Chile', AR: 'Argentina',
      EC: 'Equador', BO: 'Bolívia', UY: 'Uruguai', PY: 'Paraguai', VE: 'Venezuela',
      CR: 'Costa Rica', PA: 'Panamá', GT: 'Guatemala', SV: 'El Salvador',
      HN: 'Honduras', NI: 'Nicarágua', DO: 'República Dominicana', PR: 'Porto Rico',
      BR: 'Brasil', ES: 'Espanha', US: 'Estados Unidos', otro: 'Outro',
    },
    leads_mensuales: {
      'menos-100': 'Menos de 100',
      '100-500': 'Entre 100 e 500',
      '500-2000': 'Entre 500 e 2.000',
      '2000-10000': 'Entre 2.000 e 10.000',
      'mas-10000': 'Mais de 10.000',
    },
    objetivo: {
      'responder-rapido': 'Responder rápido e vender mais',
      'atender-mas': 'Atender mais sem ampliar a equipe',
      'filtrar-intencion': 'Filtrar leads com intenção real',
      'recuperar-leads': 'Recuperar leads que esfriam',
      'convertir-chats': 'Converter mais conversas em vendas',
      'conectar-crm': 'Conectar o WhatsApp ao meu CRM',
      'atribucion-campanas': 'Saber quais campanhas geram vendas',
      otro: 'Outro',
    },
  },
  validation: {
    nombre: 'Informe seu nome e sobrenome.',
    email: 'E-mail inválido.',
    whatsapp: 'Número de WhatsApp inválido. Inclua o código do país.',
    empresa: 'Informe o nome da sua empresa.',
    cargo: 'Selecione seu cargo.',
    pais: 'Selecione seu país.',
    leads_mensuales: 'Selecione uma faixa.',
    objetivo: 'Selecione uma opção.',
    sitio_web: 'Site inválido.',
    aceptacion: 'Você precisa aceitar a política de privacidade para continuar.',
  },
  errors: {
    connection: 'Erro de conexão. Tente novamente.',
    generic: 'Não conseguimos enviar o formulário. Revise os dados.',
  },
  submit: 'Quero que entrem em contato',
  thankYou: {
    title: 'Recebemos seus dados',
    message: 'Entraremos em contato pelo WhatsApp em breve, no número informado.',
  },
};
