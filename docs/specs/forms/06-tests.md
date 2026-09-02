# 06 · Tests

## Marco

`vitest`, que es lo que ya corre el repo (`pnpm test` filtra por paquete). Entorno `jsdom`
para `core/` y `ui/`; `node` para `schemas/` y `transport/`.

## Metodología

RED → GREEN → IMPROVE. El test se escribe primero, se corre, y **se verifica que falle por
la razón correcta** antes de implementar. Un test que nunca se vio fallar no prueba nada.

Cuando un test falle: primero se sospecha del aislamiento y de los mocks. Se arregla la
implementación, no el test — salvo que el test esté mal, y entonces se dice por qué.

## Mínimos

- Cobertura ≥ 80% en `core/` y `schemas/`. Son el motor y el contrato.
- `transport/` y `context/` ≥ 70%.
- `ui/` no persigue porcentaje: persigue los casos de `a11y.test.ts`.

## Los casos que sí o sí

Un agente que entregue sin estos no terminó, aunque el porcentaje dé.

**`engine.test.ts`** — con un submitter falso inyectado:
- Envío válido llama al submitter una vez con el payload esperado.
- Envío inválido **no llama al submitter** y marca todos los campos con error.
- Error de red conserva lo que el usuario escribió. Nada se borra.
- Las integraciones corren solo tras éxito, y una que lanza no impide el thank-you.
- Validación en vivo: `blur` marca tocado y valida; `input` revalida solo si ya estaba tocado.

**`schema-isomorph.test.ts`** — invariante I4. El mismo schema importado como ESM en Node
y desde la superficie del bundle produce el mismo resultado sobre las mismas entradas.
Si esto falla, el programa entero pierde su premisa.

**`submit.test.ts`**:
- Timeout aborta y propaga.
- Reintenta por fallo de red, con espera creciente.
- **Cero reintentos cuando el servidor respondió**, incluso con `ok:false`.
- Una respuesta que no valida contra el contrato se trata como `server_error`.

**`endpoint.test.ts`** — el placeholder no sobrevive a un build marcado como release.

**`geo.test.ts`** — el caso que más importa: **sin consentimiento no sale ninguna
petición**. Se verifica espiando `fetch`, no leyendo el retorno.

**`a11y.test.ts`**:
- Cada control tiene label ligado por `for`/`id`.
- En error, el control apunta al mensaje por `aria-describedby` y el mensaje es `role="alert"`.
- Tras un submit fallido, el foco está en el primer campo con error.
- El botón en carga tiene `aria-busy="true"`.
- El thank-you tiene foco al montarse.

**`contract.test.ts`** — el sobre acepta lo válido y rechaza: `payload` con claves que el
schema no declara, `landingId` vacío, y una respuesta sin `ok`.

## Fixtures

`test/fixtures/forms.ts` define los `FormConfig` de prueba. **No importa schemas de negocio
reales**: un cambio de copy legal no debe romper la suite del motor.

## Lo que no se prueba aquí

El validador en Vercel, el ruteo a plataformas y el render en Webflow. Fuera de alcance.
