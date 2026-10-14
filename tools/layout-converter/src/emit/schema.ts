// Invariantes del portapapeles para la salida del conversor. Los tipos de nodo son los 61 observados en
// payloads copiados del Designer. Mas estricto que el Designer en un punto: hay payloads reales que
// referencian clases que no viajan en el payload (las aporta la style guide del sitio); la salida
// autocontenida no puede depender de eso, asi que aqui una clase colgante es error.
const NODE_TYPES = new Set([
  "Animation", "BackgroundVideoWrapper", "Block", "Blockquote", "DOM", "DropdownLink", "DropdownList",
  "DropdownToggle", "DropdownWrapper", "Emphasized", "Figcaption", "Figure", "FormBlockLabel", "FormButton",
  "FormCheckboxInput", "FormCheckboxWrapper", "FormErrorMessage", "FormForm", "FormInlineLabel", "FormRadioInput",
  "FormRadioWrapper", "FormSelect", "FormSuccessMessage", "FormTextInput", "FormTextarea", "FormWrapper", "Grid",
  "Heading", "HtmlEmbed", "Image", "InlineCode", "LightboxWrapper", "LineBreak", "Link", "List", "ListItem",
  "MapWidget", "NavbarBrand", "NavbarButton", "NavbarLink", "NavbarMenu", "NavbarWrapper", "Paragraph", "RichText",
  "SearchButton", "SearchForm", "SearchInput", "Section", "SliderArrow", "SliderMask", "SliderNav", "SliderSlide",
  "SliderWrapper", "Span", "Strong", "TabsContent", "TabsLink", "TabsMenu", "TabsPane", "TabsWrapper", "VFlex",
]);

export function validateXscp(clip: unknown): string[] {
  const errors: string[] = [];
  const c = clip as { type?: string; payload?: { nodes?: unknown[]; styles?: unknown[] } };
  if (c?.type !== "@webflow/XscpData") errors.push("type distinto de @webflow/XscpData");
  const nodes = (c?.payload?.nodes ?? []) as { _id?: string; text?: boolean; type?: string; classes?: string[]; children?: string[] }[];
  const styles = (c?.payload?.styles ?? []) as { _id?: string; name?: string; type?: string; comb?: string }[];
  if (!nodes.length) errors.push("sin nodos");
  const nodeIds = new Set<string>();
  for (const n of nodes) {
    if (!n._id) errors.push("nodo sin _id");
    else if (nodeIds.has(n._id)) errors.push(`_id de nodo duplicado ${n._id}`);
    else nodeIds.add(n._id);
  }
  const styleIds = new Set(styles.map((s) => s._id));
  const names = new Set<string>();
  for (const s of styles) {
    if (!s._id || !s.name || s.type !== "class") errors.push(`estilo invalido ${s.name ?? s._id}`);
    if (s.name && s.comb === "" && names.has(s.name)) errors.push(`clase base duplicada ${s.name}`);
    if (s.name) names.add(s.name);
  }
  const referenced = new Set<string>();
  for (const n of nodes) {
    if (n.text) continue;
    if (!n.type || !NODE_TYPES.has(n.type)) errors.push(`tipo de nodo desconocido ${n.type} en ${n._id}`);
    for (const ch of n.children ?? []) {
      if (!nodeIds.has(ch)) errors.push(`hijo colgante ${ch} en ${n._id}`);
      if (referenced.has(ch)) errors.push(`nodo con dos padres ${ch}`);
      referenced.add(ch);
    }
    for (const cl of n.classes ?? []) if (!styleIds.has(cl)) errors.push(`clase colgante ${cl} en ${n._id}`);
  }
  const first = nodes[0]?._id;
  if (first && referenced.has(first)) errors.push("el primer nodo no es raiz");
  return errors;
}
