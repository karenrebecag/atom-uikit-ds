/**
 * El landing_id y el idioma llegan desde el CMS de Webflow por CONTENIDO DE TEXTO, no
 * por atributo: Webflow no deja bindear el valor de un atributo a un campo de coleccion
 * (400: value must be a string or a binding) y las catorce landings comparten una sola
 * Collection Page, asi que el atributo tampoco puede ser fijo.
 *
 * El atributo sigue ganando cuando existe: fuera de Webflow es la via normal y no debe
 * verse afectada.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { readLandingId, readLangRaw } from '../src/core/dom';

function montar(html: string): { host: HTMLElement; form: HTMLFormElement } {
  document.body.innerHTML = html;
  const host = document.querySelector<HTMLElement>('[data-atom-form]');
  if (host === null) {
    throw new Error('el fixture necesita un [data-atom-form]');
  }
  const form = host instanceof HTMLFormElement ? host : host.querySelector('form');
  if (form === null) {
    throw new Error('el fixture necesita un <form>');
  }
  return { host, form };
}

describe('landing_id desde el CMS', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('lo lee del elemento fuente cuando no hay atributo', () => {
    const { host, form } = montar(`
      <div data-atom-form="lead-basic">
        <form>
          <span data-atom-form-landing-source hidden>atom-capacidad-latam-es-wa</span>
        </form>
      </div>`);
    expect(readLandingId(host, form)).toBe('atom-capacidad-latam-es-wa');
  });

  it('el atributo gana sobre el elemento fuente', () => {
    const { host, form } = montar(`
      <div data-atom-form="lead-basic" data-atom-form-landing="del-atributo">
        <form>
          <span data-atom-form-landing-source hidden>del-cms</span>
        </form>
      </div>`);
    expect(readLandingId(host, form)).toBe('del-atributo');
  });

  it('recorta el espacio que Webflow deja alrededor del texto bindeado', () => {
    const { host, form } = montar(`
      <div data-atom-form="lead-basic">
        <form><span data-atom-form-landing-source>
          atom-crm-latam-es-wa
        </span></form>
      </div>`);
    expect(readLandingId(host, form)).toBe('atom-crm-latam-es-wa');
  });

  it('un campo de CMS vacio deja el landing_id vacio, y el motor no envia (I7)', () => {
    const { host, form } = montar(`
      <div data-atom-form="lead-basic">
        <form><span data-atom-form-landing-source></span></form>
      </div>`);
    expect(readLandingId(host, form)).toBe('');
  });

  it('funciona cuando el host ES el form', () => {
    const { host, form } = montar(`
      <form data-atom-form="lead-basic">
        <span data-atom-form-landing-source>atom-sin-menus-latam-es-wa</span>
      </form>`);
    expect(host).toBe(form);
    expect(readLandingId(host, form)).toBe('atom-sin-menus-latam-es-wa');
  });
});

describe('idioma desde el CMS', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('lo lee del elemento fuente cuando no hay atributo', () => {
    const { host, form } = montar(`
      <div data-atom-form="lead-basic">
        <form><span data-atom-form-lang-source hidden>pt</span></form>
      </div>`);
    expect(readLangRaw(host, form)).toBe('pt');
  });

  it('el atributo gana sobre el elemento fuente', () => {
    const { host, form } = montar(`
      <div data-atom-form="lead-basic" data-atom-form-lang="en">
        <form><span data-atom-form-lang-source>pt</span></form>
      </div>`);
    expect(readLangRaw(host, form)).toBe('en');
  });

  it('sin fuente ni atributo devuelve undefined, para que resolveLang caiga a es', () => {
    const { host, form } = montar(`
      <div data-atom-form="lead-basic"><form></form></div>`);
    expect(readLangRaw(host, form)).toBeUndefined();
  });

  it('funciona cuando el host ES el form', () => {
    const { host, form } = montar(`
      <form data-atom-form="lead-basic">
        <span data-atom-form-lang-source>pt</span>
      </form>`);
    expect(readLangRaw(host, form)).toBe('pt');
  });
});
