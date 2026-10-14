import { describe, expect, test } from "bun:test";
import { toSectionModel } from "../src/atom/section-model";
import type { IREl, IRNode } from "../src/eval/ir";

const t = (value: string): IRNode => ({ kind: "text", value });
const el = (tag: string, children: IRNode[] = [], extra: Partial<IREl> = {}): IREl =>
  ({ kind: "el", tag, attrs: {}, classes: [], children, ...extra });
const comp = (name: string, tag: string, children: IRNode[] = [], props: Record<string, unknown> = {}): IREl =>
  ({ kind: "el", tag, attrs: {}, classes: [], component: { name, props }, children });
const button = (label: string, props: Record<string, unknown> = {}): IREl =>
  comp("Button", "a", [t(label)], props);

describe("SectionModel — recuperación semántica del IR", () => {
  test("faq: un Accordion da items question/answer, el titular y el pie, y la acción de contacto", () => {
    const section = el("section", [
      el("div", [
        el("h2", [t("FAQs")]),
        el("p", [t("Resuelve tus dudas.")]),
      ]),
      comp("Accordion", "div", [
        comp("AccordionItem", "div", [
          comp("AccordionTrigger", "button", [t("¿Pregunta 1?")]),
          comp("AccordionContent", "div", [t("Respuesta 1.")]),
        ]),
        comp("AccordionItem", "div", [
          comp("AccordionTrigger", "button", [t("¿Pregunta 2?")]),
          comp("AccordionContent", "div", [t("Respuesta 2.")]),
        ]),
      ]),
      el("div", [
        el("h4", [t("¿Aún tienes dudas?")]),
        el("p", [t("Escríbenos.")]),
        button("Contact", { variant: "secondary" }),
      ]),
    ]);
    const m = toSectionModel([section]);
    expect(m.kind).toBe("faq");
    expect(m.heading).toBe("FAQs");
    expect(m.items).toEqual([
      { question: "¿Pregunta 1?", answer: "Respuesta 1." },
      { question: "¿Pregunta 2?", answer: "Respuesta 2." },
    ]);
    expect(m.footerHeading).toBe("¿Aún tienes dudas?");
    expect(m.actions[0]).toMatchObject({ label: "Contact", intent: "contact" });
  });

  test("metrics: tarjetas (número + heading) dan items value/title; el tagline previo es eyebrow", () => {
    const card = (value: string, title: string): IREl =>
      el("div", [el("p", [t(value)]), el("h3", [t(title)])]);
    const section = el("section", [
      el("div", [
        el("div", [el("p", [t("Tagline")]), el("h2", [t("Resultados")])]),
        el("div", [el("p", [t("Descripción de la sección.")])]),
      ]),
      el("div", [card("30%", "Más rápido"), card("2x", "Más ventas"), card("99%", "Uptime")]),
    ]);
    const m = toSectionModel([section]);
    expect(m.kind).toBe("metrics");
    expect(m.eyebrow).toBe("Tagline");
    expect(m.heading).toBe("Resultados");
    expect(m.body).toBe("Descripción de la sección.");
    expect(m.items).toEqual([
      { value: "30%", title: "Más rápido" },
      { value: "2x", title: "Más ventas" },
      { value: "99%", title: "Uptime" },
    ]);
  });

  test("logos: imágenes repetidas van a items (src/alt), no a media", () => {
    const img = (src: string, alt: string): IREl => el("img", [], { attrs: { src, alt } });
    const section = el("section", [
      el("h1", [t("Nos usan las mejores marcas")]),
      el("div", [img("a.svg", "A"), img("b.svg", "B"), img("c.svg", "C")]),
    ]);
    const m = toSectionModel([section]);
    expect(m.kind).toBe("logos");
    expect(m.media).toEqual([]);
    expect(m.items).toEqual([
      { src: "a.svg", alt: "A" },
      { src: "b.svg", alt: "B" },
      { src: "c.svg", alt: "C" },
    ]);
  });

  test("hero: h1 + imagen + botones -> kind hero, body del párrafo, acciones en orden", () => {
    const section = el("section", [
      el("div", [
        el("h1", [t("Titular del hero")]),
        el("p", [t("Descripción del hero.")]),
        el("div", [button("Empezar"), button("Ver más", { variant: "secondary" })]),
      ]),
      el("div", [el("img", [], { attrs: { src: "hero.svg", alt: "Hero" } })]),
    ]);
    const m = toSectionModel([section]);
    expect(m.kind).toBe("hero");
    expect(m.heading).toBe("Titular del hero");
    expect(m.body).toBe("Descripción del hero.");
    expect(m.actions.map((a) => a.label)).toEqual(["Empezar", "Ver más"]);
    expect(m.media[0]).toMatchObject({ src: "hero.svg" });
  });

  test("cta: mismo molde que hero pero con h2 -> kind cta (jerarquía de encabezado)", () => {
    const section = el("section", [
      el("div", [
        el("h2", [t("Titular CTA")]),
        el("p", [t("Sub.")]),
        el("div", [button("Contratar")]),
      ]),
      el("div", [el("img", [], { attrs: { src: "cta.svg", alt: "CTA" } })]),
    ]);
    const m = toSectionModel([section]);
    expect(m.kind).toBe("cta");
    expect(m.headingLevel).toBe(2);
  });
});
