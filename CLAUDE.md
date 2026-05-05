# Project Standards

@AGENTS.md

## Frontend Development (frontend-design Skill)
- ALWAYS use the `frontend-design` skill for all UI, layout, and styling tasks.
- Prioritize high-polish, accessible, and responsive components.
- Ensure consistent spacing and modern typography as defined by the skill's philosophy.

## Database & Data Layer (Supabase MCP)
- ALWAYS use the Supabase MCP tools to inspect real-time schemas (`list_tables`, `get_table_schema`) before writing code.
- Sync TypeScript types via the MCP server immediately after any schema changes.
- Use `execute_sql` for queries and migrations to ensure accuracy against the live database.

## Workflow & Commands
- Build/Dev: `npm run dev`
- Typecheck: `npm run typecheck`
- Test: `npm test`
