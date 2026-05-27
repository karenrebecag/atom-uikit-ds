import { forwardRef, type ReactNode } from 'react';

export type ProgressNavItem = {
  id: string;
  label: string;
};

export type ProgressNavProps = {
  items: ProgressNavItem[];
  logo?: ReactNode;
  cta?: {
    label: string;
    href: string;
  };
  topAnchor?: string;
  bottomAnchor?: string;
  className?: string;
};

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

function NavButton({ id, label }: { id: string; label: string }) {
  return (
    <a
      data-progress-nav-target={`#${id}`}
      href={`#${id}`}
      className="progress-nav__btn"
    >
      <span className="progress-nav__btn-text">{label}</span>
      <span className="progress-nav__btn-text is--duplicate">{label}</span>
    </a>
  );
}

export const ProgressNav = forwardRef<HTMLElement, ProgressNavProps>(
  ({ items, logo, cta, topAnchor = 'top', bottomAnchor = 'bottom', className }, ref) => {
    return (
      <nav ref={ref} className={cn('progress-nav', className)}>
        <div className="progress-nav__inner">
          {logo && (
            <a href={`#${topAnchor}`} className="progress-nav__logo">
              {logo}
            </a>
          )}

          <div className="progress-nav__wrapper">
            <div data-progress-nav-list="" className="progress-nav__list">
              <div className="progress-nav__indicator" />
              <div
                data-progress-nav-target={`#${topAnchor}`}
                className="progress-nav__btn is--before"
              />
              {items.map((item) => (
                <NavButton key={item.id} id={item.id} label={item.label} />
              ))}
              <div
                data-progress-nav-target={`#${bottomAnchor}`}
                className="progress-nav__btn is--after"
              />
            </div>
          </div>

          {cta && (
            <a href={cta.href} className="progress-nav__contact-btn">
              <span className="progress-nav__btn-text">{cta.label}</span>
              <span className="progress-nav__btn-text is--duplicate">{cta.label}</span>
            </a>
          )}
        </div>
      </nav>
    );
  },
);

ProgressNav.displayName = 'ProgressNav';
