import { useState, type ReactNode, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { generateXscp } from '../../../../scripts/webflow/generate-xscp.mjs';

/**
 * Playground → Webflow: junto al preview de una story, copia la VARIANTE
 * ACTUAL (los mismos children que ves, con los controles aplicados) como
 * paste XscpData.
 *
 * Usa el MISMO generador del canal (`scripts/webflow/generate-xscp.mjs`, JS
 * puro sin Node): prefijo ds-, xattr data-*, SVG como HtmlEmbed y la lista
 * `unsupported` salen identicos al artefacto del registry. La diferencia con
 * el boton de la docu: aqui el markup es lo que configuraste, no el
 * previewProps fijo del build.
 *
 * El HTML se genera con renderToStaticMarkup AL CLICK, nunca leyendo el DOM
 * vivo: gsap y SplitText mutan el preview (inline styles, lineas divididas)
 * y ese runtime no debe viajar en el paste.
 *
 * El portapapeles necesita el flavor `application/json` (el Designer ignora
 * texto plano) — mismo truco que WebflowTab en la docu.
 */

export type CopyToWebflowProps = {
  /** Slug para los ids del clipboard (dedupe determinista al re-pegar). */
  slug: string;
  /** CSS fuente del componente (imports `?raw`), concatenado si hay partials. */
  css: string;
  children: ReactNode;
};

function copyWebflowClipboard(json: string): boolean {
  let ok = false;
  const handler = (e: ClipboardEvent) => {
    e.preventDefault();
    e.clipboardData?.setData('application/json', json);
    e.clipboardData?.setData('text/plain', json);
  };
  document.addEventListener('copy', handler);
  try {
    ok = document.execCommand('copy');
  } finally {
    document.removeEventListener('copy', handler);
  }
  return ok;
}

export function CopyToWebflow({ slug, css, children }: CopyToWebflowProps) {
  const [status, setStatus] = useState<string | null>(null);

  const onCopy = () => {
    try {
      const html = renderToStaticMarkup(children as ReactElement).replace(/<!--[\s\S]*?-->/g, '');
      const pkg = generateXscp(html, css, { slug });
      const ok = copyWebflowClipboard(JSON.stringify(pkg.clipboard));
      if (!ok) {
        setStatus('El navegador bloqueo el copy — usa el boton de la docu');
        return;
      }
      const head = pkg.headCss ? ' + reglas para head custom code (ver consola)' : '';
      if (pkg.headCss) console.info(`[copy-to-webflow] head CSS para ${slug}:\n${pkg.headCss}`);
      if (pkg.unsupported.length) console.info(`[copy-to-webflow] unsupported:`, pkg.unsupported);
      setStatus(`Copiado — pega en el Designer con Cmd+V${head}`);
    } catch (err) {
      setStatus(`No se pudo generar el paste: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3, 12px)', width: '100%' }}>
      {children}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3, 12px)' }}>
        <button
          type="button"
          onClick={onCopy}
          style={{
            font: 'inherit',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: 'var(--spacing-2, 8px) var(--spacing-4, 16px)',
            borderRadius: 'var(--radius-full, 999px)',
            border: '1px solid var(--border)',
            background: 'var(--secondary)',
            color: 'var(--secondary-foreground)',
            cursor: 'pointer',
          }}
        >
          Copy to Webflow
        </button>
        {status && (
          <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{status}</span>
        )}
      </div>
    </div>
  );
}
