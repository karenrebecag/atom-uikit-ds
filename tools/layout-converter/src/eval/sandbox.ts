// El TSX a convertir es codigo no confiable: se evalua en un subproceso con sandbox-exec (sin red,
// sin escritura en /Users), entorno vacio y sin autoinstalacion. El padre solo recibe JSON.
import { resolve } from "node:path";
import type { IRNode } from "./ir";

const WORKER = resolve(import.meta.dir, "worker.ts");
const PROFILE = '(version 1)(allow default)(deny network*)(deny file-write* (subpath "/Users"))';

export type SandboxResult =
  | { file: string; ok: true; component: string; tree: IRNode[]; generic: string[] }
  | { file: string; ok: false; error: string };

export async function evaluateSandboxed(files: string[]): Promise<SandboxResult[]> {
  const proc = Bun.spawn(["/usr/bin/sandbox-exec", "-p", PROFILE, process.execPath, "--no-install", "run", WORKER], {
    stdin: new Blob([JSON.stringify(files)]),
    stdout: "pipe",
    stderr: "pipe",
    env: { PATH: "/usr/bin:/bin", HOME: "/private/tmp", TMPDIR: "/private/tmp" },
    cwd: "/private/tmp",
  });
  const [out, err, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
  if (code !== 0) throw new Error(`sandbox salio con ${code}: ${err.slice(0, 400)}`);
  return out.split("\n").filter(Boolean).map((l) => JSON.parse(l) as SandboxResult);
}
