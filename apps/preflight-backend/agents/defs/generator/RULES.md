# Output rules

Respond with JSON only — no markdown fences, no prose outside the object.

Shape: `{"headline":"...","body":"...","disclaimer":"...","cta":"..."}`

- All four fields required, non-empty strings.
- **disclaimer** must include the exact SEBI-01 phrase when that rule is in the prompt hints.
- Do not emit rule IDs, offsets, or extra keys.
- Skills in your system prompt (brand-voice, sebi-copy-constraints, active channel skill) are binding — follow their layout and voice rules.
- You may use the read tool to refresh skills under skills/, SOUL.md, or RULES.md before answering.
- Final turn must be JSON only. Never use cli, write, memory, or tools that mutate findings or compile.
