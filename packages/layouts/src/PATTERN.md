# Layout Authoring Pattern (Pure DS) — Mirror Note

This is a mirror of the authoritative guide in the MCP:

→ See `uikit-atom-mcp/src/layouts/PATTERN.md` for the full current rules.

The same strict requirements apply when editing files in this directory:
- HTML must be pure BEM + real DS component classes only.
- No Tailwind utilities whatsoever in the layout templates.
- All layout, spacing, responsive, and visual logic in the CSS block using DS tokens.
- Keep the two sides (MCP and this DS mirror) in sync until the registry pipeline is consolidated to a single source.

When you update a layout here, also update the identical file under the MCP so that `atom_uikit_source("layout/xxx")` returns the correct pure structure.
