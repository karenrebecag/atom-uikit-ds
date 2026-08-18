import {
  type ReactNode,
  useRef,
  useEffect,
  useState,
  Children,
  cloneElement,
  isValidElement,
} from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export type MarqueeProps = {
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  fade?: boolean;
  draggable?: boolean;
  duration?: number;
  multiplier?: number;
  sensitivity?: number;
  /** Solo en draggable: false deja la tira quieta hasta que la arrastren. */
  autoplay?: boolean;
  /** Solo en draggable: arrastre-retardo de los items. 0 = sin retardo. */
  lag?: number;
  /** Solo en draggable sin autoplay: imanta a limite de item al soltar. */
  snap?: 'true' | 'auto' | 'false';
  /** Solo en draggable: flechas prev/next a los costados. */
  controls?: boolean;
  /** Etiquetas accesibles de las flechas. El DS no las inyecta: este sitio
      corre en tres idiomas y una etiqueta fija seria incorrecta en dos. */
  prevLabel?: string;
  nextLabel?: string;
  children: ReactNode;
  className?: string;
};

export function Marquee({
  speed = 75,
  reverse = false,
  pauseOnHover = false,
  fade = true,
  draggable = false,
  duration: draggableDuration = 20,
  multiplier = 35,
  sensitivity = 0.01,
  autoplay = true,
  lag = 0,
  snap = 'false',
  controls = false,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  children,
  className,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [cssDuration, setCssDuration] = useState('30s');

  // CSS mode: calculate duration based on content width
  useEffect(() => {
    if (draggable || !listRef.current) return;
    const width = listRef.current.offsetWidth;
    setCssDuration(`${width / speed}s`);
  }, [speed, children, draggable]);

  // CSS mode: IntersectionObserver pause
  useEffect(() => {
    if (draggable || !containerRef.current) return;
    const el = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          el.style.setProperty('--marquee-state', entry.isIntersecting ? 'running' : 'paused');
        });
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [draggable]);

  const listContent = Children.toArray(children);

  // Draggable mode: GSAP animation via data-attribute contract.
  // marquee--draggable no es decorativo: apaga la animacion CSS de __list. En
  // este modo el desplazamiento lo pone GSAP sobre __collection, y con las dos
  // vivas la tira avanza al doble sobre el mismo eje.
  if (draggable) {
    return (
      <div
        ref={containerRef}
        data-draggable-marquee=""
        data-direction={reverse ? 'right' : 'left'}
        data-duration={draggableDuration}
        data-multiplier={multiplier}
        data-sensitivity={sensitivity}
        data-autoplay={autoplay ? 'true' : 'false'}
        data-lag={lag}
        data-snap={snap}
        className={cn('marquee', 'marquee--draggable', fade && 'marquee--fade', className)}
      >
        <div data-draggable-marquee-collection="" className="marquee__collection">
          <div data-draggable-marquee-list="" className="marquee__list">
            {listContent}
          </div>
        </div>
        {controls && (
          <>
            <button
              type="button"
              className="marquee__control marquee__control--prev"
              data-draggable-marquee-control="prev"
              aria-label={prevLabel}
            />
            <button
              type="button"
              className="marquee__control marquee__control--next"
              data-draggable-marquee-control="next"
              aria-label={nextLabel}
            />
          </>
        )}
      </div>
    );
  }

  // CSS mode
  return (
    <div
      ref={containerRef}
      className={cn(
        'marquee',
        reverse && 'marquee--reverse',
        pauseOnHover && 'marquee--pause-hover',
        fade && 'marquee--fade',
        className,
      )}
      style={{ '--marquee-duration': cssDuration } as React.CSSProperties}
    >
      <div ref={listRef} className="marquee__list">
        {listContent}
      </div>
      <div className="marquee__list" aria-hidden="true">
        {listContent}
      </div>
    </div>
  );
}

/* ---- Item ---- */

export function MarqueeItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('marquee__item', className)}>{children}</div>;
}

/* ---- Separator ---- */

export function MarqueeSeparator({ children, className }: { children?: ReactNode; className?: string }) {
  const defaultStar = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="currentColor">
      <path d="M17.6777 32.3223C12.9893 27.6339 6.63041 25 0 25C6.63041 25 12.9893 22.3661 17.6777 17.6777C22.3661 12.9893 25 6.63041 25 0C25 6.63041 27.6339 12.9893 32.3223 17.6777C37.0107 22.3661 43.3696 25 50 25C43.3696 25 37.0107 27.6339 32.3223 32.3223C27.6339 37.0107 25 43.3696 25 50C25 43.3696 22.3661 37.0107 17.6777 32.3223Z" />
    </svg>
  );

  return (
    <span className={cn('marquee__separator', className)}>
      {children || defaultStar}
    </span>
  );
}
