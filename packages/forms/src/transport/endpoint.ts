/**
 * LA constante del endpoint y nada más. Un archivo entero a propósito: es el único
 * punto del bundle que sabe a dónde se envía, y tiene que ser trivial de auditar.
 *
 * Es un subdominio propio, no la URL del proyecto en Vercel: esta constante viaja
 * horneada en un bundle versionado y con SRI, así que un cambio de proyecto o de
 * plataforma se resuelve con un CNAME. Una constante compilada, no.
 */

// Why: `.invalid` is reserved (RFC 2606) so a leaked placeholder cannot resolve.
const PLACEHOLDER_ENDPOINT = 'https://atom-forms.invalid/v1/submit';

export const FORMS_ENDPOINT: string = 'https://forms.atomchat.io/api/submit';

export const ENDPOINT_IS_PLACEHOLDER: boolean = FORMS_ENDPOINT === PLACEHOLDER_ENDPOINT;
