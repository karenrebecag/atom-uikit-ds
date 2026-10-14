// Stubs de las librerias de terceros que importan los componentes de Relume. Ninguna ejecuta el paquete real:
// devuelven el estado inicial o un valor neutro, porque solo interesa el arbol del primer render.
import { Fragment, createElement, jsx } from "../jsx-runtime";
import type { IREl } from "../ir";

type Props = Record<string, unknown>;
const noop = () => {};

// ---------- react ----------
const reactApi = {
  Fragment,
  createElement,
  useState: (init: unknown) => [typeof init === "function" ? (init as () => unknown)() : init, noop],
  useEffect: noop,
  useLayoutEffect: noop,
  useRef: (v: unknown = null) => ({ current: v }),
  useCallback: (f: unknown) => f,
  useMemo: (f: () => unknown) => f(),
  useId: () => "wfc-id",
  forwardRef: (f: (p: Props, r: null) => unknown) => (p: Props) => f(p, null),
};
// Congelados: un componente no puede mutar el stub y contaminar las evaluaciones siguientes del lote.
Object.freeze(reactApi);
export const react = Object.freeze({ ...reactApi, default: reactApi, React: reactApi });

// ---------- clsx (implementacion real: decide las clases que llegan a Tailwind) ----------
export function clsx(...args: unknown[]): string {
  const out: string[] = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === "string" || typeof a === "number") out.push(String(a));
    else if (Array.isArray(a)) out.push(clsx(...a));
    else if (typeof a === "object") for (const [k, v] of Object.entries(a)) if (v) out.push(k);
  }
  return out.filter(Boolean).join(" ");
}
export const clsxModule = { clsx, default: clsx };
// HACK: sin resolver conflictos entre utilidades. Usar el merge real si las 7 secciones que lo usan fallan.
export const tailwindMerge = { twMerge: clsx };

// ---------- framer-motion ----------
const MOTION_PROPS = new Set([
  "initial", "animate", "exit", "transition", "variants", "whileHover", "whileTap", "whileInView",
  "whileFocus", "viewport", "layout", "layoutId", "drag", "dragConstraints", "onAnimationComplete",
]);
const motionValue = (v: unknown = 0) => ({ get: () => v, set: noop, on: () => noop });
const motionTag = (tag: string) => (props: Props) => {
  const clean: Props = {};
  for (const [k, v] of Object.entries(props)) if (!MOTION_PROPS.has(k)) clean[k] = v;
  // style con MotionValue no es CSS estatico: se descarta
  if (clean.style && typeof clean.style === "object") clean.style = undefined;
  return jsx(tag, clean);
};
export const framerMotion = {
  motion: new Proxy({}, { get: (_t, tag: string) => motionTag(tag) }),
  AnimatePresence: (p: Props) => jsx(Fragment, { children: p.children }),
  useScroll: () => ({ scrollY: motionValue(), scrollYProgress: motionValue(), scrollX: motionValue(), scrollXProgress: motionValue() }),
  useTransform: () => motionValue(),
  useSpring: () => motionValue(),
  useMotionValue: (v: unknown) => motionValue(v),
  // en vista: se evalua el estado final visible, no el oculto previo a la animacion
  useInView: () => true,
  easeInOut: (t: number) => t,
  easeOut: (t: number) => t,
};

// ---------- formularios ----------
export const reactHookForm = {
  useForm: () => ({
    control: {}, register: () => ({}), handleSubmit: () => noop, watch: () => undefined,
    setValue: noop, reset: noop, formState: { errors: {}, isSubmitting: false },
  }),
};
// zod: esquema encadenable que no valida nada
const chain: unknown = new Proxy(function () {}, { get: () => chain, apply: () => chain });
export const zod = { z: chain, default: chain };
export const hookformZod = { zodResolver: () => noop };

// ---------- fechas y carrusel ----------
const dateLike: unknown = new Proxy(function () {}, {
  get: (_t, p) => (p === "toFormat" || p === "toLocaleString" || p === "toISO" ? () => "" : dateLike),
  apply: () => dateLike,
});
export const luxon = { DateTime: dateLike, Duration: dateLike };
export const emblaAutoplay = { default: () => ({}) };

// ---------- iconos ----------
// Marcador SVG con el nombre del icono: el SVG real exigiria instalar react-icons.
function iconComponent(name: string) {
  return (props: Props) => {
    const el = jsx("svg", { className: props.className, "data-icon": name, viewBox: "0 0 24 24" }) as IREl;
    return { ...el, component: { name: "Icon", props: { icon: name } } };
  };
}
export const reactIcons = new Proxy({}, { get: (_t, name: string) => iconComponent(name) });
