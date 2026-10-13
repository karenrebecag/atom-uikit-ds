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

  const byId = new Map(roles.map((r) => [r.id, r]));
  for (const [name, a] of Object.entries(catalog.archetypes ?? {})) {
    const ids = [a.firstRole, a.lastRole, ...(a.requires ?? []), ...(a.arc ?? []).flat()];
    for (const id of ids) {
      const r = byId.get(id);
      if (!r) bad(`arquetipo ${name}: rol ${id} no existe en el catálogo`);
      else if (!r.generable) bad(`arquetipo ${name}: rol ${id} ${r.name} no es generable`);
    }
    if (a.minSections > a.maxSections) bad(`arquetipo ${name}: minSections > maxSections`);
    const flat = new Set((a.arc ?? []).flat());
    for (const id of a.requires ?? []) {
      if (!flat.has(id)) bad(`arquetipo ${name}: requires ${id} no aparece en el arc`);
    }
  }

  if (!reports.length) {
    const gen = roles.filter((r) => r.generable).length;
    reports.push({ level: 'ok', msg: `${gen}/${roles.length} roles generables, todos con layout vigente; ${contract.formRoleIds.length} roles de formulario excluidos (D2)` });
  }
  const gap = roles.filter((r) => r.reason === 'sin-layout');
  if (gap.length) reports.push({ level: 'note', msg: `${gap.length} roles sin layout (gap de autoría): ${gap.map((r) => r.name).join(', ')}` });
  return reports;
}
