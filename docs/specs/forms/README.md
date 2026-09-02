# Programa `@atom-uikit/forms`

Spec-driven para una flota de agentes. Construye el paquete de formularios del DS:
motor de validación y envío, extraído de `atfx-forms-newAug26`, desacoplado de
Elementor/Salesforce y publicado por los canales del DS.

**Punto de inicio: [`ORCHESTRATOR.md`](./ORCHESTRATOR.md).** Un agente que no sepa qué
hacer arranca ahí, no aquí.

## Regla del programa

La decisión se escribe en `docs/specs/forms/` antes de escribirse en `packages/forms/`.
Si el código y un spec no coinciden, uno de los dos es un bug y hay que decidir cuál —
no se ajusta el spec en silencio para que pase el test.

## Índice

| Documento | Responde a |
|---|---|
| [ORCHESTRATOR.md](./ORCHESTRATOR.md) | ¿Quién hace qué, en qué orden, con qué puerta entre olas? |
| [00-contexto.md](./00-contexto.md) | ¿De dónde sale este paquete? ¿Con qué convive? |
| [01-objetivos.md](./01-objetivos.md) | ¿Qué resuelve? ¿Qué explícitamente no? ¿Cuándo está terminado? |
| [02-arquitectura.md](./02-arquitectura.md) | ¿Cómo está partido? ¿Qué invariantes no se rompen? |
| [03-contrato-endpoint.md](./03-contrato-endpoint.md) | El contrato con el validador. La decisión de mayor consecuencia. |
| [04-scaffold.md](./04-scaffold.md) | El árbol de archivos y la intención de cada uno. |
| [05-rulesets.md](./05-rulesets.md) | Reglas duras. Violarlas invalida el archivo. |
| [06-tests.md](./06-tests.md) | Qué se prueba, con qué, y cuál es el mínimo. |
| [07-auditoria.md](./07-auditoria.md) | Cómo un agente audita su propio archivo antes de darlo por hecho. |
| [08-brechas.md](./08-brechas.md) | Lo no confirmado. No se disfraza de hecho. |
| [agents/](./agents/) | Un archivo por rol. Contrato de entrada y salida de cada agente. |

## Convenciones heredadas

Del `spec/` de `atom-whatsapp-buttons`, que es el precedente en esta casa:

- Cada decisión lleva su alternativa descartada y el motivo. Una decisión sin alternativa
  registrada es una decisión que nadie tomó.
- Lo no verificado se marca **SIN CONFIRMAR** y se acumula en `08-brechas.md`.
- Fechas absolutas (`2026-09-01`), nunca "la semana pasada".

## Contexto de la ola paralela

Mientras esta flota trabaja, la plantilla de LP de pauta se construye en Webflow en su
versión **sin formulario**, con conversión por `WhatsAppButton2026`. Los dos resultados
se fusionan después. Ningún agente de este programa toca Webflow.
