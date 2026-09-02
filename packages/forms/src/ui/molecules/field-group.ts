/**
 * Une label + control + error y cablea los ids y el aria. El único
 * lugar donde se decide la relación accesible entre las tres piezas.
 */
import type { FieldDef } from '../../core/types';
import type { Dict } from '../../i18n';
import { acceptance } from '../atoms/acceptance';
import { errorMessage } from '../atoms/error-message';
import { input } from '../atoms/input';
import { label } from '../atoms/label';
import { select } from '../atoms/select';

const LABEL_KEYS = [
  'nombre',
  'email',
  'whatsapp',
  'empresa',
  'cargo',
  'pais',
  'leads_mensuales',
  'objetivo',
  'sitio_web',
] as const;
const PLACEHOLDER_KEYS = ['nombre', 'email', 'whatsapp', 'empresa', 'sitio_web'] as const;

type LabelKey = (typeof LABEL_KEYS)[number];
type PlaceholderKey = (typeof PLACEHOLDER_KEYS)[number];

interface FieldIds {
  readonly controlId: string;
  readonly errorId: string;
}

export function fieldGroup(def: FieldDef, dict: Dict): HTMLElement {
  const ids = fieldIds(def.schemaKey);
  const group = document.createElement('div');
  group.className = 'field';

  if (def.kind !== 'acceptance') {
    group.appendChild(
      label({
        htmlFor: ids.controlId,
        text: labelText(dict, def.schemaKey),
        required: def.required,
      }),
    );
  }
  group.appendChild(renderControl(def, dict, ids));
  group.appendChild(errorMessage({ id: ids.errorId }));
  return group;
}

function fieldIds(schemaKey: string): FieldIds {
  return {
    controlId: `atom-field-${schemaKey}`,
    errorId: `atom-field-${schemaKey}-error`,
  };
}

function renderControl(def: FieldDef, dict: Dict, ids: FieldIds): HTMLElement {
  if (def.kind === 'acceptance') {
    return acceptance({
      id: ids.controlId,
      name: def.name,
      schemaKey: def.schemaKey,
      describedBy: ids.errorId,
      legal: labelText(dict, 'acceptance'),
      defaultChecked: def.defaultChecked,
      required: def.required,
    });
  }
  if (def.kind === 'select') {
    return select({
      id: ids.controlId,
      name: def.name,
      schemaKey: def.schemaKey,
      describedBy: ids.errorId,
      options: def.options,
      required: def.required,
    });
  }
  return input({
    id: ids.controlId,
    name: def.name,
    schemaKey: def.schemaKey,
    type: def.kind,
    describedBy: ids.errorId,
    placeholder: placeholderText(dict, def.schemaKey),
    required: def.required,
    pattern: def.pattern,
    autocomplete: autocompleteFor(def.schemaKey, def.kind),
  });
}

function isLabelKey(key: string): key is LabelKey {
  for (const item of LABEL_KEYS) {
    if (item === key) {
      return true;
    }
  }
  return false;
}

function isPlaceholderKey(key: string): key is PlaceholderKey {
  for (const item of PLACEHOLDER_KEYS) {
    if (item === key) {
      return true;
    }
  }
  return false;
}

function labelText(dict: Dict, schemaKey: string): string {
  if (isLabelKey(schemaKey)) {
    return dict.labels[schemaKey];
  }
  // La aceptacion no tiene etiqueta plana: se compone prefijo + enlace legal. Este
  // texto es el respaldo para quien renderice sin el enlace; el atomo lo arma bien.
  if (schemaKey === 'aceptacion') {
    return `${dict.labels.aceptacionPrefijo}${dict.labels.aceptacionEnlace}`;
  }
  return schemaKey;
}

function placeholderText(dict: Dict, schemaKey: string): string | undefined {
  if (isPlaceholderKey(schemaKey)) {
    return dict.placeholders[schemaKey];
  }
  return undefined;
}

// autocomplete real por campo: el navegador rellena y el usuario teclea menos, que es
// lo unico que baja de verdad la friccion de un formulario de diez controles.
const AUTOCOMPLETE: Readonly<Record<string, string>> = {
  nombre: 'name',
  email: 'email',
  whatsapp: 'tel',
  empresa: 'organization',
  sitio_web: 'url',
  pais: 'country',
};

function autocompleteFor(schemaKey: string, kind: 'text' | 'email' | 'tel'): string | undefined {
  const directo = AUTOCOMPLETE[schemaKey];
  if (directo !== undefined) {
    return directo;
  }
  if (kind === 'email') {
    return 'email';
  }
  if (kind === 'tel') {
    return 'tel';
  }
  return undefined;
}
