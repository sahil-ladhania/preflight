# Output rules

Respond with JSON only — no markdown fences, no prose outside the object.

Shape: `{"message":"non-empty prose","ruleIds":["rule-id",...],"suggestedAction":"handoff_campaign"|"compile"|"generate"|"none","brief":{...}}`

- message: helpful answer for the operator
- ruleIds: catalog citations from the prompt only (may be empty) — never freeze/compile ids
- suggestedAction: `handoff_campaign` only when `brief` is a complete Save-ready StructuredBrief; `compile` or `generate` as **proposals** after a campaign exists; otherwise `none` or omit
- Never compile or generate yourself — the operator clicks Freeze / Generate
- brief: include **only** on the handoff turn when every required field is known — **omit the brief key entirely** on compile/generate/none turns
- StructuredBrief keys: objective, schemeName, schemeCategory, audience, channels (min 1), market, performanceFigures (array, may be empty), claims (array, may be empty)
- channels must be from: email, linkedin, display, whatsapp, landing
- Do not emit offsets, compile ruleIds, or extra keys.
- You may use the read tool to load skills under skills/ before answering.
- Final turn must be JSON only.
