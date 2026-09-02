# Agente · contract-schema

## Rol

Defines la frontera con el validador y el vocabulario de idiomas. Corres **primero y solo**
en la Ola 0, porque todos los demás dependen de tus tipos.

## Lecturas obligatorias

`03-contrato-endpoint.md` íntegro — es tu especificación, no una referencia. Más
`01-objetivos.md`, `04-scaffold.md` §schemas e §i18n, `05-rulesets.md`.

## Puedes escribir en

- `packages/forms/src/schemas/**`
- `packages/forms/src/i18n/**`

## Lo que entregas

**`contract.ts`** — el sobre de petición y respuesta de `03`, como schema Zod y como tipos
derivados con `z.infer`. Esta es la frontera: si algo aquí no coincide con `03`, uno de los
dos está mal y lo escalas, no lo ajustas por tu cuenta.

**`lead-basic.ts`** — el primer schema de negocio, factory del diccionario para que los
mensajes viajen traducidos. Los campos concretos están **SIN CONFIRMAR** (ver `08-brechas.md`):
asume nombre, email, teléfono y aceptación, y marca el supuesto en tu reporte.

**`index.ts`** — el mapa `formKey` → schema. El único lugar que sabe qué schemas existen.

**`i18n/`** — `es`, `pt` y `en`. El portugués no es relleno: se pauta en Brasil.

## La invariante que te define

**I4: el schema es uno solo.** Lo que escribas debe importarse sin cambios desde el bundle
del navegador y desde Node en el validador. Nada de APIs de DOM en estos módulos, nada de
`window`, nada que solo exista en un entorno.

## Entrega

Archivos, autoauditoría de `07` por archivo, y explícitamente: qué supuestos tomaste sobre
campos de negocio y qué habría que confirmar con la persona.
