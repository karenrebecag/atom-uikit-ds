import { expect, test } from "bun:test";
import { assignBem } from "../src/classes/bem";
import type { IREl } from "../src/eval/ir";
import { resolveClasses } from "../src/tailwind/resolve";

test("modo B: misma combinacion de utilidades comparte clase; distinta crea otra con sufijo", async () => {
  const p = (c: string[]): IREl => ({ kind: "el", tag: "p", attrs: {}, classes: c, children: [] });
  const a = p(["text-md"]), b = p(["text-md"]), c = p(["text-md", "mb-4"]);
  const root: IREl = { kind: "el", tag: "section", attrs: {}, classes: ["px-[5%]", "rb-12"], children: [a, b, c] };
  const r = await resolveClasses(["px-[5%]", "rb-12", "text-md", "mb-4"]);
  const bem = assignBem([root], "Cta1", r);
  expect(bem.classesOf(root)).toEqual(["cta1_component"]);
  expect(bem.classesOf(a)).toEqual(bem.classesOf(b));
  expect(bem.classesOf(c)).toEqual(["cta1_text-2"]);
  expect(bem.styles.get("cta1_component")!.main).toEqual({ "padding-left": "5%", "padding-right": "5%" });
});

test("modo B: el prefijo va delante del bloque para no chocar con clases del sitio", async () => {
  const root: IREl = { kind: "el", tag: "section", attrs: {}, classes: ["px-[5%]"], children: [] };
  const bem = assignBem([root], "Cta1", await resolveClasses(["px-[5%]"]), "wfc-");
  expect(bem.classesOf(root)).toEqual(["wfc-cta1_component"]);
});
