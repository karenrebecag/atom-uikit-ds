/**
 * La puerta cambió de sentido: ya existe endpoint real, así que ahora lo que vigila el
 * test es que el placeholder NO llegue a un build.
 *
 * Se clava el host, no solo el booleano: `ENDPOINT_IS_PLACEHOLDER` se deriva de comparar
 * contra la constante del mismo módulo, así que editar el placeholder in situ dejaría el
 * flag mintiendo. El host reservado `.invalid` (RFC 2606) es lo que no puede resolver.
 */
import { describe, expect, it } from 'vitest';
import { ENDPOINT_IS_PLACEHOLDER, FORMS_ENDPOINT } from '../src/transport/endpoint';

describe('FORMS_ENDPOINT', () => {
  it('no es el placeholder', () => {
    expect(ENDPOINT_IS_PLACEHOLDER).toBe(false);
    expect(FORMS_ENDPOINT).not.toContain('.invalid');
  });

  it('es un subdominio propio bajo https', () => {
    const url = new URL(FORMS_ENDPOINT);
    expect(url.protocol).toBe('https:');
    // Subdominio propio y no la URL del proyecto en Vercel: la constante viaja horneada
    // en un bundle versionado, así que mudarse de plataforma debe ser un CNAME.
    expect(url.hostname).toBe('forms.atomchat.io');
    expect(url.hostname.endsWith('.vercel.app')).toBe(false);
    expect(url.pathname).toBe('/api/submit');
  });
});
