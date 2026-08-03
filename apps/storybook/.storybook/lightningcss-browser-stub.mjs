// lightningcss es un binding nativo de Node: no existe en el navegador. El
// playground Copy to Webflow solo lo alcanzaria via prefixWebflowCss (prefijar
// headCss) — generate-xscp lo tolera con try/catch y el headCss se toma del
// artefacto de la docu, que es identico para cualquier variante.
export function transform() {
  throw new Error('lightningcss no disponible en el navegador');
}
