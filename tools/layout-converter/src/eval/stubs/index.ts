// Registro de modulos stub. Es la lista blanca: un modulo que no esta aqui no se puede importar.
import { relumeUi } from "./relume-ui";
import {
  clsxModule, emblaAutoplay, framerMotion, hookformZod, luxon, react, reactHookForm, reactIcons, tailwindMerge, zod,
} from "./libs";

// Map y no objeto literal: con `in`, "constructor" o "toString" pasaban la lista blanca.
const MODULES = new Map<string, unknown>(Object.entries({
  "@relume_io/relume-ui": relumeUi,
  // Librería propia de Atom (fork limpio de las primitivas Relume: misma API).
  "@kit/ui": relumeUi,
  react,
  clsx: clsxModule,
  "tailwind-merge": tailwindMerge,
  "framer-motion": framerMotion,
  "react-hook-form": reactHookForm,
  zod,
  "@hookform/resolvers/zod": hookformZod,
  luxon,
  "embla-carousel-autoplay": emblaAutoplay,
}));

export function isAllowed(spec: string): boolean {
  return MODULES.has(spec) || /^react-icons\/[a-z0-9]+$/.test(spec);
}

export function mod(spec: string): unknown {
  if (/^react-icons\/[a-z0-9]+$/.test(spec)) return reactIcons;
  if (!MODULES.has(spec)) throw new Error(`modulo no permitido: ${spec}`);
  return MODULES.get(spec);
}
