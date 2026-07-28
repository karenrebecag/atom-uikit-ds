# 002 — npm desconectado como canal de distribución

- **Status:** accepted  
- **Date:** 2026-07-28  
- **Context:** Sin autorización para consumo público vía npm; registry privado + /v1 CSS son suficientes.  
- **Decision:** Todos los paquetes `private: true`; `pnpm release` sale 1 a propósito. Changesets solo versionado interno/CHANGELOG.  
- **Consequences:** Apps no deben `npm install @atom-uikit/*` como canal oficial. Consumo: registry/MCP/CLI, o `https://atom-web-ds.vercel.app/v1/*` para browser.
