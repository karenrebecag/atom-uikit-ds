import { describe, expect, test } from "bun:test";
import { elementCss, invert } from "../src/cascade/invert";
import { resolveClasses } from "../src/tailwind/resolve";

const run = async (cls: string, wide = false) => {
  const classes = cls.split(" ");
  const r = await resolveClasses(classes);
  const unsupported: string[] = [];
  return { wf: invert(elementCss(classes, r), unsupported, wide), unsupported };
};

describe("cascada desktop-first", () => {
  test("titulo: lg en main, md en medium, base en small; tiny hereda", async () => {
    const { wf } = await run("text-5xl md:text-7xl lg:text-8xl");
    expect(wf.main["font-size"]).toBe("3rem");
    expect(wf.variants.medium?.["font-size"]).toBe("2.75rem");
    expect(wf.variants.small?.["font-size"]).toBe("2.25rem");
    expect(wf.variants.tiny).toBeUndefined();
  });

  test("propiedad solo en lg: los rangos inferiores reciben su valor inicial explicito", async () => {
    const { wf } = await run("grid lg:grid-cols-2");
    expect(wf.main["grid-template-columns"]).toBe("repeat(2, minmax(0, 1fr))");
    expect(wf.variants.medium?.["grid-template-columns"]).toBe("none");
    expect(wf.variants.small).toBeUndefined();
  });

  test("con --wide, xl: del preset (1280) va a large de Webflow, no a xl", async () => {
    const { wf } = await run("py-16 xl:py-32", true);
    expect(wf.variants.large?.["padding-top"]).toBe("8rem");
    expect(wf.variants.xl).toBeUndefined();
  });

  test("sin --wide, large se pliega en main y no se emite: pegar no agrega el breakpoint 1280 al sitio", async () => {
    const { wf } = await run("container");
    expect(wf.main["max-width"]).toBe("1280px");
    expect(wf.variants.large).toBeUndefined();
    expect(wf.variants.medium?.["max-width"]).toBe("none");
  });

  test("las custom props --tw-* se sustituyen por su valor real", async () => {
    const { wf } = await run("bg-black/50 translate-x-2");
    expect(wf.main["background-color"]).toBe("rgb(0 0 0 / 0.5)");
    expect(wf.main.transform).not.toContain("var(");
    expect(Object.keys(wf.main).some((p) => p.startsWith("--"))).toBe(false);
  });
});

test("propiedad heredada solo en md: el rango inferior vuelve a inherit, no al inicial de CSS", async () => {
  const { resolveClasses } = await import("../src/tailwind/resolve");
  const { elementCss, invert } = await import("../src/cascade/invert");
  const r = await resolveClasses(["md:text-xl"]);
  const wf = invert(elementCss(["md:text-xl"], r));
  expect(wf.variants.small?.["font-size"]).toBe("inherit");
});
