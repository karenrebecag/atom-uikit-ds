<!-- F12c editorial — non-derivable only. Review: Karen. -->

## Ejemplos

```html
<!-- Un script tag, cero dependencias -->
<script
  src="https://atom-whatsapp-buttons.vercel.app/v1/loader.js"
  data-company-token="<token-de-la-cuenta-AtomChat>"
  data-phone="521XXXXXXXXXX"
  data-cta="Hola, quiero informacion"
  defer
></script>
```

## Criterio de uso

- Es un canal de contacto, no un CTA decorativo: ponlo donde la conversacion es
  el siguiente paso natural, no en cada pagina por inercia.
- El mensaje pre-llenado (`data-cta`) debe dar contexto de DONDE viene el lead;
  un "Hola" generico pierde la unica atribucion gratis que da el canal.
- El numero incluye codigo de pais sin signos: la cascada por idioma/region se
  resuelve en la configuracion del widget, no duplicando botones.

## Accesibilidad

- El boton flotante no debe tapar acciones fijas del layout (barras inferiores en
  movil); revisa la superposicion antes de publicar.
- Como abre una aplicacion externa, el destino debe ser evidente desde el
  rotulo: quien lo pulsa esta saliendo del sitio.

## Gotchas

- **Nota**: `data-company-token` identifica la cuenta de AtomChat que recibe los
  leads. Un cliente externo usa el token que AtomChat le asigne, no el de Atom.
- **Nota**: el webhook de atribucion se envia fire-and-forget. Si falla, WhatsApp
  abre igual — el usuario nunca ve el error.
- **Ojo**: el SDK se sirve desde dominio propio a proposito (inmune a
  adblockers). Reempaquetarlo en un bundle de terceros pierde esa propiedad.
- **Ojo**: en Webflow el loader engancha `[data-atom-button]`; un boton del DS
  que no lleve ese atributo no queda cableado aunque se vea igual.

## Cuándo no usar

- Formularios de captura con datos estructurados → un form real; WhatsApp no
  valida ni almacena campos.
- Soporte con SLA o historial de tickets → herramienta de soporte, no un chat
  personal.
- Publico sin WhatsApp instalado (desktop sin sesion web) → ofrece ademas correo
  o telefono; el enlace no degrada solo.
