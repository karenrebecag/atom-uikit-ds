// IR: arbol neutro entre el TSX evaluado y el emisor de Webflow.
export type IRText = { kind: "text"; value: string };
export type IREl = {
  kind: "el";
  tag: string;
  attrs: Record<string, unknown>;
  classes: string[];
  // identidad del componente de libreria que lo produjo (Button, TabsTrigger...), para mapear a nativos
  component?: { name: string; props: Record<string, unknown> };
  children: IRNode[];
};
export type IRNode = IRText | IREl;
