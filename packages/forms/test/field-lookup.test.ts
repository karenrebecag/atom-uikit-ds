/**
 * El grupo y su hueco de error se localizan por atributo, con las clases del DS como
 * respaldo.
 *
 * Motivo: Webflow descarta toda clase para la que no tenga regla CSS propia. Un consumidor
 * puede quedarse sin `.field` sin enterarse y ahi los errores dejarian de pintarse en
 * silencio, que es el peor modo de fallo de un formulario: el usuario no sabe que corregir.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { setFieldInvalid, clearFieldInvalid } from '../src/core/dom';
import type { FieldDef } from '../src/core/types';

const def: FieldDef = { kind: 'text', schemaKey: 'nombre', name: 'nombre', required: true };

function montar(html: string): HTMLFormElement {
  document.body.innerHTML = `<form>${html}</form>`;
  const form = document.querySelector('form');
  if (form === null) {
    throw new Error('el fixture necesita un <form>');
  }
  return form;
}

const PorAtributo = `
  <div data-atom-field-group>
    <input data-atom-field="nombre" name="nombre" />
    <p data-atom-field-error></p>
  </div>`;

const PorClase = `
  <div class="field">
    <input data-atom-field="nombre" name="nombre" />
    <p class="field__error"></p>
  </div>`;

describe('localizacion del grupo y del error', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('funciona con atributos, sin ninguna clase del DS', () => {
    const form = montar(PorAtributo);
    setFieldInvalid(form, def, 'Ingresa tu nombre y apellido.');

    const grupo = form.querySelector('[data-atom-field-group]');
    expect(grupo?.hasAttribute('data-invalid')).toBe(true);
    expect(form.querySelector('[data-atom-field-error]')?.textContent).toBe(
      'Ingresa tu nombre y apellido.',
    );
  });

  it('sigue funcionando con las clases del DS, sin atributos', () => {
    const form = montar(PorClase);
    setFieldInvalid(form, def, 'Correo no valido.');

    expect(form.querySelector('.field')?.hasAttribute('data-invalid')).toBe(true);
    expect(form.querySelector('.field__error')?.textContent).toBe('Correo no valido.');
  });

  it('limpia el estado en ambas anatomias', () => {
    for (const html of [PorAtributo, PorClase]) {
      const form = montar(html);
      setFieldInvalid(form, def, 'error');
      clearFieldInvalid(form, def);

      const grupo = form.querySelector('[data-atom-field-group], .field');
      expect(grupo?.hasAttribute('data-invalid')).toBe(false);
      expect(form.querySelector('[data-atom-field-error], .field__error')?.textContent).toBe('');
    }
  });
});
