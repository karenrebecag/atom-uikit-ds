import { useState, type ReactNode } from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const ChevronDown = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// ---- AccordionItem ----

export type AccordionItemProps = {
  title: string;
  defaultOpen?: boolean;
  /**
   * Nivel del encabezado que envuelve al disparador. Es prop y no un valor fijo
   * porque el nivel correcto depende de donde caiga el accordion en la pagina:
   * bajo un h2 de seccion toca h3, y saltarse un nivel rompe el indice de
   * encabezados del lector de pantalla.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
};

export function AccordionItem({
  title,
  defaultOpen = false,
  headingLevel = 3,
  children,
  className,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const Heading = `h${headingLevel}` as const;

  return (
    <div className={cn('accordion__item', open && 'accordion__item--open', className)}>
      {/* El heading envuelve al boton y no al reves: un <button> solo admite
          contenido de frase, y ademas asi la pregunta entra en el indice de
          encabezados de la pagina. */}
      <Heading className="accordion__heading">
        <button
          type="button"
          className="accordion__trigger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {title}
          <span className="accordion__chevron"><ChevronDown /></span>
        </button>
      </Heading>
      <div className="accordion__content-wrapper">
        <div className="accordion__content">
          <div className="accordion__content-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Accordion ----

export type AccordionProps = {
  children: ReactNode;
  className?: string;
};

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn('accordion', className)}>{children}</div>;
}
