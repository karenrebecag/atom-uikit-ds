# 02 · Arquitectura

## El corte de tres

Igual que el resto del DS. Cada mitad viaja por su canal y ninguna sabe de las otras más
de lo necesario.

| Mitad | Dónde vive | Canal | Estado |
|---|---|---|---|
| **Look** — campo, input, select, checkbox, error | `packages/css/src/components/forms/` | `/v1/embed.css` | Ya existe |
| **Anatomía** — qué elementos, en qué orden, con qué atributos | `packages/layouts/src/form-lead.ts` + componente Webflow | registry + Shared Library | Este programa entrega el layout; el componente es brief |
| **Comportamiento** — validar, enviar, errores, geo, i18n | `packages/forms/` | `/v1/forms.js` IIFE, global `AtomForms` | Este programa |

## Invariantes

Romper cualquiera de estas invalida el trabajo, no es una discusión de estilo.

**I1 — El endpoint es una constante del bundle.** No es atributo, no es campo de CMS, no
es parámetro. Un solo validador. La razón está en `03-contrato-endpoint.md`.

**I2 — El bundle no conoce destinos.** Ni el nombre de la plataforma. Lo único que viaja
desde la página es un identificador de landing, y el validador decide qué hacer con él.

**I3 — Configuración por atributos, cero código por página.** Copiado de
`packages/animations`. Si una funcionalidad exige un `<script>` en la página, está mal
diseñada.

**I4 — El schema es uno solo.** El mismo módulo Zod que valida en el navegador se importa
en el validador. No hay una copia "del servidor".

**I5 — El motor no conoce el transporte.** `core/` no importa nada de `transport/`. La
dependencia va en un solo sentido, inyectada. Esto es lo que hizo barato desacoplar el
original, y es lo que hay que preservar.

**I6 — Cero estilos propios.** Si un elemento necesita pintura, usa una clase del DS. Si
no existe la clase, se reporta como brecha; no se autodeclara.

**I7 — Fallar cerrado.** Sin consentimiento no hay geo-IP. Sin schema resuelto no hay
envío. Un error de red no borra lo que el usuario escribió.

## Flujo de un envío

```
usuario envía
  → engine valida con schema Zod (cliente)
      falla  → errores por campo, foco al primero, nada sale del navegador
      pasa   → transport POST { landingId, locale, payload } al validador
                    → validador revalida con el MISMO schema
                    → validador rutea a Attio / Sheets / lo que toque
                    → responde contrato de 03
                  ok    → integraciones (allSettled) → thank-you
                  error → errores por campo desde el servidor
```

## Lo que se decidió no hacer

- **Destino como atributo del CMS.** Descartado: reparte la configuración entre 14
  registros y hace inevitable que alguien meta una credencial ahí. Un identificador sí;
  el destino no.
- **Bundle rodante en `/v1/forms.js`.** Descartado para el canal estable: si el bundle se
  rompe, catorce landings en pauta dejan de capturar y se descubre por el reporte del
  lunes. Va pinneado por versión con SRI. Ver `05-rulesets.md` §6.
- **Reusar el Form Block nativo de Webflow.** Descartado: engancha su handler y postea al
  store de Webflow; habría que pelearse con el widget para neutralizarlo. Se construye con
  elementos normales.
- **Hand-roll de validadores para ahorrar los ~13kb de Zod.** Descartado: la invariante I4
  vale más que el peso, y el bundle carga diferido.
