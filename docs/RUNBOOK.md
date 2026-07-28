# Atom UIKit DS — Runbook operativo

Operar el design system **solo con este doc + enlaces**. Secretos nunca van aquí — solo
dónde viven y quién tiene acceso.

Specs históricos de fase 1/2 (Desktop): `atom-web-ds-specs/`, `atom-web-ds-hardening/` —
archivo de planeación; la verdad operativa es este runbook + `docs/decisions/`.

---

## 1. Release de tokens / CSS (cambio de lenguaje visual)

### Precondiciones
- Edits solo en `packages/tokens/src/**` (o CSS foundation que **referencia** semantics).
- Cero hex en components CSS; contrast pairs actualizados en `scripts/check-contrast.mjs`
  si hay texto nuevo.
- Ver `docs/decisions/` (OSMO, foregrounds oscuros, npm off).

### Pasos
1. Branch desde `main`.
2. Editar JSON DTCG → `pnpm --filter @atom-uikit/tokens build`.
3. Gates:
   ```bash
   pnpm validate
   pnpm validate:contrast
   pnpm build
   pnpm build:registry && pnpm validate:published
   ```
4. Si cambió CSS foundation/utilities: `pnpm --filter @atom-uikit/css build`.
5. QA visual: `pnpm --filter @atom-uikit/storybook dev` (checklist en
   `docs/qa-storybook-osmo.md`).
6. Changeset interno (minor/patch) si cambian paquetes versionados:
   `pnpm changeset` → commit.
7. PR → merge a `main` (**merge commit**, no squash en stacks).
8. Automático (con secrets): Action `deploy-public-dist` redeploya `/v1` + smoke.
9. **Deliberado** — re-skinear docs/MCP:
   ```bash
   export DOCS_DEPLOY_HOOK=<url del hook de docs>
   pnpm build:registry
   ```
   Confirmar F4 (productos que no deben cambiar look) **antes** del hook.
10. Esperar ≥5 min → validar MCP tokens (OSMO, sin zinc, `--link` presente).

### Verificación
- `curl -sI https://atom-web-ds.vercel.app/v1/tokens.css` → 200, ACAO `*`.
- `node public-dist/smoke.mjs https://atom-web-ds.vercel.app`.
- MCP / `tokens-nested` con `background #fafafa`, `green-electric`, Inter Tight.

### Rollback
- `/v1`: ver §2.  
- Docs: redeploy commit anterior del site docs o revert merge en `atom-uikit-ds` + hook.

---

## 2. Deploy y rollback del canal `/v1`

Detalle: `public-dist/README.md`.

### Automático
Push a `main` en `packages/tokens/**` | `packages/css/**` | `public-dist/**` →
`.github/workflows/deploy-public-dist.yml`.

Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

### Manual de emergencia
```bash
pnpm --filter @atom-uikit/tokens build
pnpm --filter @atom-uikit/css build
pnpm --filter @atom-uikit/public-dist build
npx vercel deploy public-dist/deploy --prod --yes
node public-dist/smoke.mjs https://atom-web-ds.vercel.app
```

### Rollback
```bash
npx vercel rollback <deployment-url-or-id> --yes
```
O redeploy de un commit conocido bueno (checkout paths → build → deploy).

**Nota org:** proyecto en scope personal `karenrebecags-projects`; transferir a
`atomchatio` cuando haya permisos; al transferir, rotar `VERCEL_ORG_ID`.

---

## 3. Sync Webflow Variables

Ver **`docs/webflow-playbook.md`** (fuente de verdad del protocolo).

Resumen:
1. `pnpm --filter @atom-uikit/tokens build`
2. `node scripts/sync-webflow.mjs --plan wf-plan.json` (~84 vars)
3. Sesión con **Webflow MCP** (`data_variable_tool`): query → create/update, mode `dark`.
4. **No** hay REST Data API para variables — no inventar clientes HTTP.
5. Segundo apply ≈ 100% unchanged (idempotencia).
6. Huérfanas: listar, no borrar auto.

Bloqueo actual: designar site staging + autorizar MCP en ese site.

---

## 4. Regenerar registry / docs

```bash
pnpm build:registry          # tokens build + public/r/* + tokens-nested.json
pnpm validate:published
# Con hook:
DOCS_DEPLOY_HOOK=... pnpm build:registry
```

- Registry auth en prod: Clerk / JWT / API key (`ATOM_REGISTRY_KEY` en consumidores).
- MCP cache: **5 min** tras deploy de docs.
- Sync a GitHub Contents (si aplica): `REGISTRY_SYNC_TOKEN` (PAT contents).

---

## 5. Inventario de accesos (sin secretos)

| Recurso | Dónde | Quién |
|---|---|---|
| Repo `atom-uikit-ds` | GitHub `karenrebecag/atom-uikit-ds` | Karen (+ colaboradores) |
| Docs site `uikit.atomchat.io` | Vercel proyecto docs | Karen / atomchatio |
| Canal `/v1` `atom-web-ds` | Vercel scope personal `karenrebecags-projects` | Karen; transfer → atomchatio pendiente |
| Deploy hook docs | Env `DOCS_DEPLOY_HOOK` (local/CI), no commitear | Karen |
| Vercel deploy CI | GitHub Secrets `VERCEL_*` | Karen configura |
| Registry sync | `REGISTRY_SYNC_TOKEN` (PAT) | Karen |
| Registry consumer key | `ATOM_REGISTRY_KEY` | Apps / MCP |
| Clerk (registry auth) | Dashboard Clerk del proyecto docs | Karen |
| Webflow sites | MCP connection + site auth | Karen designa staging |
| Fonts Envato | Licencia comercial 4 familias (Grift, Interval, Gantol, Inter Tight OFL) | Karen guarda comprobantes |
| npm | **Desconectado** — no publicar | — |

---

## 6. Decisiones (ADRs)

Ver `docs/decisions/`:

| ADR | Tema |
|---|---|
| 001 | OSMO/academy es el lenguaje web oficial |
| 002 | npm desconectado; canales privados + /v1 browser-facing |
| 003 | Webflow Variables vía plan + MCP, no REST |
| 004 | Foregrounds oscuros en brand/destructive (WCAG) |
| 005 | Motion comportamental diferido (W6) |

---

## 7. Checklist rápido “¿estoy listo para merge?”

- [ ] `pnpm build` verde  
- [ ] `pnpm validate` + `validate:contrast` + `validate:published`  
- [ ] Sin zinc/stone en tokens src; CSS de components sin hex nuevos  
- [ ] Storybook OK para componentes tocados  
- [ ] Changeset si aplica  
- [ ] No secretos en el diff  
