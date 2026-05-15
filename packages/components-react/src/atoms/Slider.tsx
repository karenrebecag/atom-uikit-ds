import {
  type KeyboardEvent,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function snap(v: number, step: number, min: number) {
  return Math.round((v - min) / step) * step + min;
}

function pct(v: number, min: number, max: number) {
  return ((v - min) / (max - min)) * 100;
}

/* ---- Single Slider ---- */

export type SliderProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
};

export function Slider({
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const setValue = useCallback(
    (v: number) => {
      const clamped = snap(clamp(v, min, max), step, min);
      onValueChange ? onValueChange(clamped) : setInternalValue(clamped);
    },
    [min, max, step, onValueChange],
  );

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return min + ratio * (max - min);
    },
    [min, max, value],
  );

  const handlePointerDown = (clientX: number) => {
    if (disabled) return;
    setDragging(true);
    setValue(getValueFromPosition(clientX));
  };

  // Mouse
  const onMouseDown = (e: React.MouseEvent) => {
    handlePointerDown(e.clientX);
    const onMove = (ev: MouseEvent) => setValue(getValueFromPosition(ev.clientX));
    const onUp = () => { setDragging(false); document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // Touch
  const onTouchStart = (e: React.TouchEvent) => {
    handlePointerDown(e.touches[0].clientX);
    const onMove = (ev: TouchEvent) => setValue(getValueFromPosition(ev.touches[0].clientX));
    const onEnd = () => { setDragging(false); document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onEnd); };
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
  };

  // Keyboard
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setValue(value + step); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setValue(value - step); }
    else if (e.key === 'Home') { e.preventDefault(); setValue(min); }
    else if (e.key === 'End') { e.preventDefault(); setValue(max); }
  };

  // Prevent text selection during drag
  useEffect(() => {
    if (!dragging) return;
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    return () => { document.body.style.userSelect = prev; };
  }, [dragging]);

  const p = pct(value, min, max);

  return (
    <div
      className={cn('slider', disabled && 'slider--disabled', className)}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div ref={trackRef} className="slider__track">
        <div className="slider__range" style={{ width: `${p}%` }} />
      </div>
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled || undefined}
        className={cn('slider__thumb', dragging && 'slider__thumb--dragging')}
        style={{ left: `${p}%` }}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

/* ---- Range Slider ---- */

export type RangeSliderProps = {
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
};

export function RangeSlider({
  value: controlledValue,
  defaultValue = [25, 75],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
}: RangeSliderProps) {
  const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
  const value = controlledValue ?? internalValue;
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null);

  const setValue = useCallback(
    (v: [number, number]) => {
      const sorted: [number, number] = [
        snap(clamp(v[0], min, max), step, min),
        snap(clamp(v[1], min, max), step, min),
      ];
      if (sorted[0] > sorted[1]) [sorted[0], sorted[1]] = [sorted[1], sorted[0]];
      onValueChange ? onValueChange(sorted) : setInternalValue(sorted);
    },
    [min, max, step, onValueChange],
  );

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return min + ratio * (max - min);
    },
    [min, max],
  );

  const handleTrackDown = (clientX: number) => {
    if (disabled) return;
    const v = getValueFromPosition(clientX);
    const d0 = Math.abs(v - value[0]);
    const d1 = Math.abs(v - value[1]);
    const idx = d0 <= d1 ? 0 : 1;
    setActiveThumb(idx as 0 | 1);
    const next: [number, number] = [...value];
    next[idx] = v;
    setValue(next);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    handleTrackDown(e.clientX);
    const onMove = (ev: MouseEvent) => {
      if (activeThumb === null) return;
      const v = getValueFromPosition(ev.clientX);
      const next: [number, number] = [...value];
      next[activeThumb] = v;
      setValue(next);
    };
    const onUp = () => { setActiveThumb(null); document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    handleTrackDown(e.touches[0].clientX);
    const onMove = (ev: TouchEvent) => {
      if (activeThumb === null) return;
      const v = getValueFromPosition(ev.touches[0].clientX);
      const next: [number, number] = [...value];
      next[activeThumb] = v;
      setValue(next);
    };
    const onEnd = () => { setActiveThumb(null); document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onEnd); };
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
  };

  const makeKeyDown = (idx: 0 | 1) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const next: [number, number] = [...value];
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); next[idx] += step; }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); next[idx] -= step; }
    else if (e.key === 'Home') { e.preventDefault(); next[idx] = min; }
    else if (e.key === 'End') { e.preventDefault(); next[idx] = max; }
    else return;
    setValue(next);
  };

  useEffect(() => {
    if (activeThumb === null) return;
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    return () => { document.body.style.userSelect = prev; };
  }, [activeThumb]);

  const p0 = pct(value[0], min, max);
  const p1 = pct(value[1], min, max);

  return (
    <div
      className={cn('slider', disabled && 'slider--disabled', className)}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div ref={trackRef} className="slider__track">
        <div className="slider__range" style={{ left: `${p0}%`, width: `${p1 - p0}%` }} />
      </div>
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[0]}
        className={cn('slider__thumb', activeThumb === 0 && 'slider__thumb--dragging')}
        style={{ left: `${p0}%` }}
        onKeyDown={makeKeyDown(0)}
      />
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[1]}
        className={cn('slider__thumb', activeThumb === 1 && 'slider__thumb--dragging')}
        style={{ left: `${p1}%` }}
        onKeyDown={makeKeyDown(1)}
      />
    </div>
  );
}
