# Publicar un organismo (de la card al canal)

Proceso canónico para que una pieza compuesta —una card de planes, un hero, una tabla
comparativa— quede **instalable y replicable**, no solo bonita en un preview. Validado
end-to-end el 2026-07-29 con `pricing-card` + `layout/pricing-plans` sobre `atom-pages`.

## La regla que lo motiva

**Un componente CSS-only publica pintura, no plano.** El item de registry de un
componente `framework: css` transporta su `.css` y nada más: qué etiquetas usar, en qué
orden, con qué átomos alrededor (`tag--mono`, `divider--labeled`, `feature__icon`) NO
viaja. Si esa anatomía solo existe en el repo que la consumió primero, cada consumidor
siguiente la reescribe a mano — y a la tercera reescritura ya son tres diseños distintos.

Por eso, todo organismo se publica **en dos piezas**:

| Pieza | Qué transporta | Canal |
|---|---|---|
| Componente(s) `packages/css/src/components/**` | el look (tokens, estados, responsive) | `/v1/embed.css` + registry |
| Layout `packages/layouts/src/<slug>.ts` | la anatomía (HTML con slots) + la rejilla | registry (`layout/<slug>`) |

El layout es *structure-only*: cero color, cero tipografía, cero espaciado de componente.
Solo su propia rejilla (`.l-<slug>__*`). Todo lo demás lo pone el DS.

## Pasos

### 1. Componentes y átomos primero

Cada bloque visible es un componente publicado. Si en el markup aparece un `<span>` con
estilos propios, falta un átomo: se crea (`packages/css/src/components/...`), se importa en
`components/index.css` y se registra en `registry.json`. Precedente: `feature`, `icon`,
`section-header` nacieron así, extraídos de la card de planes.

### 2. Layout con la anatomía

`packages/layouts/src/<slug>.ts` exporta `{ slug, name, description, components[], html, css }`.

Convenciones del `html`:

- Slots de contenido: `{{clave}}` — en texto y en atributos (`href`, `data-cta`, `aria-label`).
- Listas: el contenedor lleva `data-repeat="<clave>"` y **una** fila de ejemplo dentro. En
  no-code se duplica a mano; en código se clona por dato.
- Piezas opcionales (unidad de precio, chip de valor): se dejan puestas. El consumidor que
  no envía el slot se queda sin ese elemento — ver §4.
- Integraciones con comportamiento (WhatsApp/WCI): va el markup canónico del paquete +
  un comentario HTML con el `<script>` que el host debe cargar. El layout no inventa
  comportamiento ni iconos: los copia de su fuente.

### 3. Registro y deprecación

Entrada en `registry.json` con `name: "layout/<slug>"`, `kind: layout` (tier propio,
equivale al `registry:block` de shadcn), `installGroup: layouts`, `framework: css`,
y `registryDependencies` = tokens + foundation + **todos los componentes que el html usa**.
Esa lista es el contrato de instalación: quien instale el layout sabe qué CSS necesita.

`build:registry` publica el layout **autodescriptivo** — nadie necesita abrir el módulo
TypeScript para consumirlo:

- `files`: el `.ts` (para consumidores de código) + `layouts/<slug>.html` y
  `layouts/<slug>.css` **planos** (para no-code: copiar y pegar).
- `atom.layout`: contrato máquina-legible extraído del html — `slots` (los `{{...}}` de
  nivel superior), `repeats` (cada `data-repeat` con los slots de su fila) y `components`.
  Con esto el MCP o un consumidor arma el mapa de contenido sin parsear HTML.

Si sustituye a un layout anterior, el viejo se marca `DEPRECADO` en su `description` (JSON y
módulo) explicando por qué y a qué migrar. No se borra: puede estar pegado en un sitio vivo.

### 4. Consumo

Vanilla/no-code: copiar `layouts/<slug>.html` del artefacto, pegar, editar textos,
duplicar la fila marcada `data-repeat`.

Código: instalar el artefacto y rellenar. Referencia en `atom-pages`:
`scripts/install-registry.mjs` (resuelve deps `layout/*` transitivas, copia los files,
scopea el CSS plano bajo `.atom-embed`, y **verifica que cada componente del contrato
exista en embed.css** — el "instalé y se ve sin estilos" se detecta ahí) +
`src/core/template.ts` (`renderLayout`). Reglas del render, iguales para cualquier
consumidor:

- slot sin valor → se elimina el elemento que lo contiene (así los opcionales no dejan huecos);
- `\n` en un slot → `<br>`;
- `data-repeat` se consume y se retira del DOM final.

Regla dura para el CSS del layout: **muestra/oculta componentes, no les cambia su
`display` propio**. Precedente: navbar-simple ponía `display: block` al burger-icon
(átomo flex) y sus líneas colapsaban a 0×0 — el burger llevaba invisible en móvil desde
el inicio sin que ningún test lo viera.

### 5. Publicación

```bash
pnpm build:registry          # regenera public/r/*.json (incluye el layout y sus componentes)
# merge de public/r/ a main → Action sync-docs rebuilda docs → MCP (5 min), sin pasos manuales
# merge de packages/css a main → /v1/embed.css con el CSS nuevo
```

Sin ese commit no existe: el registry local no es un canal. `build:registry` además
**borra los huérfanos** de `public/r/` (items retirados de `registry.json`): el directorio
es un espejo del registry, no un acumulador.

### 6. QA

Story en Storybook por componente nuevo + baseline visual (`pnpm test:visual:update` en
darwin; CI hace bootstrap de las de linux). Doc en el CMS para que el MCP lo encuentre por
búsqueda (`atom_uikit_search`).

### 7. Prueba de aceptación (obligatoria)

**Un organismo está publicado cuando se puede reconstruir sin mirar el repo que lo creó.**

1. Borrar el markup a mano del consumidor.
2. Instalar el layout desde el registry.
3. Rellenar solo con datos.
4. El render debe ser idéntico al original.

Evidencia del caso `pricing-plans` (1440px, `atom-pages`): 2 cards, 7 y 5 filas de
beneficios, 4 y 3 chips de valor, unidad de precio solo en el plan que la tiene, botón de
WhatsApp con ancho intrínseco (199px sobre card de 602px) con `data-atom-button` y sus dos
iconos, card oscura en carbón `rgb(23,23,23)` con botón invertido, cero slots sin resolver,
cero errores de consola.

## Checklist

- [ ] `pnpm conformance` verde ANTES de empezar y DESPUÉS de terminar (contrato ejecutable)
- [ ] Cada bloque del markup es un componente publicado (ningún estilo huérfano en el consumidor)
- [ ] Layout `structure-only`: no define color/tipografía/espaciado de componente
- [ ] `registryDependencies` lista todos los componentes del html
- [ ] Layout anterior deprecado con motivo y ruta de migración
- [ ] `pnpm build:registry` + commit de `public/r/` a main
- [ ] Story + baseline por componente nuevo
- [ ] Prueba de aceptación §7 pasada, con evidencia
