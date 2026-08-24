# Preflight — Claude instructions

Follow [AGENTS.md](./AGENTS.md) for repo context, rule hierarchy, import law, and done criteria.

When editing code, also load the scoped rule from `.cursor/rules/` for the tree you touch (see AGENTS.md table).

**Non-negotiables:**

- `documentation/01`–`09` lock product behaviour — do not re-litigate.
- Plain functions and modules. No factories, DI, event buses, `*Manager` classes (see `typescript.mdc`).
- Files ≤200 lines (`wc -l`); extract per `size-and-dry.mdc`.
- No package installs unless this turn's user message named them.
- `@preflight/rules` has zero runtime dependencies.
- `preflight-web` never imports `@preflight/rules`.

**Conflict:** documentation wins → `.cursor/rules` → taste. Stop and ask if blocked.
