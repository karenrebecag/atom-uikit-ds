# 01 · Objetivos

## El problema

Se van a publicar landings de pauta en volumen (14 en la primera semana), en varios
idiomas, con destinos de lead distintos: Attio hoy, Google Sheets en otro caso, mañana
otro CRM. **El destino cambia; el schema no.**

Si cada landing lleva su propio bloque de código pegado a mano, a la tercera semana hay
catorce implementaciones divergentes y ningún lugar donde arreglarlas de una vez.

## Qué resuelve este paquete

Un motor de formularios distribuido por el DS que:

1. Valida en cliente con el mismo schema Zod que valida el servidor.
2. Postea **siempre al mismo endpoint validador**, horneado como constante del bundle.
3. Se configura por atributos en el DOM, sin código por página.
4. Reporta errores de servidor campo por campo.
5. Dispara integraciones de analítica aisladas, sin que una falla tumbe el registro.

## Qué explícitamente NO resuelve

- **No rutea a plataformas.** Attio, Sheets y quien siga viven detrás del validador. El
  bundle no sabe que existen y nunca debe saberlo.
- **No guarda credenciales.** Ninguna. Ver `05-rulesets.md` §3.
- **No estiliza campos.** Eso ya está en `/v1/embed.css`.
- **No construye el endpoint validador.** Es trabajo aparte, en Vercel.
- **No toca Webflow.** La anatomía para Designer se entrega como brief, no como acción.

## Definición de terminado

El paquete está listo cuando:

- [ ] `pnpm --filter @atom-uikit/forms typecheck` en verde, cero `any`.
- [ ] `pnpm --filter @atom-uikit/forms test` en verde, cobertura ≥ 80% en `core/` y `schemas/`.
- [ ] El grep de vestigios de `05-rulesets.md` §4 devuelve cero coincidencias.
- [ ] Un formulario se levanta en una página estática solo con markup del DS más
      `data-atom-form`, sin una línea de JS en la página.
- [ ] El mismo schema Zod se importa desde el bundle y desde un consumidor Node sin
      cambios — probado con un test que lo importe de las dos formas.
- [ ] `AUDIT.md` existe y no tiene hallazgos altos.

## Prueba de aceptación

Heredada de `docs/organism-pipeline.md` §7: **está publicado cuando se puede reconstruir
sin mirar el repo que lo creó.** Un consumidor nuevo instala el layout, pega el markup,
pone `data-atom-form="lead-basic"` y captura un lead válido sin abrir `packages/forms/src`.
