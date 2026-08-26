# agents

Registration and prompt strings for four language-model jobs: parse a brief, write copy, evaluate one rule, answer a question. `defs/` is the per-agent GitAgent config and instruction tree.

## Per-agent tree (`defs/<name>/`)

| Item | What it is |
|---|---|
| `agent.yaml` | Manifest: model, **tools**, **skills**, `runtime.max_turns` |
| `SOUL.md` | Agent identity |
| `RULES.md` | Output shape and behavioural constraints |
| `skills/<name>/SKILL.md` | Instruction modules (YAML frontmatter + markdown body) |

## Tool policy

| Agent | yaml `tools` | Runtime |
|---|---|---|
| explainer, extractor, generator | `[read]` | Sandboxed `read` injected by [`gitagent.ts`](../src/lib/gitagent.ts) — paths under `skills/`, `SOUL.md`, `RULES.md` only ([`agent-tools.ts`](../src/lib/agent-tools.ts)) |
| judge | `[]` | No tools; one shot; throws on tool use |

Yaml declares the reviewer contract. TypeScript implements sandboxed `read` with `replaceBuiltinTools: true` (GitAgent builtins are not used).

## Skills and scaling

Listed skill names in `agent.yaml` under `skills:`.

- Gateway appends a **catalog** of skill names and paths to the system prompt — in-scope skills are marked must-read, the rest optional. Bodies are **not** inlined ([`agent-skills.ts`](../src/lib/agent-skills.ts)).
- Model loads each body itself via the sandboxed `read` tool (`max_turns: 3` on three agents). `runAgent` records the paths it read as `skillsRead`.
- `skillsRead` reaches the UI: the extract response captions the Campaign brief, the generate response captions the asset it produced.
- `PREFLIGHT_SKILL_DUMP=1` is the opt-in escape hatch — it inlines the bodies instead of the catalog, for debugging a model that will not call `read`.

**To add capability:** create `skills/<new-name>/SKILL.md`, add `- <new-name>` under `skills:` in `agent.yaml`. No new Express route. Example: `generator/skills/channel-tiktok/` — listed for scale demo; not a product channel until schema/preview add it.

## Prompt builders (per call)

| File | Builds prompt for |
|---|---|
| `explainer.prompt.ts` | Workbench chat |
| `extractor.prompt.ts` | Campaign extract |
| `generator.prompt.ts` | Per-channel generate |
| `judge.prompt.ts` | Per-finding judge |

Agent name constants: `explainer.ts`, `extractor.ts`, `generator.ts`, `judge.ts`.
