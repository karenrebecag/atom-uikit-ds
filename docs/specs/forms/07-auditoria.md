# 07 · Autoauditoría

Un agente no declara un archivo terminado hasta correr esto **sobre ese archivo** y poder
responder sí a todo. La respuesta va en su reporte al orquestador, por archivo, no como un
"listo" global.

## Checklist por archivo

**Intención**
- [ ] ¿Hace exactamente lo que dice su línea en `04-scaffold.md`? ¿Nada más?
- [ ] ¿Lo que sobra pertenece a otro archivo del árbol? Si sí, se mueve.
- [ ] ¿Abre con el comentario de intención?

**Reglas**
- [ ] Cero `any`. Exportadas tipadas de entrada y de salida.
- [ ] Cero mutación del argumento recibido.
- [ ] Comentarios de por qué, ninguno que narre la línea siguiente.
- [ ] Sin emojis. Sin `console.log`.
- [ ] Bajo 400 líneas, funciones bajo 50, anidamiento bajo 4.

**Fronteras** (`05-rulesets.md` §5)
- [ ] ¿Importa algo que su capa tiene prohibido?
- [ ] Si consulta el DOM y no es `core/dom.ts`, está mal cortado.
- [ ] Si contiene una URL y no es `transport/endpoint.ts`, está mal.

**Seguridad**
- [ ] Cero credenciales, tokens y destinos.
- [ ] Nada de `innerHTML` con dato externo.
- [ ] Si hace una petición a un tercero, ¿verifica consentimiento antes?

**Reuso antes de escribir**
- [ ] ¿Esto ya existe en el DS? Los estilos de campo ya están en
      `packages/css/src/components/forms/`. No se reescriben.
- [ ] ¿Lo cubre la librería estándar o Zod, que ya es dependencia?
- [ ] ¿Se está reimplementando algo que el proyecto origen ya resolvió bien?

**Prueba**
- [ ] ¿Tiene test? ¿Se le vio fallar antes de pasar?
- [ ] ¿Cubre el caso de error, no solo el feliz?

## Comandos de puerta

```bash
cd /Users/karenrebecaog/Desktop/SoftwareDevProjects/ATOMUIKIT/atom-uikit-ds

pnpm --filter @atom-uikit/forms typecheck
pnpm --filter @atom-uikit/forms test

# Vestigios del proyecto origen — debe devolver vacio
grep -rniE 'elementor|admin-ajax|atfx|aanumber|post_id|form_id|wp-admin|moove_gdpr|_atcg' \
  packages/forms/src packages/forms/test

# any explicito — debe devolver vacio
grep -rnE ':\s*any\b|<any>|as any' packages/forms/src

# Frontera core/ -> transport/ — debe devolver vacio
grep -rn "from '\.\./transport" packages/forms/src/core

# URL fuera de endpoint.ts — debe devolver vacio
grep -rnE 'https?://' packages/forms/src --exclude=endpoint.ts

# Emojis — debe devolver vacio
grep -rnP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' packages/forms/src packages/forms/test
```

## Severidad de hallazgos

| Nivel | Qué es | Qué pasa |
|---|---|---|
| **Alto** | Viola una invariante de `02` o una regla de seguridad de `05` §3 | Bloquea la puerta. Se corrige antes de avanzar. |
| **Medio** | Viola una regla de estilo o frontera, sin riesgo | Se corrige; si no se puede, va a `08-brechas.md` con dueño. |
| **Bajo** | Mejora posible, criterio discutible | Se lista y se deja. No bloquea. |

## Honestidad del reporte

Un agente que reporta "todo verde" sin sección de pendientes es sospechoso. Todo trabajo
real deja algo: una duda, un caso no cubierto, un supuesto. Si de verdad no queda nada, se
escribe la frase y se sostiene ante el auditor.
