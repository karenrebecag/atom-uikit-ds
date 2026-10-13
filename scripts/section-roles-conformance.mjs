/**
 * Contrato del catálogo de roles de sección: todo rol generable tiene al menos
 * un layout vigente que lo realice, y los roles de formulario nunca son generables.
 * Pura: recibe datos y devuelve reportes { level, msg }.
 */

export function checkSectionRoles({ catalog, contract, layoutSlugs, excludedSlugs = [], publishedText, sourceText }) {
  const reports = [];
  const bad = (msg) => reports.push({ level: 'fail', msg });
  const roles = catalog.roles ?? [];
  const live = new Set([...layoutSlugs].filter((s) => !excludedSlugs.includes(s)));

  for (const key of ['id', 'slug']) {
    const seen = new Set();
    for (const r of roles) {
      if (seen.has(r[key])) bad(`rol duplicado por ${key}: ${r[key]}`);
      seen.add(r[key]);
    }
  }

  for (const r of roles) {
    if (r.generable) {
      if (!r.layouts?.length) bad(`rol generable sin layout: ${r.id} ${r.name}`);
      for (const l of r.layouts ?? []) {
        if (!layoutSlugs.has(l)) bad(`${r.name}: layout inexistente "${l}"`);
        else if (!live.has(l)) bad(`${r.name}: layout "${l}" es legacy/deprecated, no realiza un rol generable`);
      }
    } else if (!r.reason) {
      bad(`rol no generable sin reason: ${r.id} ${r.name}`);
    }
  }

  for (const id of contract.formRoleIds) {
    const r = roles.find((x) => x.id === id);
    if (!r) bad(`rol de formulario ${id} ausente del catálogo`);
    else if (r.generable || r.reason !== 'form') bad(`D2: rol de formulario ${id} ${r.name} debe ser generable:false con reason "form"`);
  }

  // Anti-deriva: el conector lee public/r/section-roles.json, no la fuente.
  if (publishedText !== undefined && publishedText !== sourceText) {
    bad('public/r/section-roles.json difiere de packages/layouts/section-roles.json (corre pnpm build:registry y commitea)');
  }

  const bySlug = new Map(roles.map((r) => [r.slug, r]));
  const archetypes = catalog.archetypes ?? [];
  const bySlugArch = new Map(archetypes.map((a) => [a.slug, a]));
  if (archetypes.length && !bySlugArch.has(catalog.defaultArchetype)) {
    bad(`defaultArchetype "${catalog.defaultArchetype}" no existe en archetypes`);
  }
  for (const raw of archetypes) {
    const base = raw.extends ? bySlugArch.get(raw.extends) : undefined;
    if (raw.extends && !base) bad(`arquetipo ${raw.slug}: extends "${raw.extends}" no existe`);
    const a = { ...base, ...raw };
    for (const s of [...(a.required ?? []), ...(a.order ?? [])]) {
      const r = bySlug.get(s);
      if (!r) bad(`arquetipo ${raw.slug}: rol "${s}" no existe en el catálogo`);
      else if (!r.generable) bad(`arquetipo ${raw.slug}: rol "${s}" no es generable`);
    }
    if (!(a.min <= a.max)) bad(`arquetipo ${raw.slug}: min debe ser <= max`);
  }

  if (!reports.length) {
    const gen = roles.filter((r) => r.generable).length;
    reports.push({ level: 'ok', msg: `${gen}/${roles.length} roles generables, todos con layout vigente; ${contract.formRoleIds.length} roles de formulario excluidos (D2)` });
  }
  const gap = roles.filter((r) => r.reason === 'sin-layout');
  if (gap.length) reports.push({ level: 'note', msg: `${gap.length} roles sin layout (gap de autoría): ${gap.map((r) => r.name).join(', ')}` });
  return reports;
}
