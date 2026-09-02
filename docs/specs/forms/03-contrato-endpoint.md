# 03 · Contrato con el validador

La decisión de mayor consecuencia del programa. Si esto se mueve después, se mueve el
bundle, el validador y cada landing publicada al mismo tiempo.

## Por qué un solo endpoint

Rutear a Attio o a Sheets necesita credenciales. Esas no pueden vivir en el navegador
bajo ninguna forma — ni en custom code ni en campos de CMS, porque todo eso es HTML
público. El proxy es inevitable. Dado que va a existir, el ruteo vive ahí y el bundle
queda ignorante por diseño.

Alternativa descartada: mandar el destino como atributo desde el CMS. No filtra
credenciales por sí sola, pero reparte la configuración entre catorce registros e invita
al error. Rechazada.

## Petición

`POST` al endpoint constante, `Content-Type: application/json`.

```jsonc
{
  "landingId": "academy-pe-es",   // identificador, NO destino. Allowlist en el validador.
  "formKey": "lead-basic",         // qué schema aplica
  "locale": "es",
  "payload": { /* los campos validados, tal cual los define el schema */ },
  "meta": {
    "landingUrl": "https://…?utm_source=…",  // URL completa con query
    "referrer": "https://…",
    "submittedAt": "2026-09-01T18:22:04.113Z"
  }
}
```

Reglas:

- `payload` lleva **solo** claves que el schema declara. Nada de campos sueltos que el
  usuario no llenó ni basura del DOM.
- Los UTM van dentro de `meta.landingUrl`, sin parsear en cliente. El validador parsea.
  Se descarta el hack de `referrer` del proyecto origen: allí era obligatorio porque el
  pipeline de ATFX ignoraba los `utm_*`; aquí el endpoint es propio.
- El honeypot **no** viaja en `payload`. Va en la raíz como `trap` y el validador rechaza
  si trae valor.

## Respuesta

Éxito:

```jsonc
{ "ok": true, "ref": "lead_01J…" }   // ref opcional, para el thank-you y la analítica
```

Error de validación:

```jsonc
{
  "ok": false,
  "code": "validation_error",
  "message": "Revisa los campos marcados.",   // apto para mostrar al usuario
  "errors": { "email": "Correo no válido." }  // clave = schemaKey, no el name del input
}
```

Otros errores: mismo sobre, `code` en `rate_limited` | `unknown_landing` | `server_error`,
sin `errors`.

**El validador nunca revela destino, plataforma ni tabla de ruteo en la respuesta.**
Tampoco en los `code`.

## Contrato de seguridad del endpoint

Fuera del alcance de esta flota construirlo, dentro del alcance especificarlo. Quien lo
implemente debe cumplir:

- CORS con allowlist explícita de dominios. Nunca `*`.
- `landingId` validado contra allowlist; desconocido devuelve `unknown_landing` y no
  procesa.
- Rate limiting por IP y por `landingId`.
- Honeypot más umbral de tiempo mínimo entre render y envío.
- Los logs no vuelcan `payload` completo: es dato personal.
- Revalidación server-side con el mismo módulo Zod. La validación de cliente es UX, no
  seguridad.

## SIN CONFIRMAR

Lo siguiente lo decide la persona, no la flota. Un agente que lo necesite **se detiene y
lo anota en `08-brechas.md`**:

- La URL real del validador. Hasta que exista, el bundle usa una constante de
  `packages/forms/src/transport/endpoint.ts` con valor placeholder y un test que verifica
  que el placeholder no llegó a un build de release.
- El catálogo inicial de `landingId`.
- Si `ref` se muestra al usuario o solo se registra.
