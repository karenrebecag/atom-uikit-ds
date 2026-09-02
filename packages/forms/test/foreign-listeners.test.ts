/**
 * Webflow convierte todo <form> en su Form Block y engancha el submit para mandar el
 * envio a su propio store. Reemplazar el nodo por un clon descarta ese listener.
 *
 * Un lead que llega a dos destinos no es un detalle cosmetico: es el mismo dato personal
 * duplicado en un sistema que nadie declaro y que no aparece en la politica de privacidad.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { detachForeignListeners } from '../src/core/dom';

function montarForm(): HTMLFormElement {
  document.body.innerHTML = '<form data-atom-form="lead-basic"><input name="nombre" /></form>';
  const form = document.querySelector('form');
  if (form === null) {
    throw new Error('el fixture necesita un <form>');
  }
  return form;
}

describe('detachForeignListeners', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('descarta un listener de submit ya registrado', () => {
    const form = montarForm();
    const ajeno = vi.fn();
    form.addEventListener('submit', ajeno);

    const limpio = detachForeignListeners(form);
    limpio.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(ajeno).not.toHaveBeenCalled();
  });

  it('el clon queda en el documento, en el mismo sitio, y el original fuera', () => {
    const form = montarForm();
    const limpio = detachForeignListeners(form);

    expect(limpio).not.toBe(form);
    expect(limpio.isConnected).toBe(true);
    expect(form.isConnected).toBe(false);
    expect(document.querySelectorAll('form')).toHaveLength(1);
  });

  it('conserva atributos, campos y marcado interno', () => {
    const form = montarForm();
    const limpio = detachForeignListeners(form);

    expect(limpio.getAttribute('data-atom-form')).toBe('lead-basic');
    expect(limpio.querySelector('input[name="nombre"]')).not.toBeNull();
  });

  it('un listener registrado DESPUES del clon si corre', () => {
    const form = montarForm();
    const limpio = detachForeignListeners(form);
    const propio = vi.fn();
    limpio.addEventListener('submit', propio);

    limpio.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(propio).toHaveBeenCalledTimes(1);
  });
});

describe('el wrapper de Webflow queda desarmado', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('quita la clase w-form para que el modulo de Webflow no encuentre el formulario', () => {
    document.body.innerHTML =
      '<div class="w-form lp-form__form"><form data-atom-form="lead-basic"></form></div>';
    const form = document.querySelector('form');
    if (form === null) {
      throw new Error('el fixture necesita un <form>');
    }

    const limpio = detachForeignListeners(form);

    expect(document.querySelector('.w-form')).toBeNull();
    // Las demas clases del consumidor sobreviven: solo se desarma el hook de Webflow.
    expect(limpio.parentElement?.classList.contains('lp-form__form')).toBe(true);
  });

  it('no falla cuando el formulario no esta dentro de un wrapper de Webflow', () => {
    document.body.innerHTML = '<form data-atom-form="lead-basic"></form>';
    const form = document.querySelector('form');
    if (form === null) {
      throw new Error('el fixture necesita un <form>');
    }

    expect(() => detachForeignListeners(form)).not.toThrow();
  });
});
