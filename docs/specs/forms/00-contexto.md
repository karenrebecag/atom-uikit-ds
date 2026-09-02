# 00 · Contexto

## De dónde sale

Existe un formulario en producción para otra empresa (ATFX) en
`~/Desktop/SoftwareDevProjects/atfx-forms-newAug26`. Está bien factorizado: motor de
validación en vivo, unión discriminada `FieldDef` como fuente única de render + `name` de
envío + clave de validación, errores de servidor mapeados a campo, integraciones aisladas
en `Promise.allSettled`, geo con consentimiento, i18n donde el schema es factory del
diccionario.

Todo su acoplamiento a ATFX vive en una superficie pequeña:

| Acoplado | Qué es | Destino |
|---|---|---|
| `core/submit-elementor.ts` (41 ln) | POST a `admin-ajax.php` de WordPress | Se reescribe contra el validador |
| `ElementorResponse` en `types.ts` | Contrato de respuesta de Elementor | Se reemplaza por el de `03` |
| `FormConfig.meta` | `post_id`, `form_id`, `action` | Desaparece |
| `schemas/interest.ts`, `data/options.ts` | Schema de negocio de ATFX | La forma transfiere, el contenido no |
| `styles/forms.css` (`.atfx-*`) | Estilos propios | Redundante: el DS ya publica los átomos |
| `attribution.ts` | Hack de `referrer` porque el pipeline de ATFX ignora los `utm_*` | Se simplifica: aquí los UTM van como campos |

**Nota de propiedad:** el proyecto origen es de un cliente distinto. Se extraen patrones y
arquitectura. Antes de mover código literal, la persona confirma qué permite el contrato.
Un agente que dude, extrae la forma y reescribe, no copia y pega.

## Con qué convive

El DS ya publica la mitad visual: `packages/css/src/components/forms/` trae `field`,
`input`, `select`, `checkbox`, `radio`, `textarea`, `combobox` y `toggle`, y viajan en
`/v1/embed.css`. Este paquete **no vuelve a escribir estilos de campo**.

El precedente estructural es `packages/animations`: comportamiento en un IIFE con global,
configurado por atributos leídos del DOM en runtime, cero código por página. Este paquete
lo copia deliberadamente.

## Qué reemplaza

Nada en producción todavía. Es capacidad nueva del DS. La LP de pauta lo consumirá en su
versión con formulario, que llega después de la versión con conversión por WhatsApp.
