# Cierre: el loop antes de entregar

Una entrega sin este loop corrido no está terminada. Son dos mitades con un dueño cada una: la contable
la comprueba el servidor; el criterio lo ejerces tú contra tu propio diff.

## Mitad contable

La corre `atom_uikit_finalize` (audit, validate y las reglas de marca). Tú no la reescribes: la llamas,
lees sus hallazgos y arreglas. Estas líneas se generan de `conformance/skill-checks.json`; no se editan a mano.

<!-- contable:start -->
- [ ] valores hardcodeados, clases desconocidas, hex/rgb/oklch y spacing o radius fuera de token. Si falla: corrige cada desviación que reporta atom_uikit_audit; usa atom_uikit_patch_plan para el parche mínimo. <!-- check:audit -->
- [ ] variantes, tamaños, aria y reimplementación de componentes que ya existen. Si falla: corre atom_uikit_validate y arregla cada error antes de volver a finalizar. <!-- check:validate -->
- [ ] ningún elemento form en el código entregado. Si falla: sustituye por el botón de WhatsApp (clases atom-wa-btn) a wa.me. <!-- check:no-forms -->
- [ ] hay al menos un enlace wa.me cuando el brief no prohíbe WhatsApp. Si falla: añade el CTA de WhatsApp con el número confirmado del brief. <!-- check:missing-whatsapp -->
- [ ] los enlaces wa.me usan el número confirmado del brief. Si falla: usa exactamente ese número en todos los CTA de contacto. <!-- check:wrong-whatsapp -->
- [ ] ningún botón usa el gradiente de marca ni text-gradient. Si falla: los botones salen solo del componente button o del botón de WhatsApp; el gradiente solo va en titulares de hero. <!-- check:no-gradient-on-buttons -->
- [ ] el body no lleva fondo oscuro. Si falla: el blanco es la base; lo oscuro va solo dentro de secciones concretas. <!-- check:no-body-dark -->
- [ ] a lo más 2 secciones oscuras por página. Si falla: fuerza a la superficie default las secciones oscuras que sobren. <!-- check:too-many-dark-sections -->
- [ ] el logo oficial no queda dentro de una sección oscura. Si falla: deja el logo sobre la base blanca o quítalo de la sección oscura. <!-- check:logo-contrast -->
- [ ] ningún logo inventado: wordmark de texto, badge o powered by. Si falla: usa solo el logo oficial de Atom como imagen. <!-- check:official-logo -->
- [ ] toda imagen sale de la herramienta de imagen, no de URLs pegadas a mano. Si falla: rellena cada slot de imagen con atom_uikit_image. <!-- check:image-source -->
- [ ] los slots de imagen obligatorios llevan un asset externo real, no un mock en CSS. Si falla: genera la imagen con atom_uikit_image y colócala en el slot. <!-- check:required-image-slots -->
<!-- contable:end -->

## Mitad de criterio

Lo que ningún servidor mide. Recórrelo contra tu diff.

```
Revisión Atom:
Composición
- [ ] Cada región sale de un bloque ejemplar; cero markup inventado
- [ ] El orden de regiones cuenta un argumento, no es una lista de secciones
- [ ] Cada bloque es el que su whenToUse describe, no el del nombre parecido
- [ ] El ritmo alterna: no hay dos .section--hero seguidas
Jerarquía y copy
- [ ] Un solo h1, asignado por la página; el resto degradado a h2
- [ ] Un CTA primario por sección
- [ ] Cero copy de referencia sin sustituir: ni texto, ni imágenes, ni el wa.me 00000000000
- [ ] Sentence case, sin eyebrow, cifras solo del catálogo autorizado
Marca y host
- [ ] Blanco de base; de 0 a 2 secciones oscuras y solo de IA
- [ ] El CTA de contacto es el botón de WhatsApp a un wa.me confirmado; cero formularios
- [ ] El host carga el CSS correcto (embed.css en host ajeno, nunca foundation.css)
Estados y motion
- [ ] Vacío, un solo ítem, texto largo, 390 px y dark revisados
- [ ] Todo motion sale de un behavior publicado, con su guarda de reduced-motion
- [ ] Cero controles decorativos que no hacen nada
```

## El loop

1. Corre la mitad contable con `atom_uikit_finalize` sobre el código COMPLETO que vas a entregar.
2. Recorre la mitad de criterio.
3. Arregla lo que falle y **vuelve a correr desde el paso 1**. Repite hasta que todo pase.

## El reporte

Cierra con un reporte corto: qué construiste, qué bloques usaste, qué quedó simulado o pendiente de un dato
real (imágenes, número, cifras) y **qué línea no pudiste cumplir y por qué**. Cita el veredicto de
`atom_uikit_finalize`. Una línea incumplida y declarada es aceptable; una incumplida y callada no. Sin
veredicto citado no hay entrega.
