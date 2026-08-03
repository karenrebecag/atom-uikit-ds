/// <reference types="vite/client" />

// El playground Copy to Webflow importa CSS de componente como texto y el
// generador XscpData del canal (JS puro sin imports de Node — verificado).
declare module '*.css?raw' {
  const src: string;
  export default src;
}

declare module '*/scripts/webflow/generate-xscp.mjs' {
  export function generateXscp(
    html: string,
    css: string,
    opts?: { slug?: string },
  ): {
    clipboard: object;
    headCss: string;
    footerNote: string;
    unsupported: Array<{ prop: string; selector: string; reason: string }>;
  };
}
