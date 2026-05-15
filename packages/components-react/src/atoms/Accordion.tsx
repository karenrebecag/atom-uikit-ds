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
  children: ReactNode;
  className?: string;
};

export function AccordionItem({ title, defaultOpen = false, children, className }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('accordion__item', open && 'accordion__item--open', className)}>
      <button
        type="button"
        className="accordion__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        <span className="accordion__chevron"><ChevronDown /></span>
      </button>
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
