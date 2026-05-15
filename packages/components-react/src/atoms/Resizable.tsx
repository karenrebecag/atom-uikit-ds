import {
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useState,
  useRef,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ---- Context ---- */

type ResizableContextValue = {
  orientation: 'horizontal' | 'vertical';
  sizes: number[];
  onResize: (handleIndex: number, delta: number) => void;
};

const ResizableContext = createContext<ResizableContextValue | null>(null);

function useResizable() {
  const ctx = useContext(ResizableContext);
  if (!ctx) throw new Error('Resizable components must be used within <ResizablePanelGroup>');
  return ctx;
}

/* ---- Panel Group ---- */

export type ResizablePanelGroupProps = {
  orientation?: 'horizontal' | 'vertical';
  panels?: number;
  children: ReactNode;
  className?: string;
};

export function ResizablePanelGroup({
  orientation = 'horizontal',
  panels = 2,
  children,
  className,
}: ResizablePanelGroupProps) {
  const [sizes, setSizes] = useState<number[]>(() => {
    const defaultSize = 100 / panels;
    return Array(panels).fill(defaultSize);
  });

  const groupRef = useRef<HTMLDivElement>(null);

  const onResize = useCallback(
    (handleIndex: number, delta: number) => {
      if (!groupRef.current) return;
      const rect = groupRef.current.getBoundingClientRect();
      const totalPx = orientation === 'horizontal' ? rect.width : rect.height;
      const deltaPct = (delta / totalPx) * 100;

      setSizes((prev) => {
        const next = [...prev];
        const minSize = 10;
        const a = next[handleIndex] + deltaPct;
        const b = next[handleIndex + 1] - deltaPct;
        if (a < minSize || b < minSize) return prev;
        next[handleIndex] = a;
        next[handleIndex + 1] = b;
        return next;
      });
    },
    [orientation],
  );

  return (
    <ResizableContext.Provider value={{ orientation, sizes, onResize }}>
      <div
        ref={groupRef}
        className={cn('resizable', orientation === 'vertical' && 'resizable--vertical', className)}
      >
        {children}
      </div>
    </ResizableContext.Provider>
  );
}

/* ---- Panel ---- */

export type ResizablePanelProps = {
  index: number;
  children: ReactNode;
  className?: string;
};

export function ResizablePanel({ index, children, className }: ResizablePanelProps) {
  const { orientation, sizes } = useResizable();
  const size = sizes[index] ?? 50;
  const style = orientation === 'horizontal'
    ? { width: `${size}%` }
    : { height: `${size}%` };

  return (
    <div className={cn('resizable__panel', className)} style={style}>
      {children}
    </div>
  );
}

/* ---- Handle ---- */

export type ResizableHandleProps = {
  index: number;
  withHandle?: boolean;
  className?: string;
};

export function ResizableHandle({ index, withHandle = false, className }: ResizableHandleProps) {
  const { orientation, onResize } = useResizable();
  const [dragging, setDragging] = useState(false);
  const startPos = useRef(0);

  const handleMouseDown = (e: ReactMouseEvent) => {
    e.preventDefault();
    setDragging(true);
    startPos.current = orientation === 'horizontal' ? e.clientX : e.clientY;

    const handleMouseMove = (ev: MouseEvent) => {
      const current = orientation === 'horizontal' ? ev.clientX : ev.clientY;
      const delta = current - startPos.current;
      if (delta !== 0) {
        onResize(index, delta);
        startPos.current = current;
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = orientation === 'horizontal' ? touch.clientX : touch.clientY;
    setDragging(true);

    const handleTouchMove = (ev: TouchEvent) => {
      const t = ev.touches[0];
      const current = orientation === 'horizontal' ? t.clientX : t.clientY;
      const delta = current - startPos.current;
      if (delta !== 0) {
        onResize(index, delta);
        startPos.current = current;
      }
    };

    const handleTouchEnd = () => {
      setDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Keyboard
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 20;
    const isH = orientation === 'horizontal';
    if ((isH && e.key === 'ArrowRight') || (!isH && e.key === 'ArrowDown')) {
      e.preventDefault();
      onResize(index, step);
    } else if ((isH && e.key === 'ArrowLeft') || (!isH && e.key === 'ArrowUp')) {
      e.preventDefault();
      onResize(index, -step);
    }
  };

  // Prevent text selection during drag
  useEffect(() => {
    if (!dragging) return;
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    return () => { document.body.style.userSelect = prev; };
  }, [dragging]);

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation={orientation}
      className={cn('resizable__handle', dragging && 'resizable__handle--dragging', className)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
    >
      {withHandle && <div className="resizable__handle-grip" />}
    </div>
  );
}
