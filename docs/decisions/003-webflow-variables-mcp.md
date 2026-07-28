# 003 — Webflow Variables: plan compiler + MCP, no REST

- **Status:** accepted  
- **Date:** 2026-07-28  
- **Context:** Variables nativas no están en Data API REST (`api.webflow.com/v2`); solo Designer API / MCP.  
- **Decision:** `scripts/sync-webflow.mjs` emite plan tipado; apply con `data_variable_tool` del MCP oficial.  
- **Consequences:** No clientes REST para variables. Protocolo en `docs/webflow-playbook.md`. Staging site requerido para el primer apply real.
