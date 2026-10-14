import { describe, expect, test } from "bun:test";
import { BINDINGS, fillLayout, loadLayout, slotsOf, type DsLayout } from "../src/atom/catalog";
import type { SectionModel } from "../src/atom/section-model";

const model = (over: Partial<SectionModel>): SectionModel => ({
  kind: "hero",
  actions: [],
  media: [],
  items: [],
  unmapped: [],
  ...over,
});

describe("binding — modelo semántico -> vocabulario de slots de cada layout", () => {
  test("hero-split: eyebrow/heading/body + CTA primaria y secundaria con su href", () => {
    const b = BINDINGS["hero-split"](
      model({
        eyebrow: "Nuevo",
        heading: "Titular",
        body: "Cuerpo",
        actions: [
          { label: "Empezar", href: "/start", intent: "navigate" },
          { label: "Ver", intent: "navigate" },
        ],
        media: [{ kind: "image", src: "h.svg", alt: "Hero" }],
      }),
    );
    expect(b.values).toMatchObject({
      eyebrow: "Nuevo",
      heading: "Titular",
      body: "Cuerpo",
      cta_primary: "Empezar",
      cta_primary_href: "/start",
      cta_secondary: "Ver",
      cta_secondary_href: "#",
      media: "Hero",
    });
  });

  test("faq-accordion: contactCta sale de la acción de contacto, no de la primera cualquiera", () => {
    const b = BINDINGS["faq-accordion"](
      model({
        kind: "faq",
        heading: "FAQs",
        items: [{ question: "¿Q1?", answer: "A1" }],
        actions: [
          { label: "Inicio", intent: "navigate" },
          { label: "Contact", intent: "contact" },
        ],
      }),
    );
    expect(b.values.headline).toBe("FAQs");
    expect(b.values.faq1_question).toBe("¿Q1?");
    expect(b.values.contactCta).toBe("Contact");
  });

  test("logo-marquee: más logos que slots -> el excedente se reporta en unmapped (capacidad 8)", () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ src: `l${i}.svg`, alt: `L${i}` }));
    const b = BINDINGS["logo-marquee"](model({ kind: "logos", heading: "Marcas", items }));
    expect(b.values.logo8).toBe("l7.svg");
    expect(b.values.logo1_name).toBe("L0");
    expect(b.unmapped).toEqual(["logos: 2 sin slot (capacidad 8)"]);
  });
});

describe("fillLayout — sustitución de slots en un layout del DS", () => {
  const fake: DsLayout = {
    slug: "demo",
    name: "Demo",
    components: [],
    html: `<section><h1>{{heading}}</h1><p>{{body}}</p><span>{{eyebrow}}</span></section>`,
    css: `.demo { display: grid; }`,
  };

  test("rellena los slots con valor y deja vacío (y reporta) el que el origen no aportó", () => {
    const r = fillLayout(fake, { heading: "T", body: "C", eyebrow: "" });
    expect(r.html).toBe(`<section><h1>T</h1><p>C</p><span></span></section>`);
    expect(r.filled.sort()).toEqual(["body", "heading"]);
    expect(r.emptySlots).toEqual(["eyebrow"]);
    expect(r.css).toBe(fake.css);
  });

  test("un valor cuyo slot el layout no declara se marca como binding obsoleto", () => {
    const r = fillLayout(fake, { heading: "T", fantasma: "x" });
    expect(r.staleBindings).toEqual(["fantasma"]);
  });
});

describe("catálogo real del DS — el binding está alineado con el layout en disco", () => {
  test("cada binding solo produce slots que el layout del DS declara (sin binding obsoleto)", async () => {
    const slugs = ["hero-split", "cta-split-image", "feature-grid", "metrics-grid", "logo-marquee", "faq-accordion"];
    for (const slug of slugs) {
      const layout = await loadLayout(slug);
      const declared = new Set(slotsOf(layout.html));
      const b = BINDINGS[slug](model({ kind: "hero", items: [], actions: [], media: [] }));
      const stale = Object.keys(b.values).filter((k) => !declared.has(k));
      expect({ slug, stale }).toEqual({ slug, stale: [] });
    }
  });
});
