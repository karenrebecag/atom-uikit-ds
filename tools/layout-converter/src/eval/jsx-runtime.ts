import type { IRNode, IREl } from "./ir";

export const Fragment = Symbol.for("wfc.fragment");

type Props = Record<string, unknown> & { children?: unknown; className?: unknown };

function flatten(children: unknown, out: IRNode[] = []): IRNode[] {
  if (children === null || children === undefined || children === false || children === true) return out;
  if (Array.isArray(children)) {
    for (const c of children) flatten(c, out);
    return out;
  }
  if (typeof children === "string" || typeof children === "number") {
    out.push({ kind: "text", value: String(children) });
    return out;
  }
  if (typeof children === "object" && "kind" in (children as object)) {
    out.push(children as IRNode);
    return out;
  }
  // un fragmento ya resuelto viaja como array de nodos
  return out;
}

export function jsx(type: unknown, props: Props | null): IRNode | IRNode[] {
  const p = props ?? {};
  if (type === Fragment) return flatten(p.children);
  // key es de React, no del DOM ni del componente
  const { key: _key, ...clean } = p;
  if (typeof type === "function") return (type as (p: Props) => IRNode | IRNode[])(clean);
  const { children, className, ...attrs } = clean;
  const el: IREl = {
    kind: "el",
    tag: String(type),
    attrs,
    classes: typeof className === "string" ? className.split(/\s+/).filter(Boolean) : [],
    children: flatten(children),
  };
  return el;
}

export const jsxs = jsx;
export const jsxDEV = jsx;
export const createElement = (type: unknown, props: Props | null, ...children: unknown[]) =>
  jsx(type, { ...(props ?? {}), children: children.length === 1 ? children[0] : children });
