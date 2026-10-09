# Atom UIKit: construir páginas

Construyes o auditas interfaces con el Atom UIKit. Los componentes no están en npm: se piden por el
MCP (`atom_uikit_source`) o por el canal del registry y se copian al proyecto. Esta skill se lee por
capas: empieza aquí y abre solo el archivo que la tarea pide.

## Workflow

Copia esta lista y márcala al avanzar.

```
Tarea Atom UIKit:
- [ ] 1. Brief: producto, objetivo, audiencia, tono y el NÚMERO de WhatsApp. Si falta, pregunta y espera
- [ ] 2. Regiones: elige el bloque ejemplar de cada región (bloques) y compón el orden (composicion)
- [ ] 3. Trae el material: source de los bloques y componentes, y la foundation del canal. Nada a mano
- [ ] 4. Rellena: copy real del brief, imágenes por la herramienta, CTA a wa.me. Sustituye TODA la copy de referencia
- [ ] 5. Marca y host: marca y el host que toca (hosts)
- [ ] 6. Revisa: capa cierre. Corre la mitad contable, arregla, vuelve a correr hasta verde. Reporta
```

## Principios

1. Usa el bloque antes de escribir markup; si falta una región, es un hallazgo de catálogo, no permiso para inventar.
2. Un propósito por superficie: un solo `h1` en la página y un CTA primario por sección.
3. El blanco es la base de la página; el naranja es solo acento.
4. La jerarquía sale del tamaño y del aire: el ritmo viene de la capa de uso (`.section--hero`, `.section`).
5. El motion explica un cambio y sale de los behaviors publicados; nunca se inventa.
6. Todo estado está diseñado: vacío, texto largo, 390 px y dark.

## Nunca

- Reimplementar un componente que existe ni inventar clases de sección.
- Inventar animaciones, ni hardcodear un token (color, spacing, radius, timing).
- Un `<form>` ni inputs de contacto. <!-- regla: no-forms -->
- Un logo que no sea el oficial: ni generado, ni wordmark de texto, ni badge "powered by". <!-- regla: logo-oficial -->
- Un control decorativo que no hace nada: un enlace con `href="#"` o un botón sin acción.
- Entregar sin haber corrido el loop de cierre.

## Decisión rápida

| Necesitas | Bloque | Si no encaja, ve a |
|---|---|---|
| Promesa con imagen o video | `layout/hero-split` | `layout/hero-centered` |
| Promesa corta con prueba social | `layout/hero-centered` | `layout/hero-split` |
| Tres beneficios paralelos | `layout/feature-grid` | `layout/feature-alternating` |
| Una capacidad explicada en profundidad | `layout/feature-alternating` | `layout/feature-grid` |
| Cifras de resultado | `layout/metrics-grid` | `layout/stats-band` |
| Planes | `layout/pricing-plans` | `layout/pricing-comparison` |
| Objeciones | `layout/faq-accordion` | `layout/faq-two-col` |
| Cierre | `layout/cta-banner` | `layout/cta-split-image` |

El detalle (cuándo sí, cuándo no, ritmo, motion) está en [bloques](bloques.md).

## Capas

Cada archivo está a un salto. Lee solo el que la tarea pide.

| Capa | Archivo | Léela cuando |
|---|---|---|
| instrucciones | [INSTRUCTIONS.md](instrucciones.md) | pegas las reglas always-on en el `AGENTS.md` del repo consumidor |
| bloques | [bloques.md](bloques.md) | eliges qué bloque va en cada región |
| composicion | [composicion.md](composicion.md) | decides regiones, orden, `h1`, secciones oscuras y cadencia de motion |
| marca | [marca.md](marca.md) | tocas fondos, botones, gradiente, logo o imágenes |
| copy | [copy.md](copy.md) | escribes texto, cifras o CTA |
| hosts | [hosts.md](hosts.md) | decides dónde vive la página: Webflow, código o HTML estático |
| conversion | [conversion.md](conversion.md) | pones cualquier CTA de contacto |
| motion | [motion.md](motion.md) | animas algo o revisas un behavior |
| accesibilidad | [accesibilidad.md](accesibilidad.md) | revisas `h1`, foco, nombres y contraste |
| cierre | [cierre.md](cierre.md) | SIEMPRE, antes de entregar |
| ejemplos | [landing de pauta](ejemplo/landing-pauta.md), [caso de éxito](ejemplo/caso-de-exito.md), [página de producto](ejemplo/pagina-de-producto.md) | quieres ver una página resuelta de punta a punta antes de componer la tuya |

## Qué decide quién

El bloque decide lo local de su región: ritmo, superficie natural, motion y copy de referencia. Esta
skill decide lo global: qué regiones, en qué orden, qué bloque lleva el único `h1`, cuántas secciones
oscuras y cuántas animan. Puedes forzar una superficie a `default` y suprimir motion por moderación;
no reescribes el ritmo interno de un bloque ni añades motion.
