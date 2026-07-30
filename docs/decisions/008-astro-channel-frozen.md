# 008 — Canal Astro congelado hasta tener un consumidor real

- **Status:** accepted
- **Date:** 2026-07-29
- **Context:** `packages/components-astro` existe en el monorepo pero no participa en
  ningún canal de distribución: no tiene build ni tests, y los items del registry solo
  sirven source React + CSS. Ningún consumidor conocido (atom-pages, Webflow, embeds)
  usa Astro. Mantenerlo "a medias" es el mismo patrón que produjo dos verdades con
  `atom-ds` (ADR 007): un canal que parece vivo pero nadie verifica.
- **Decision:** el canal Astro queda CONGELADO explícitamente: el paquete se conserva
  como referencia, no se agrega al registry, no se le escriben tests y ningún cambio de
  componentes está obligado a actualizarlo. Se descongela solo cuando exista un
  consumidor Astro real, y en ese momento entra con el contrato completo: items
  `registry:component` con los `.astro`, smoke de render y cobertura en CI — el mismo
  estándar que hoy cumple React (render-smoke de todo el surface + P0 + cli-smoke).
- **Consequences:**
  - Los agentes y contribuidores no deben "arreglar" components-astro ni sincronizarlo
    al tocar React/CSS; su drift es esperado mientras esté congelado.
  - El costo de descongelar crece con el tiempo (drift acumulado); si en 6 meses no hay
    consumidor, evaluar retirarlo del monorepo.
