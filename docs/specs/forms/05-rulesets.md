# 05 · Rulesets

Reglas duras. Un archivo que viole cualquiera de estas no está terminado, aunque compile
y pase los tests.

## §1 — TypeScript

- `strict: true`. Sin excepciones locales, sin `// @ts-expect-error` sin comentario que
  explique por qué es correcto.
- **Cero `any`.** Entrada externa entra como `unknown` y se estrecha antes de usarse.
- Funciones exportadas, utilidades compartidas y métodos públicos llevan tipos de
  parámetro y de retorno explícitos. Los locales obvios se infieren.
- `interface` para formas de objeto extensibles; `type` para uniones e intersecciones.

## §2 — Estilo

- Inmutabilidad: se crean objetos nuevos, nunca se muta el recibido. `{ ...x, campo }`,
  jamás `x.campo = v`.
- Comentarios de **por qué**, nunca de qué. Un comentario que narra la línea siguiente se
  borra.
- **Sin emojis.** En código, en comentarios, en docs y en mensajes de commit.
- Archivos de 200 a 400 líneas típico, 800 máximo. Funciones bajo 50 líneas. Anidamiento
  máximo de 4 niveles.
- Nada de `console.log` en código de producto.
- Cada archivo abre con el comentario de intención que le asigna `04-scaffold.md`, en sus
  palabras pero sin cambiarle el alcance.

## §3 — Seguridad

- **Ninguna credencial, token, API key ni URL de destino en el bundle.** El bundle es
  público. Si un agente necesita una, se detiene y escala.
- La validación de cliente es UX. La de seguridad ocurre en el validador. Nunca se
  documenta lo contrario.
- Ninguna petición a terceros sin consentimiento explícito verificado. Aplica a geo-IP.
- Nada de `innerHTML` con contenido que venga del servidor o del usuario. `textContent` o
  creación de nodos.
- Los mensajes de error que se muestran no incluyen detalle técnico del servidor.

## §4 — Grep de vestigios

Debe devolver cero. Es puerta de la Ola 1 y se corre en cada auditoría.

```bash
grep -rniE 'elementor|admin-ajax|atfx|aanumber|post_id|form_id|wp-admin|moove_gdpr|_atcg' \
  packages/forms/src packages/forms/test packages/layouts/src/form-lead.ts
```

Las dos cookies del proyecto origen (`_atcg`, `moove_gdpr_popup`) son de ATFX: aquí los
nombres de cookie son configuración, no constantes horneadas.

## §5 — Fronteras entre módulos

- `core/` no importa de `transport/`. El submitter se inyecta. Verificable con grep.
- Solo `core/dom.ts` hace `querySelector`. Cualquier otro módulo que consulte el DOM está
  mal cortado.
- Solo `transport/endpoint.ts` contiene la URL. Un segundo lugar con una URL es un defecto.
- `ui/` no importa de `transport/` ni de `schemas/` de negocio.

## §6 — Distribución

- Salida IIFE con global `AtomForms`, espejo de `AtomMotion`. Más una salida ESM.
- **Versión pinneada, no canal rodante.** `/v1.0.0/forms.js`, no `/v1/forms.js`. El motivo
  está en `02-arquitectura.md`: si el bundle se rompe, catorce landings dejan de capturar.
- SRI obligatorio: `register_hosted_script` de Webflow exige `integrity_hash`, así que el
  hash se necesita de todas formas.
- El bundle carga diferido. No bloquea render.
- Zod es la única dependencia de runtime permitida.

## §7 — Accesibilidad

No es opcional ni se recorta por tiempo.

- Todo control tiene label ligado por `for`/`id`.
- El error se anuncia: `aria-describedby` en el control y `role="alert"` en el mensaje.
- Al fallar el envío, el foco va al primer campo con error.
- El botón en carga lleva `aria-busy` y sigue siendo alcanzable por teclado.
- El thank-you recibe foco al montarse.
- Se respeta `prefers-reduced-motion`.
- Contraste mínimo AA en todo estado, incluido el de error.

## §8 — Git

- Nadie hace commit, push, merge ni rebase. Los agentes dejan el árbol de trabajo sucio y
  la persona decide.
- Nadie instala, actualiza ni quita dependencias sin aprobación explícita.
- Nadie toca `packages/tokens`, `registry.json`, ni configuración raíz del repo.
