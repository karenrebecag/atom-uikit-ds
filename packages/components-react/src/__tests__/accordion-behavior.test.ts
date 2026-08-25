/**
 * Contrato de initAccordion (packages/animations/src/accordion.ts).
 *
 * Vive aqui, y no en packages/animations, por el mismo motivo que
 * animations-motion-contract: este package ya tiene la infra vitest+jsdom.
 *
 * Lo que se protege:
 *   - el estado esta SOLO en aria-expanded, nunca en una clase BEM
 *   - un accordion es navegable por teclado aunque Webflow degrade el <button>
 *   - cleanup deja el DOM como estaba
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { initAccordion, STATES_WRITTEN_AS_CLASSES } from '../../../animations/src/accordion';

type Cleanup = () => void;

let cleanup: Cleanup | null = null;

/** `triggerTag` simula lo que hace el constructor de Webflow al pegar markup. */
function mount(opts: { single?: boolean; triggerTag?: string; openFirst?: boolean } = {}) {
  const { single = false, triggerTag = 'button', openFirst = false } = opts;

  document.body.innerHTML = `
    <div class="ds-accordion" data-accordion ${single ? 'data-accordion-single="true"' : ''}>
      <ul>
        ${[0, 1, 2]
          .map(
            (i) => `
        <li class="ds-accordion__item" data-accordion-item ${
          openFirst && i === 0 ? 'data-accordion-open' : ''
        }>
          <h3>
            <${triggerTag} class="ds-accordion__trigger" data-accordion-trigger>
              <span>Pregunta ${i}</span>
              <span class="ds-accordion__chevron"></span>
            </${triggerTag}>
          </h3>
          <div class="ds-accordion__content-wrapper" data-accordion-panel>
            <div class="ds-accordion__content">
              <div class="ds-accordion__content-inner">Respuesta ${i}</div>
            </div>
          </div>
        </li>`,
          )
          .join('')}
      </ul>
    </div>`;

  cleanup = initAccordion();
}

const triggers = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-accordion-trigger]'));
const panels = () => Array.from(document.querySelectorAll<HTMLElement>('[data-accordion-panel]'));
const openState = () => triggers().map((t) => t.getAttribute('aria-expanded'));

beforeEach(() => {
  cleanup = null;
});

afterEach(() => {
  cleanup?.();
  document.body.innerHTML = '';
});

describe('initAccordion', () => {
  it('arranca todo cerrado y abre al hacer clic', () => {
    mount();
    expect(openState()).toEqual(['false', 'false', 'false']);

    triggers()[1].click();
    expect(openState()).toEqual(['false', 'true', 'false']);
    expect(panels()[1].getAttribute('aria-hidden')).toBe('false');
  });

  it('el segundo clic vuelve a cerrar', () => {
    mount();
    triggers()[0].click();
    triggers()[0].click();
    expect(openState()).toEqual(['false', 'false', 'false']);
    expect(panels()[0].getAttribute('aria-hidden')).toBe('true');
  });

  it('data-accordion-open nace abierto', () => {
    mount({ openFirst: true });
    expect(openState()).toEqual(['true', 'false', 'false']);
  });

  it('sin data-accordion-single admite varios abiertos a la vez', () => {
    mount();
    triggers()[0].click();
    triggers()[2].click();
    expect(openState()).toEqual(['true', 'false', 'true']);
  });

  it('con data-accordion-single abrir uno cierra a los hermanos', () => {
    mount({ single: true });
    triggers()[0].click();
    triggers()[2].click();
    expect(openState()).toEqual(['false', 'false', 'true']);
  });

  /**
   * El bug que este gate previene: un accordion que solo existe para el raton.
   * Webflow convierte <button> en otras etiquetas al pegar markup, y un <div>
   * ni recibe foco ni dispara clic con Enter.
   */
  it('un trigger que no es <button> se vuelve enfocable y responde a teclado', () => {
    mount({ triggerTag: 'div' });
    const t = triggers()[0];
    expect(t.getAttribute('tabindex')).toBe('0');
    expect(t.getAttribute('role')).toBe('button');

    t.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(openState()[0]).toBe('true');

    t.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(openState()[0]).toBe('false');
  });

  it('un <button> nativo no recibe tabindex ni role postizos', () => {
    mount();
    const t = triggers()[0];
    expect(t.hasAttribute('tabindex')).toBe(false);
    expect(t.hasAttribute('role')).toBe(false);
  });

  it('empareja trigger y panel por id para el lector de pantalla', () => {
    mount();
    triggers().forEach((t, i) => {
      const panel = panels()[i];
      expect(t.getAttribute('aria-controls')).toBe(panel.id);
      expect(panel.getAttribute('aria-labelledby')).toBe(t.id);
      expect(panel.getAttribute('role')).toBe('region');
    });
  });

  /**
   * Regla del DS: el estado va en atributos, no en clases BEM — esas son del
   * canal de pintura. Si un dia alguien anade classList.add('...--open'),
   * habria dos fuentes de verdad que se pueden desincronizar.
   */
  it('no escribe ninguna clase de estado', () => {
    expect(STATES_WRITTEN_AS_CLASSES).toBe(false);
    mount();
    const before = triggers().map((t) => t.className);
    const itemsBefore = Array.from(document.querySelectorAll('[data-accordion-item]')).map(
      (i) => i.className,
    );

    triggers()[0].click();

    expect(triggers().map((t) => t.className)).toEqual(before);
    expect(
      Array.from(document.querySelectorAll('[data-accordion-item]')).map((i) => i.className),
    ).toEqual(itemsBefore);
  });

  it('cleanup desactiva el toggle y retira los atributos postizos', () => {
    mount({ triggerTag: 'div' });
    cleanup?.();
    cleanup = null;

    const t = triggers()[0];
    expect(t.hasAttribute('tabindex')).toBe(false);
    expect(t.hasAttribute('role')).toBe(false);

    t.click();
    expect(openState()[0]).toBe('false');
  });

  /**
   * El bug que este gate previene, y que llego a produccion: el host llamo a
   * initAccordion a nivel SITIO y a nivel PAGINA. Dos listeners sobre la misma
   * raiz — el primero abre, el segundo vuelve a cerrar — y el accordion parece
   * muerto sin ningun error en consola.
   */
  it('llamarlo dos veces no duplica listeners', () => {
    mount();
    const second = initAccordion();

    triggers()[0].click();
    expect(openState()[0]).toBe('true');

    second();
  });

  it('tras el cleanup se puede volver a enganchar', () => {
    mount();
    cleanup?.();
    cleanup = initAccordion();

    triggers()[0].click();
    expect(openState()[0]).toBe('true');
  });

  it('un accordion sin items no revienta', () => {
    document.body.innerHTML = '<div data-accordion></div>';
    expect(() => {
      cleanup = initAccordion();
    }).not.toThrow();
  });
});

/**
 * El CSS es quien abre el panel; el behavior solo escribe aria-expanded. Si el
 * selector no alcanza al panel, el accordion queda mudo: alterna el atributo y
 * no pasa nada, sin error en consola.
 *
 * Esto ya ocurrio en atomchat.io. La pregunta va dentro de un <h3> (es el
 * marcado accesible correcto), y con eso el trigger deja de ser HERMANO del
 * panel, asi que la regla `~` no podia alcanzarlo.
 */
describe('contrato del CSS que abre el panel', () => {
  const css = readFileSync(
    join(process.cwd(), '../css/src/components/layout/accordion.css'),
    'utf8',
  );

  /**
   * La familia tiene que DECLARARSE. Con `inherit` el componente depende de que
   * el host haya tipografiado el body, y hay hosts que no lo hacen: la FAQ sale
   * en la fuente del sistema dentro de un sitio tipografiado, sin que nada
   * falle. Paso en atomchat.io.
   */
  it('declara la familia por token en vez de heredarla', () => {
    for (const sel of ['.accordion__trigger', '.accordion__content-inner']) {
      const rule = css.slice(css.indexOf(sel + ' {'));
      const body = rule.slice(0, rule.indexOf('}'));
      expect(body).toMatch(/font-family:\s*var\(--font-family-sans/);
    }
  });

  /** Cero literales: el contrato del DS prohibe valores a pelo en el CSS. */
  it('no deja tamanos ni interlineados a pelo', () => {
    const decls = css.match(/(?:font-size|line-height):\s*[^;]+/g) ?? [];
    const literales = decls.filter((d) => !d.includes('var(') && !d.includes('inherit'));
    expect(literales).toEqual([]);
  });

  it('abre cuando el trigger es hermano del panel', () => {
    expect(css).toMatch(
      /\.accordion__trigger\[aria-expanded='true'\]\s*~\s*\.accordion__content-wrapper/,
    );
  });

  it('abre tambien cuando el trigger va anidado en un heading', () => {
    expect(css).toMatch(
      /\.accordion__item:has\(\.accordion__trigger\[aria-expanded='true'\]\)\s*\.accordion__content-wrapper/,
    );
  });
});
