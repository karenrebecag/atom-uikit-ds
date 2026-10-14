import { describe, expect, test } from "bun:test";
import { emit, webflowTracks, type ClassStyle } from "../src/emit/xscp";
import { validateXscp } from "../src/emit/schema";
import type { IREl } from "../src/eval/ir";

const el = (tag: string, children: IREl["children"] = [], extra: Partial<IREl> = {}): IREl =>
  ({ kind: "el", tag, attrs: {}, classes: [], children, ...extra });

function pkgFor(tree: IREl, styles: Record<string, ClassStyle>, classOf: (e: IREl) => string[]) {
  return emit({ slug: "t", tree: [tree], classesOf: classOf, styles: new Map(Object.entries(styles)) });
}

describe("emisor XscpData", () => {
  test("el payload cumple los invariantes: raiz primero, sin ids colgantes, tipos nativos", () => {
    const tree = el("section", [el("h2", [{ kind: "text", value: "Hola" }]), el("button", [{ kind: "text", value: "Ir" }]), el("svg"), el("input")]);
    const pkg = pkgFor(tree, { t_component: { main: { display: "flex" }, variants: {}, states: {} } }, (e) => (e === tree ? ["t_component"] : []));
    expect(validateXscp(pkg.clipboard)).toEqual([]);
    const nodes = (pkg.clipboard.payload as { nodes: { type?: string; tag?: string; data?: { button?: boolean; xattr?: { name: string }[] } }[] }).nodes;
    expect(nodes[0].tag).toBe("section");
    const btn = nodes.find((n) => n.type === "Link")!;
    expect([btn.tag, btn.data?.button, btn.data?.xattr?.[0]?.name]).toEqual(["a", true, "role"]);
    expect(nodes.some((n) => n.type === "HtmlEmbed")).toBe(true);
    expect(nodes.some((n) => n.type === "DOM")).toBe(true);
  });

  test("un span dentro de un parrafo sale como Span nativo, no como Block (div dentro de p)", () => {
    const tree = el("p", [el("span", [{ kind: "text", value: "Cargo" }])]);
    const pkg = pkgFor(tree, {}, () => []);
    const nodes = (pkg.clipboard.payload as { nodes: { type?: string; tag?: string }[] }).nodes;
    expect(nodes[1]).toMatchObject({ type: "Span", tag: "span" });
  });

  test("las propiedades inseguras y los estados sin variante van al head, no a las variantes", () => {
    const tree = el("div");
    const pkg = pkgFor(tree, {
      t_card: {
        main: { "aspect-ratio": "16 / 9", display: "block" },
        variants: { small: { "aspect-ratio": "1 / 1", "padding-top": "1rem" } },
        states: { ":hover": { opacity: "0.8" }, ":focus-visible": { outline: "2px solid" } },
      },
    }, () => ["t_card"]);
    const style = (pkg.clipboard.payload as { styles: { styleLess: string; variants: Record<string, { styleLess: string }> }[] }).styles[0];
    expect(style.styleLess).toBe("display: block;");
    expect(style.variants.small.styleLess).toBe("padding-top: 1rem;");
    expect(style.variants.main_hover.styleLess).toBe("opacity: 0.8;");
    expect(JSON.stringify(style)).not.toContain("aspect-ratio");
    expect(pkg.headCss).toContain(".t_card {\n  aspect-ratio: 16 / 9;");
    expect(pkg.headCss).toContain("@media (max-width: 767px)");
    expect(pkg.headCss).toContain(".t_card:focus-visible");
  });
});

test("las pistas de grid salen en el dialecto de Webflow: sin repeat() ni minmax(0, Nfr)", () => {
  expect(webflowTracks("repeat(2, minmax(0, 1fr))")).toBe("1fr 1fr");
  expect(webflowTracks("repeat(3, 1fr)")).toBe("1fr 1fr 1fr");
  expect(webflowTracks("minmax(200px, 1fr) 2fr")).toBe("minmax(200px, 1fr) 2fr");
});
