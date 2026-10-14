import { expect, test } from "bun:test";
import { resolveClasses } from "../src/tailwind/resolve";

test("un tailwind.config propio reemplaza al preset por defecto", async () => {
  const config = { theme: { extend: { colors: { marca: "#123456" } } } };
  const r = await resolveClasses(["bg-marca"], config);
  const decls = r.byClass.get("bg-marca")?.[0].decls ?? [];
  expect(decls.some(([p, v]) => p === "background-color" && v.includes("18 52 86"))).toBe(true);
});
