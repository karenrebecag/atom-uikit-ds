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
