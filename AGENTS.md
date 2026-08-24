# Preflight — Agent Instructions

AI-generated compliance workbench. Turborepo: `apps/preflight-web`, `apps/preflight-backend`, `packages/rules`, `packages/schemas`.

**Product locks:** `documentation/01-problem.md` through `09-screen-spec.md`. Stack, architecture, package boundaries, and design tokens are not re-litigated in code sessions.

## Rule hierarchy

1. `documentation/` — product truth
2. `.cursor/rules/*.mdc` — how code is written
3. This file — index and repo-specific overrides

When generic Cursor user rules conflict (pnpm, `apps/web`, `packages/utils`, `packages/types`, 150-line components), **this repo wins**.

If a coding rule blocks the ask: stop, name the rule and the block, wait.

## Scoped rules (read the matching file when editing that tree)


| Path                        | Rule file                                    |
| --------------------------- | -------------------------------------------- |
| Everywhere                  | `.cursor/rules/core.mdc`, `size-and-dry.mdc` |
| `**/*.{ts,tsx}`             | `.cursor/rules/typescript.mdc`               |
| `apps/preflight-backend/**` | `.cursor/rules/backend.mdc`                  |
| `apps/preflight-web/**`     | `.cursor/rules/web.mdc`                      |
| `packages/rules/**`         | `.cursor/rules/rules-package.mdc`            |
| `packages/schemas/**`       | `.cursor/rules/schemas-package.mdc`          |




## Import law (checkable)


| Consumer             | May import                                                       | Must not                                                       |
| -------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| `preflight-web`      | `@preflight/schemas`, self                                       | `@preflight/rules`, backend, Prisma, GitAgent                  |
| `preflight-backend`  | `@preflight/rules`, `@preflight/schemas`, Prisma, GitAgent, self | web                                                            |
| `@preflight/rules`   | own files                                                        | apps, schemas, Zod runtime, Prisma, GitAgent, fs, env, network |
| `@preflight/schemas` | zod, own files                                                   | rules, apps                                                    |
| `agents/*`           | nothing from rules/schemas                                       | server interpolates strings                                    |




## What "done" means

- Touched packages pass `npm run check-types`.
- `packages/rules` or `packages/schemas` changed → Vitest passes there.
- UI changed → exercise the flow in the browser (not screenshot-only).
- Build only what was asked. No unrequested packages or endpoints.



## Build order

Follow `documentation/07-build-order.md`. Phase 4 Assets ledger is the hard constraint — ship seed + ledger if time dies.

## Session discipline

- Open numbered docs instead of re-deriving fold order, freeze/snapshots, agent boundaries, tokens.
- Do not change locked signatures (`runDeterministic`, `foldStatus`, `ApiResponse`, hash helpers).
- Do not revisit earlier files unless this ask names them.
- Ask one question (two options) before adding anything not in `documentation/` — then stop until answered.

