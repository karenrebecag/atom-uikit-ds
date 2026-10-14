import { describe, expect, test } from "bun:test";
import { mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { evaluate } from "../src/eval/evaluate";
import type { IREl, IRNode } from "../src/eval/ir";
import { ForbiddenImport, rewriteSource } from "../src/eval/plugin";

const dir = realpathSync(mkdtempSync(join(tmpdir(), "wfc-eval-")));
const write = (name: string, src: string) => {
  const f = join(dir, name);
  writeFileSync(f, src);
  return f;
};
const texts = (n: IRNode): string[] => (n.kind === "text" ? [n.value] : n.children.flatMap(texts));

describe("evaluador", () => {
  test("un import fuera de la lista blanca falla antes de ejecutar", () => {
    expect(() => rewriteSource('import fs from "node:fs";\nfs.rmSync("/x");', "x.tsx")).toThrow(ForbiddenImport);
  });

  test("Defaults + spread + map + condicional dan el arbol del primer render", async () => {
    const f = write(
      "Sec.tsx",
      `import { Button } from "@relume_io/relume-ui";
       import clsx from "clsx";
       type Props = { heading: string; items: string[]; show?: boolean };
       export const Sec = (props: Partial<Props>) => {
         const { heading, items, show } = { ...SecDefaults, ...props };
         return (<section className={clsx("py-16", { "md:py-24": true, hidden: false })}>
           <h2>{heading}</h2>
           {items.map((t, i) => <Button key={i} variant="secondary">{t}</Button>)}
           {show && <p>visible</p>}
         </section>);
       };
       export const SecDefaults: Props = { heading: "Hola", items: ["A", "B"], show: false };`,
    );
    const r = await evaluate(f);
    const root = r.tree[0] as IREl;
    expect(root.classes).toEqual(["py-16", "md:py-24"]);
    expect(texts(root)).toEqual(["Hola", "A", "B"]);
    const btn = root.children[1] as IREl;
    expect(btn.component?.name).toBe("Button");
    expect(btn.component?.props).toEqual({ variant: "secondary" });
  });

  test("asChild fusiona la primitiva con su hijo en vez de envolverlo", async () => {
    const f = write(
      "Trig.tsx",
      `import { DialogTrigger } from "@relume_io/relume-ui";
       export const Trig = () => <DialogTrigger asChild className="x"><a className="y">ver</a></DialogTrigger>;`,
    );
    const el = (await evaluate(f)).tree[0] as IREl;
    expect(el.tag).toBe("a");
    expect(el.classes).toEqual(["y", "x"]);
    expect(el.component?.name).toBe("DialogTrigger");
  });
});
