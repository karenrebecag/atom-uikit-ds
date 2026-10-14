// Proceso hijo del sandbox: evalua los TSX recibidos por stdin (JSON array de rutas) y escribe
// una linea JSON por archivo en stdout. Solo se lanza desde sandbox.ts.
import { evaluate } from "./evaluate";

const files = JSON.parse(await Bun.stdin.text()) as string[];
for (const file of files) {
  try {
    const r = await evaluate(file);
    process.stdout.write(JSON.stringify({ file, ok: true, ...r }) + "\n");
  } catch (e) {
    process.stdout.write(JSON.stringify({ file, ok: false, error: e instanceof Error ? e.message : String(e) }) + "\n");
  }
}
