import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef } from 'react';
import { articleToc } from '../../../../packages/layouts/src/article-toc';
import { initTableOfContents } from '../../../../packages/animations/src/table-of-contents';

/**
 * La story NO reescribe el markup: consume el mismo `html` que publica el registry,
 * lo rellena y deja que el behavior REAL genere el indice. Si el layout deja de ser
 * autosuficiente —o si el behavior deja de encontrar su contrato de data-attrs—
 * esta story lo delata.
 *
 * ScrollTrigger se sustituye por un doble minimo: en Storybook no hay GSAP, y el
 * baseline visual necesita ser determinista (un trigger real depende del scroll de
 * la pagina). El doble captura las configuraciones y dispara a mano el tramo activo.
 */
const SLOT = /\{\{([\w-]+)\}\}/g;

const CONTENT: Record<string, string> = {
  eyebrow: 'Legales',
  heading: 'Política de privacidad',
  updated: 'Última actualización: mayo de 2025',
  toc_label: 'En esta página',
  toc_levels: 'h2,h3',
  toc_offset: '80',
};

const BODY = `
  <h2>Identidad del responsable</h2>
  <p>El responsable del tratamiento de los datos personales recabados a través de este sitio es Atom, con domicilio en Ciudad de México. Cualquier solicitud relacionada con el ejercicio de derechos puede dirigirse al correo de contacto publicado en este aviso.</p>
  <h3>Información de contacto</h3>
  <p>Las solicitudes se atienden en un plazo máximo de veinte días hábiles. Si la solicitud requiere información adicional, se notificará dentro de los primeros cinco días.</p>
  <h2>Principios aplicados en el tratamiento</h2>
  <p>El tratamiento se rige por los principios de licitud, consentimiento, información, calidad, finalidad, lealtad, proporcionalidad y responsabilidad.</p>
  <ul>
    <li>Se recaban únicamente los datos necesarios para la finalidad declarada.</li>
    <li>Los datos se conservan solo mientras subsista esa finalidad.</li>
  </ul>
  <h3>Derechos del titular</h3>
  <p>El titular puede acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales en los términos previstos por la legislación aplicable.</p>
  <h2>Finalidad del tratamiento</h2>
  <p>Los datos se utilizan para prestar el servicio contratado, facturar, dar soporte y comunicar cambios relevantes en las condiciones del servicio.</p>
  <h3>Seguridad y conservación</h3>
  <p>La información se transmite cifrada y los accesos quedan registrados.</p>
  <h2>Colofón {skip}</h2>
  <p>Esta sección queda fuera del índice: lleva el marcador de omisión en su encabezado.</p>
`;

/** Doble de ScrollTrigger: registra las configuraciones y permite activar un tramo. */
interface TriggerConfig {
  onToggle?: (self: { isActive: boolean }) => void;
}

function installGsapDouble(): { restore: () => void; configs: TriggerConfig[] } {
  const host = window as typeof window & { gsap?: unknown; ScrollTrigger?: unknown };
  const previous = { gsap: host.gsap, ScrollTrigger: host.ScrollTrigger };
  const configs: TriggerConfig[] = [];

  host.gsap = { registerPlugin: () => {} };
  host.ScrollTrigger = {
    create: (config: TriggerConfig) => {
      configs.push(config);
      return { kill: () => {} };
    },
  };

  return {
    configs,
    restore: () => {
      host.gsap = previous.gsap;
      host.ScrollTrigger = previous.ScrollTrigger;
    },
  };
}

function Article({ activeIndex }: { activeIndex: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.innerHTML = articleToc.html.replace(SLOT, (_, key: string) => CONTENT[key] ?? '');
    const content = root.querySelector('[data-toc-content]');
    if (content) content.innerHTML = BODY;

    const double = installGsapDouble();
    const cleanup = initTableOfContents();
    // Pinta el tramo activo sin depender del scroll real de la pagina.
    double.configs[activeIndex]?.onToggle?.({ isActive: true });

    return () => {
      cleanup();
      double.restore();
    };
  }, [activeIndex]);

  return (
    <>
      <style>{articleToc.css}</style>
      <div ref={ref} />
    </>
  );
}

const meta: Meta = {
  title: 'Layouts/Article with TOC',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

/** Estado inicial: la primera sección activa, como al aterrizar en la página. */
export const Default: Story = { render: () => <Article activeIndex={0} /> };

/** Con el scroll dentro de una sub-sección: el rail indenta por profundidad. */
export const NestedActive: Story = { render: () => <Article activeIndex={1} /> };
