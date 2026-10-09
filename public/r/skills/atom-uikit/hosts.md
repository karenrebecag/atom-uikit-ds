# Hosts: dónde vive la página

Elige el host antes de escribir. El host decide qué CSS cargas y qué no puedes hacer.

| Host | CSS que cargas | Notas |
|---|---|---|
| Código propio con shadcn (React, Next) | `atom-foundation` del canal shadcn, una vez, antes del CSS de los componentes | cada componente ya lo declara como dependencia |
| HTML estático o documento propio | `/v1/foundation.css` o `/v1/atom.css` del canal público | versionado: `/v1/` no rompe |
| Webflow o WordPress (host ajeno) | `/v1/embed.css`, y montas dentro de `.atom-embed` | nunca `foundation.css` ni `atom.css`: reestilizan la página del host |

## Foundation, una vez

Sin la foundation no hay tokens y todo sale sin color, radio ni tiempo. Instálala una vez, en el entry
global de estilos, antes del CSS de los componentes. Si la página ya carga `/v1/foundation.css` por
`<link>`, no instales el nodo: sería la misma hoja dos veces. Dark mode es `data-theme="dark"` en la raíz.

## Webflow

Webflow es front y CMS; los datos siempre van por un endpoint propio desacoplado. Restricciones duras del host:

- El valor de un atributo no se bindea a un campo del CMS ni a una prop de componente; el texto sí.
- Todo `<form>` se vuelve un Form Block con los scripts de Webflow encima. Atom no usa formularios, así que no lo necesitas.
- Un select insertado como HTML pierde sus `<option>`.
- El CSS pegado en el Designer admite solo selectores de una clase (sin descendientes, sin `>`, sin atributos), solo los breakpoints de Webflow y va desktop-first. Una clase sin regla en esa hoja se descarta en silencio: las clases de `embed.css` no llegan al markup pegado.
- Borrar un elemento re-indexa el árbol: un borrado por llamada.
- Las Variables de color se sincronizan por el protocolo de `docs/webflow-playbook.md`; no edites sus valores a mano.

No prometas a Webflow lo que no puede: si un bloque necesita algo que el host no hace, dilo en el reporte.

## Código propio

El canal shadcn copia el source de cada componente y su CSS a `styles/atom-uikit/`. Los CSS son BEM global:
se importan en una hoja global, nunca como CSS Modules. El `.exemplar.html` es para embed, no-code y código;
no es el camino de Webflow nativo.

## No hay npm

Los paquetes `@atom-uikit/*` no se instalan desde npm. Si ves que alguien lo intenta, es un error.
