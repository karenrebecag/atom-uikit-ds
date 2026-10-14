import { describe, expect, test } from "bun:test";
import { mapValue, spacingTokenNearest } from "../src/atom/tokens";
import { emitAtomLayout } from "../src/emit/atom-layout";
import type { Entry, Resolved } from "../src/tailwind/resolve";
import type { IREl } from "../src/eval/ir";

const el = (tag: string, children: IREl["children"] = [], extra: Partial<IREl> = {}): IREl =>
  ({ kind: "el", tag, attrs: {}, classes: [], children, ...extra });

let ord = 0;
const entry = (decls: [string, string][]): Entry => ({ min: 0, state: "", decls, order: ord++ });
const resolvedOf = (byClass: Record<string, [string, string][]>): Resolved => ({
  byClass: new Map(Object.entries(byClass).map(([c, d]) => [c, [entry(d)]])),
  defaults: new Map(),
  unknownMedia: [],
});

describe("mapeo de valores a tokens del DS", () => {
  test("un margin fuera de la escala se ENCAJA al paso más cercano, no se deja crudo", () => {
    // 4.5rem = 72px -> entre spacing-16 (64) y spacing-20 (80); más cerca de 16.
    expect(mapValue("margin-bottom", "4.5rem")).toBe("var(--spacing-16)");
    expect(spacingTokenNearest(72)).toBe("var(--spacing-16)");
  });

  test("un borde neutro (negro de Relume) va al token --border, nunca a negro puro", () => {
    expect(mapValue("border-color", "rgb(0 0 0 / 1)")).toBe("var(--border)");
    expect(mapValue("border-color", "#000000")).toBe("var(--border)");
  });

  test("un ancho de width exacto usa token; uno no exacto o % se deja", () => {
    expect(mapValue("width", "48px")).toBe("var(--spacing-12)");
    expect(mapValue("width", "100%")).toBe("100%");
  });
});

describe("emisor Atom", () => {
  test("la raíz no conserva padding-block propio (el ritmo lo da .section)", async () => {
    const root = el("section", [el("div", [{ kind: "text", value: "x" }], { classes: ["inner"] })], { classes: ["sec"] });
    const resolved = resolvedOf({
      sec: [["padding-top", "4rem"], ["padding-bottom", "4rem"]],
      inner: [["gap", "1rem"]],
    });
    const out = await emitAtomLayout("prueba", [root], resolved);
    expect(out.css).not.toContain("padding-top");
    expect(out.css).not.toContain("padding-bottom");
  });

  test("un layout es PLANO: el borde (visual) se retira del CSS y se reporta; el posicionamiento sobrevive", async () => {
    const root = el("section", [el("div", [{ kind: "text", value: "x" }], { classes: ["card"] })], { classes: ["sec"] });
    const resolved = resolvedOf({
      sec: [["display", "block"]],
      card: [["border-left-width", "2px"], ["gap", "1rem"]],
    });
    const out = await emitAtomLayout("prueba", [root], resolved);
    expect(out.css).not.toContain("border");
    expect(out.css).toContain("gap");
    expect(out.report.droppedVisual.some((d) => d.prop === "border-left-width")).toBe(true);
  });
});

describe("escala tipográfica real del DS (no inventada)", () => {
  test("font-size encaja contra los tokens REALES del DS, no contra una tabla de memoria", () => {
    // tokens.css: sm=12.8px(0.8rem), 4xl=48.83px, lg=20px. La tabla vieja (sm=14px) era falsa.
    expect(mapValue("font-size", "0.8rem")).toBe("var(--font-size-sm)");
    expect(mapValue("font-size", "1.25rem")).toBe("var(--font-size-lg)");
    expect(mapValue("font-size", "48.83px")).toBe("var(--font-size-4xl)");
    // 12px cae MÁS cerca de sm(12.8) que de xs(10.24): propiedad real de la escala 1.25.
    expect(mapValue("font-size", "0.75rem")).toBe("var(--font-size-sm)");
  });
});

describe("reporte F0 — el emisor hace visible lo que NO traslada fiel", () => {
  test("una primitiva sin mapa al DS (Accordion) se BLOQUEA en el reporte, no se aplana en silencio", async () => {
    const trigger = el("button", [{ kind: "text", value: "¿Pregunta?" }], { component: { name: "AccordionTrigger", props: {} } });
    const root = el("section", [trigger], { classes: ["sec"] });
    const out = await emitAtomLayout("faq", [root], resolvedOf({ sec: [["display", "block"]] }));
    expect(out.report.blocked.map((b) => b.name)).toContain("AccordionTrigger");
  });

  test("el manifiesto de slots incluye el _href del botón (antes faltaba, lo tapaba el demo)", async () => {
    const btn = el("a", [{ kind: "text", value: "Ir" }], { component: { name: "Button", props: {} } });
    const root = el("section", [btn], { classes: ["sec"] });
    const out = await emitAtomLayout("cta", [root], resolvedOf({ sec: [["display", "block"]] }));
    expect(out.slots).toContain("button_1");
    expect(out.slots).toContain("button_1_href");
  });

  test("los atributos descartados (href, aria-*) se reportan, no se tiran callando", async () => {
    const link = el("a", [{ kind: "text", value: "x" }], { attrs: { href: "/precios", "aria-label": "Precios" } });
    const root = el("section", [link], { classes: ["sec"] });
    const out = await emitAtomLayout("p", [root], resolvedOf({ sec: [["display", "block"]] }));
    const attrs = out.report.droppedAttrs.map((d) => d.attr);
    expect(attrs).toContain("href");
    expect(attrs).toContain("aria-label");
  });

  test("una prop visual (color) se RETIRA del CSS del layout y se reporta", async () => {
    const p = el("p", [{ kind: "text", value: "x" }], { classes: ["c"] });
    const root = el("section", [p], { classes: ["sec"] });
    const resolved = resolvedOf({ sec: [["display", "block"]], c: [["color", "#111111"], ["gap", "0.5rem"]] });
    const out = await emitAtomLayout("v", [root], resolved);
    expect(out.report.droppedVisual.some((v) => v.prop === "color")).toBe(true);
    expect(out.css).not.toContain("#111111");
    expect(out.css).not.toContain("color:");
  });

  test("F1: el CSS del layout pasa el contrato — sin color literal, font-family ni motion", async () => {
    const root = el("section", [el("div", [{ kind: "text", value: "x" }], { classes: ["box"] })], { classes: ["sec"] });
    const resolved = resolvedOf({
      sec: [["display", "block"]],
      box: [["display", "flex"], ["gap", "1rem"], ["transition-property", "all"], ["color", "#ef4444"]],
    });
    const out = await emitAtomLayout("x", [root], resolved);
    expect(out.report.contractViolations).toEqual([]);
    expect(out.css).toContain("gap");
    expect(out.css).not.toMatch(/transition|#ef4444/);
    expect(out.report.droppedVisual.map((d) => d.prop)).toEqual(expect.arrayContaining(["transition-property", "color"]));
  });
});
