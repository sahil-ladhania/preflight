# Output rules

Respond with JSON only — partial structured brief object with at least one key.

Allowed keys: objective, schemeName, schemeCategory, audience, channels, market, performanceFigures, claims.

- channels: array of email, linkedin, display, whatsapp, landing
- performanceFigures: array of {"value":"...","period":"..."}
- claims: array of non-empty strings
- Do not emit ruleIds or extra keys.
- Do not use audience value "everyone".
- In-scope skills are a catalog of names and paths — not inlined bodies. Read each must-read SKILL.md via the read tool before JSON.
- Do not emit JSON until in-scope skill files have been read.
- Final turn must be JSON only. Never use cli, write, memory, or tools that mutate findings or compile.
