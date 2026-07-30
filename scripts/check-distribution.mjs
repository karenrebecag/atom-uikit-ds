#!/usr/bin/env node
/**
 * Contrato del PIPELINE de distribución.
 *
 * Los budgets vigilan el peso de los artefactos; esto vigila que la maquinaria que
 * los publica sea coherente consigo misma. Cada check existe porque el fallo que
 * previene ya ocurrió (ver referencias en cada mensaje).
 *
 * Todo se deriva de public-dist/channel.json: si este archivo tuviera su propia
 * lista de paquetes, volvería a desincronizarse y no serviría de nada.
 *
 * Parseo dirigido en vez de un parser de YAML a propósito: solo hace falta leer
 * `on.push.paths` y las líneas `run:`, y sumar una dependencia para eso costaría
 * más de lo que resuelve.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

export function checkDistribution({ fail, ok, note }) {
  const channel = readJson(join(ROOT, 'public-dist', 'channel.json'));
  const S = 'distribution';

  const sources = [...new Set(channel.artifacts.map((a) => a.from))];
  if (channel.fonts?.from) sources.push(channel.fonts.from);
  const sourcePkgs = [...new Set(sources)];

  // 1 — Regla 9: quien consume build-output ajeno lo declara como workspace:*.
  //     Sin la declaración turbo no conoce el orden (rompió storybook y css antes,
  //     y public-dist no declaraba NINGUNA hasta 2026-07-30).
  const consumerDir = join(ROOT, channel.consumer);
  const consumerPkg = readJson(join(consumerDir, 'package.json'));
  const declared = {
    ...(consumerPkg.dependencies ?? {}),
    ...(consumerPkg.devDependencies ?? {}),
  };
  for (const pkg of sourcePkgs) {
    if (!declared[pkg]) {
      fail(S, `${channel.consumer} consume ${pkg} pero no lo declara (regla 9: workspace:*)`);
    } else if (!String(declared[pkg]).startsWith('workspace:')) {
      fail(S, `${channel.consumer} declara ${pkg} como "${declared[pkg]}" — debe ser workspace:*`);
    }
  }
  if (sourcePkgs.every((p) => String(declared[p] ?? '').startsWith('workspace:'))) {
    ok(S, `${channel.consumer} declara sus ${sourcePkgs.length} deps de build como workspace:*`);
  }

  // 2 — El lockfile conoce esas deps. El CI instala con --frozen-lockfile: declarar
  //     una dep sin regenerar el lockfile revienta el deploy en el install.
  const lockPath = join(ROOT, 'pnpm-lock.yaml');
  if (!existsSync(lockPath)) {
    note(S, 'pnpm-lock.yaml ausente — sin verificar');
  } else {
    const lock = readFileSync(lockPath, 'utf8');
    const importer = new RegExp(
      `^  ${channel.consumer}:\\s*$([\\s\\S]*?)(?=^  \\S|^packages:)`,
      'm'
    ).exec(lock);
    if (!importer) {
      fail(S, `pnpm-lock.yaml no tiene entrada para ${channel.consumer} (corre pnpm install --lockfile-only)`);
    } else {
      // pnpm cita los nombres con scope: `'@atom-uikit/css':`, así que no se puede
      // buscar `nombre:` literal.
      const missing = Object.keys(declared).filter(
        (d) => !new RegExp(`['"]?${escapeRe(d)}['"]?\\s*:`).test(importer[1])
      );
      if (missing.length) {
        fail(
          S,
          `pnpm-lock.yaml desactualizado para ${channel.consumer}: falta ${missing.join(', ')} (pnpm install --lockfile-only)`
        );
      } else {
        ok(S, `pnpm-lock.yaml en sync con ${channel.consumer}/package.json`);
      }
    }
  }

  // 3 — Vercel compila cada paquete origen. Sin esto el build muere en su requireFile.
  const vercel = readJson(join(ROOT, channel.pipeline.vercelConfig));
  const buildCmd = vercel.buildCommand ?? '';
  const missingVercel = sourcePkgs.filter((p) => !buildCmd.includes(p));
  if (missingVercel.length) {
    fail(S, `${channel.pipeline.vercelConfig} buildCommand no compila: ${missingVercel.join(', ')}`);
  } else {
    ok(S, `buildCommand de Vercel compila los ${sourcePkgs.length} paquetes origen`);
  }

  // 4 y 5 — El workflow compila cada paquete origen Y se dispara con sus rutas.
  const wfPath = join(ROOT, channel.pipeline.workflow);
  if (!existsSync(wfPath)) {
    fail(S, `${channel.pipeline.workflow} no existe`);
  } else {
    const wf = readFileSync(wfPath, 'utf8');

    const missingSteps = sourcePkgs.filter((p) => !new RegExp(`run:.*${escapeRe(p)}`).test(wf));
    if (missingSteps.length) {
      fail(S, `el workflow no compila: ${missingSteps.join(', ')}`);
    } else {
      ok(S, `el workflow compila los ${sourcePkgs.length} paquetes origen`);
    }

    // on.push.paths — un cambio en un paquete origen debe redesplegar el canal.
    const pathsBlock = /paths:\s*$([\s\S]*?)(?=^\s{2}\w|^\w)/m.exec(wf);
    const triggers = pathsBlock
      ? [...pathsBlock[1].matchAll(/^\s*-\s*'([^']+)'/gm)].map((m) => m[1])
      : [];
    const expected = [
      ...sourcePkgs.map((p) => `${channel.packageDirs[p]}/**`),
      ...channel.pipeline.extraTriggerPaths,
    ];
    const missingTriggers = expected.filter((e) => !triggers.includes(e));
    if (missingTriggers.length) {
      fail(S, `el workflow no se dispara con: ${missingTriggers.join(', ')}`);
    } else {
      ok(S, `el workflow se dispara con las ${expected.length} rutas del contrato`);
    }
  }

  // 6 — Los artefactos declarados existen tras el build (fuentes de origen).
  const missingSrc = channel.artifacts.filter((a) => !existsSync(join(ROOT, a.path)));
  if (missingSrc.length) {
    note(S, `sin construir: ${missingSrc.map((a) => a.out).join(', ')} — corre pnpm build`);
  } else {
    ok(S, `los ${channel.artifacts.length} artefactos de origen existen`);
  }

  // 7 — Y llegan al canal ensamblado. Atrapa que /v1 sirva de menos.
  const outDir = join(ROOT, 'public-dist', 'out', channel.major);
  if (!existsSync(outDir)) {
    note(S, `public-dist/out/${channel.major} no existe — corre el build del canal`);
  } else {
    const present = new Set(readdirSync(outDir));
    const missingOut = channel.artifacts.filter((a) => !present.has(a.out));
    if (missingOut.length) {
      fail(S, `/${channel.major} no publica: ${missingOut.map((a) => a.out).join(', ')}`);
    } else {
      ok(S, `/${channel.major} publica los ${channel.artifacts.length} artefactos declarados`);
    }
  }
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

if (import.meta.url === `file://${process.argv[1]}`) {
  let failures = 0;
  checkDistribution({
    fail: (s, m) => {
      failures++;
      console.error(`  FAIL  [${s}] ${m}`);
    },
    ok: (s, m) => console.log(`  OK    [${s}] ${m}`),
    note: (s, m) => console.log(`  nota  [${s}] ${m}`),
  });
  console.log(failures ? `\n${failures} violaciones` : '\npipeline de distribución en verde');
  process.exit(failures ? 1 : 0);
}
