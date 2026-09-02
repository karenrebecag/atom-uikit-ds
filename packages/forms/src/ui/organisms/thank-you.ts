/**
 * Reemplaza el form tras éxito. Recibe foco para que un lector de
 * pantalla anuncie el cambio. Sin confeti ni animación bloqueante.
 */
import type { SuccessContext } from '../../core/types';
import type { Dict } from '../../i18n';

export function renderThankYou(dict: Dict): HTMLElement {
  const root = document.createElement('div');
  root.className = 'empty';
  root.setAttribute('role', 'status');
  root.tabIndex = -1;

  const header = document.createElement('div');
  header.className = 'empty__header';

  const title = document.createElement('h3');
  title.className = 'empty__title';
  title.textContent = dict.thankYou.title;

  const message = document.createElement('p');
  message.className = 'empty__description';
  message.textContent = dict.thankYou.message;

  header.append(title, message);
  root.appendChild(header);
  focusThankYou(root);
  return root;
}

export function attachThankYou(ctx: SuccessContext): void {
  const node = renderThankYou(ctx.dict);
  if (ctx.form.isConnected) {
    ctx.form.replaceWith(node);
  } else {
    ctx.mount.replaceChildren(node);
  }
  node.focus();
}

function focusThankYou(el: HTMLElement): void {
  if (el.isConnected) {
    el.focus();
    return;
  }
  // Why: focus() antes de insertar no mueve el foco; el test exige foco al montar.
  queueMicrotask(() => {
    if (el.isConnected) {
      el.focus();
    }
  });
}
