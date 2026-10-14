// Reproducen los bypasses de la revision de seguridad (2026-10-09). Todos deben fallar cerrado.
import { describe, expect, test } from "bun:test";
import { mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ForbiddenImport, rewriteSource } from "../src/eval/plugin";
import { evaluateSandboxed } from "../src/eval/sandbox";

const reject = (src: string) => expect(() => rewriteSource(src, "x.tsx")).toThrow(ForbiddenImport);

describe("frontera del evaluador", () => {
  test("import con comentario al final de linea", () => reject('import fs from "node:fs"; // x\nexport const A = () => null;'));
  test("import tras otra sentencia en la misma linea", () => reject('const a = 1; import fs from "node:fs";'));
  test("export desde otro modulo", () => {
    reject('export * from "node:fs";');
    reject('export { readFileSync } from "node:fs";');
  });
  test("especificador que coincide con una clave de Object.prototype", () =>
    reject('import { constructor as F } from "toString";'));
  test("import dinamico, require y acceso a globales", () => {
    reject('const m = await import("node:fs");');
    reject('const m = require("node:fs");');
    reject("const p = globalThis.process;");
    reject('const f = ({}).constructor.constructor("return 1");');
  });
  test("clausula de import que no es una lista de identificadores", () =>
    reject('import a, { b } from "react"; import "x"\nimport c from "react";'));

  test("la evaluacion por lotes corre en el sandbox y devuelve el arbol", async () => {
    const dir = realpathSync(mkdtempSync(join(tmpdir(), "wfc-sec-")));
    const f = join(dir, "Ok.tsx");
    writeFileSync(f, 'import { Button } from "@relume_io/relume-ui";\nexport const Ok = () => <Button>hola</Button>;');
    const [r] = await evaluateSandboxed([f]);
    expect(r.ok).toBe(true);
  });
});
