/**
 * Smoke del canal de consumo por codigo: `add` contra el espejo real public/r,
 * servido por HTTP local. Si el contrato del registry (index + per-item +
 * registryDependencies) o el resolver de aliases se rompen, esto falla antes
 * de que lo sufra un consumidor.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const REGISTRY_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../public/r',
);

let server: http.Server;
let projectDir: string;
const originalCwd = process.cwd();

before(async () => {
  server = http.createServer((req, res) => {
    const file = path.join(REGISTRY_DIR, path.basename(req.url ?? ''));
    if (!fs.existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(fs.readFileSync(file));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as { port: number };

  projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'atom-uikit-cli-'));
  fs.writeFileSync(
    path.join(projectDir, 'atom-uikit.json'),
    JSON.stringify({
      tsx: true,
      framework: 'next',
      aliases: {
        components: 'src/components',
        styles: 'src/styles',
        foundations: 'src/styles/foundations',
      },
      registry: `http://127.0.0.1:${port}`,
    }),
  );
  process.env.ATOM_REGISTRY_KEY = 'smoke-test-token';
  process.chdir(projectDir);
});

after(() => {
  process.chdir(originalCwd);
  server?.close();
  fs.rmSync(projectDir, { recursive: true, force: true });
});

test('add copia un atomo con su source React + CSS en los aliases', async () => {
  const { add } = await import('../add.js');
  await add('button');

  const tsx = path.join(projectDir, 'src/components/atoms/Button.tsx');
  const css = path.join(projectDir, 'src/styles/components/button.css');
  assert.ok(fs.existsSync(tsx), 'Button.tsx no se escribio');
  assert.ok(fs.existsSync(css), 'button.css no se escribio');

  const item = JSON.parse(
    fs.readFileSync(path.join(REGISTRY_DIR, 'button.json'), 'utf8'),
  );
  const expected = item.files.find((f: { path: string }) =>
    f.path.endsWith('Button.tsx'),
  );
  assert.equal(fs.readFileSync(tsx, 'utf8'), expected.content);
});

test('add de un layout resuelve registryDependencies transitivamente', async () => {
  const { add } = await import('../add.js');
  await add('layout--pricing-plans');

  for (const dep of ['pricing-card', 'section-header', 'tag']) {
    const item = JSON.parse(
      fs.readFileSync(path.join(REGISTRY_DIR, `${dep}.json`), 'utf8'),
    );
    for (const file of item.files) {
      const rel = file.path
        .replace(/^components\//, 'src/components/')
        .replace(/^styles\/foundations\//, 'src/styles/foundations/')
        .replace(/^styles\//, 'src/styles/');
      assert.ok(
        fs.existsSync(path.join(projectDir, rel)),
        `dependencia ${dep}: falta ${rel}`,
      );
    }
  }
});

test('add no reescribe archivos que el consumidor ya tiene', async () => {
  const { add } = await import('../add.js');
  const css = path.join(projectDir, 'src/styles/components/input.css');
  const marker = '/* modificado por el consumidor */';
  fs.mkdirSync(path.dirname(css), { recursive: true });
  fs.writeFileSync(css, marker);

  await add('input');

  assert.equal(fs.readFileSync(css, 'utf8'), marker, 'sobrescribio un archivo del consumidor');
  assert.ok(
    fs.existsSync(path.join(projectDir, 'src/components/atoms/Input.tsx')),
    'no escribio los archivos faltantes del item',
  );
});
