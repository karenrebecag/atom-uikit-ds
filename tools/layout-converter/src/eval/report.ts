// Registro de lo que el evaluador no modela, por archivo evaluado (se reinicia en cada evaluacion).
const generic = new Set<string>();

export function reportGeneric(module: string, name: string): void {
  generic.add(`${module}:${name}`);
}

export function takeReport(): string[] {
  const out = [...generic].sort();
  generic.clear();
  return out;
}
