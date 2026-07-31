/**
 * Pure validator for registry item meta.agent (F3).
 * No I/O — build-registry and tests call validateAgentMeta().
 */

export const GOTCHA_CONTEXTS = Object.freeze([
  'react',
  'ssr',
  'css-modules',
  'a11y',
  'layout',
]);

/**
 * @param {string} slug
 * @param {unknown} agent
 * @param {string[]} knownProps — prop names from atom.discovery.props
 * @returns {{ ok: true } | { ok: false, errors: string[] }}
 */
export function validateAgentMeta(slug, agent, knownProps) {
  const errors = [];
  const propSet = new Set(knownProps);

  if (agent == null || typeof agent !== 'object' || Array.isArray(agent)) {
    errors.push(`${slug}: meta.agent must be an object`);
    return { ok: false, errors };
  }

  const a = /** @type {Record<string, unknown>} */ (agent);

  if (!Array.isArray(a.configurables)) {
    errors.push(`${slug}: meta.agent.configurables must be an array`);
  } else {
    for (const raw of a.configurables) {
      errors.push(...validateConfigurable(slug, raw, propSet));
    }
  }

  if (!Array.isArray(a.gotchas)) {
    errors.push(`${slug}: meta.agent.gotchas must be an array`);
  } else {
    for (const g of a.gotchas) {
      errors.push(...validateGotcha(slug, g));
    }
  }

  if (typeof a.usage !== 'string' || !a.usage.trim()) {
    errors.push(`${slug}: meta.agent.usage must be a non-empty string`);
  }

  return errors.length ? { ok: false, errors } : { ok: true };
}

/**
 * @param {string} slug
 * @param {unknown} raw
 * @param {Set<string>} propSet
 * @returns {string[]}
 */
function validateConfigurable(slug, raw, propSet) {
  const errors = [];
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    errors.push(`${slug}: configurable must be an object`);
    return errors;
  }
  const c = /** @type {Record<string, unknown>} */ (raw);
  const prop = c.prop;

  if (typeof prop !== 'string' || !prop) {
    errors.push(`${slug}: configurable missing prop name`);
    return errors;
  }

  const tag = `${slug}.${prop}`;

  if (!propSet.has(prop)) {
    errors.push(`${tag}: prop does not exist on component`);
  }

  if (typeof c.what !== 'string' || !c.what.trim()) {
    errors.push(`${tag}: what is required`);
  }
  if (typeof c.how !== 'string' || !c.how.trim()) {
    errors.push(`${tag}: how is required`);
  }

  const type = c.type;
  if (type === 'number') {
    for (const key of ['min', 'max', 'step']) {
      if (typeof c[key] !== 'number' || Number.isNaN(/** @type {number} */ (c[key]))) {
        errors.push(`${tag}: number type requires numeric ${key}`);
      }
    }
    if (typeof c.unit !== 'string' || !c.unit.trim()) {
      errors.push(`${tag}: number type requires unit`);
    }
  } else if (type === 'select' || type === 'multiselect') {
    if (!Array.isArray(c.options) || c.options.length === 0) {
      errors.push(`${tag}: ${type} type requires non-empty options`);
    } else if (c.default !== undefined && c.default !== null) {
      const def = String(c.default);
      const opts = c.options.map(String);
      if (!opts.includes(def)) {
        errors.push(`${tag}: default "${def}" is not in options`);
      }
    }
  } else if (type === 'boolean') {
    // no extra fields required
  } else {
    errors.push(`${tag}: type must be number|select|boolean|multiselect`);
  }

  return errors;
}

/**
 * @param {string} slug
 * @param {unknown} raw
 * @returns {string[]}
 */
function validateGotcha(slug, raw) {
  const errors = [];
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    errors.push(`${slug}: gotcha must be an object`);
    return errors;
  }
  const g = /** @type {Record<string, unknown>} */ (raw);
  if (!GOTCHA_CONTEXTS.includes(/** @type {string} */ (g.context))) {
    errors.push(
      `${slug}: gotcha.context must be one of ${GOTCHA_CONTEXTS.join('|')} (got ${JSON.stringify(g.context)})`,
    );
  }
  if (typeof g.note !== 'string' || !g.note.trim()) {
    errors.push(`${slug}: gotcha.note is required`);
  } else if (g.note.length > 300) {
    errors.push(`${slug}: gotcha.note must be ≤ 300 chars`);
  }
  return errors;
}
