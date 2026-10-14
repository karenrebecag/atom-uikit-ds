// Modo B: una clase BEM `<bloque>_<elemento>` por combinacion unica de utilidades, con todo su CSS.
// Autocontenido: no depende de ninguna style guide en el sitio destino.
import { elementCss, invert } from "../cascade/invert";
import type { IREl, IRNode } from "../eval/ir";
import type { ClassStyle } from "../emit/xscp";
import type { Resolved } from "../tailwind/resolve";

const ROLE: Record<string, string> = {
  h1: "heading", h2: "heading", h3: "heading", h4: "heading", h5: "heading", h6: "heading",
  p: "text", a: "link", button: "button", img: "image", ul: "list", ol: "list", li: "item",
  svg: "icon", nav: "nav", form: "form", input: "input", label: "label", textarea: "textarea",
};

export interface Assignment {
  classesOf: (el: IREl) => string[];
  styles: Map<string, ClassStyle>;
  unsupported: string[];
}

export function blockName(component: string): string {
  return component.replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase().replace(/-(\d)/g, "$1");
}

// prefix: Webflow renombra con " 2" toda clase con CSS que ya exista en el sitio (prueba P1, incluso con CSS
// identico), y el head CSS apunta al nombre original. Un prefijo por proyecto evita la colision.
export function assignBem(tree: IRNode[], component: string, r: Resolved, prefix = "", wide = false): Assignment {
  const block = prefix + blockName(component);
  const byKey = new Map<string, string>(); // utilidades + tag -> nombre de clase
  const of = new Map<IREl, string[]>();
  const styles = new Map<string, ClassStyle>();
  const taken = new Set<string>();
  const unsupported: string[] = [];

  const name = (role: string) => {
    let n = `${block}_${role}`;
    for (let i = 2; taken.has(n); i++) n = `${block}_${role}-${i}`;
    taken.add(n);
    return n;
  };

  const visit = (n: IRNode, depth: number) => {
    if (n.kind === "text") return;
    // las utilidades sin CSS (rb-N, marcadores) no cuentan para la clase
    const utils = n.classes.filter((c) => r.byClass.has(c));
    if (utils.length) {
      const key = `${n.tag}|${[...utils].sort().join(" ")}`;
      let cls = byKey.get(key);
      if (!cls) {
        const role = depth === 0 ? "component" : (ROLE[n.tag] ?? (n.component ? n.component.name.toLowerCase() : "wrapper"));
        cls = name(role);
        byKey.set(key, cls);
        const css = elementCss(utils, r);
        styles.set(cls, { ...invert(css, unsupported, wide), states: css.states });
      }
      of.set(n, [cls]);
    } else if (n.component?.name === "Button") {
      unsupported.push("Button sin CSS: su estilo vive en relume-ui, que no se instala; queda el boton por defecto de Webflow");
    }
    for (const c of n.children) visit(c, depth + 1);
  };
  for (const t of tree) visit(t, 0);
  return { classesOf: (el) => of.get(el) ?? [], styles, unsupported };
}
