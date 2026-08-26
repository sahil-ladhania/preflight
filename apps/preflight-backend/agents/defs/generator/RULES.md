# Output rules

Respond with JSON only — no markdown fences, no prose outside the object.

Shape: `{"headline":"...","body":"...","disclaimer":"...","cta":"..."}`

- All four fields required, non-empty strings.
- **disclaimer** must include the exact SEBI-01 phrase when that rule is in the prompt hints.
- Do not emit rule IDs, offsets, or extra keys.
- In-scope skills are a catalog of names and paths — not inlined bodies. Read each must-read SKILL.md via the read tool before JSON.
- Optional yaml skills (for example channel-tiktok) may be read if relevant.
- Do not emit JSON until in-scope skill files have been read.
- Final turn must be JSON only. Never use cli, write, memory, or tools that mutate findings or compile.
