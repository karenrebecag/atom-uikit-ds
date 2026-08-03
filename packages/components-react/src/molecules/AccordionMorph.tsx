import { useId, type ReactNode } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Morphing accordion — anatomia completa del organismo goo (filtro SVG, capa
 * liquida, pildoras y paneles con fondo propio). Este componente NO anima:
 * emite el contrato data-* y la interactividad la pone
 * `initAccordionMorph()` de @atom-uikit/animations (patron del DS: el
 * componente es tonto, el behavior orquesta por data-attrs).
 *
 * D5 (defaults por canal): en codigo el motion es prop editable — `animated`
 * default true; false emite data-motion-exempt y el behavior abre/cierra
 * instantaneo (disclosure funcional intacto, cero goo).
 */

export type AccordionMorphItem = {
  question: string;
  answer: ReactNode;
};

// Sin JSDoc por prop a proposito: what/how/rangos viven en meta.agent del
// registry (SSOT) y el extractor de props no soporta comentarios inline.
export type AccordionMorphProps = {
  items: AccordionMorphItem[];
  multiple?: boolean;
  startOpen?: number;
  gooStrength?: number;
  animated?: boolean;
  idBase?: string;
  className?: string;
};

const PlusIcon = () => (
  <svg
    className="accordion-morph__icon"
    data-accordion-morph-icon
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path d="M8 1V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export function AccordionMorph({
  items,
  multiple = false,
  startOpen = -1,
  gooStrength = 9,
  animated = true,
  idBase,
  className,
}: AccordionMorphProps) {
  // useId depende del ORDEN GLOBAL de renders del proceso: en el emitter del
  // registry eso hizo el artefacto no-reproducible entre maquinas (el gate de
  // deriva lo cazo en CI). idBase explicito = ids deterministas para artefactos
  // y SSR; useId queda como fallback comodo para apps React.
  const reactId = useId();
  const uid = idBase ?? reactId;

  return (
    <div
      className={cn('accordion-morph', className)}
      data-accordion-morph
      data-accordion-morph-multiple={multiple ? 'true' : undefined}
      data-accordion-morph-start-open={startOpen >= 0 ? String(startOpen) : undefined}
      data-accordion-morph-goo-strength={String(gooStrength)}
      data-motion-exempt={animated ? undefined : ''}
    >
      {/* Template del filtro goo: el behavior clona uno POR FILA para que
          transiciones concurrentes no compartan rampa de blur. */}
      <svg className="accordion-morph__filter-svg" data-accordion-morph-filter="" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id={`${uid}-goo`}
            colorInterpolationFilters="sRGB"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
          </filter>
        </defs>
      </svg>

      <div className="accordion-morph__list">
        {items.map((item, i) => {
          const triggerId = `${uid}-trigger-${i}`;
          const panelId = `${uid}-panel-${i}`;
          const open = startOpen === i;
          return (
            <div className="accordion-morph__row" data-accordion-morph-row key={triggerId}>
              <div className="accordion-morph__goo" data-accordion-morph-goo aria-hidden="true">
                <div className="accordion-morph__goo-pill" data-accordion-morph-goo-pill="" />
                <div className="accordion-morph__goo-panel" data-accordion-morph-goo-panel="" />
              </div>
              <button
                type="button"
                className="accordion-morph__trigger"
                data-accordion-morph-trigger
                id={triggerId}
                aria-controls={panelId}
                aria-expanded={open}
              >
                <span className="accordion-morph__index">{String(i + 1).padStart(2, '0')}</span>
                <span className="accordion-morph__question">{item.question}</span>
                <PlusIcon />
              </button>
              <div
                className="accordion-morph__panel"
                data-accordion-morph-panel
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!open}
              >
                <div className="accordion-morph__panel-inner" data-accordion-morph-inner="">
                  <p className="accordion-morph__answer" data-accordion-morph-answer>
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
