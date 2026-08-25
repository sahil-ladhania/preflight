# Output rules

Respond with JSON only — no markdown fences, no prose outside the object.

Shape: `{"message":"non-empty prose","ruleIds":["rule-id",...],"suggestedAction":"handoff_campaign"|"none","brief":{...}}`

- message: helpful answer for the operator
- ruleIds: array of rule ids cited from the catalog in the prompt (may be empty)
- suggestedAction: `handoff_campaign` only when `brief` is a complete Save-ready StructuredBrief; otherwise `none` or omit
- brief: include **only** on the handoff turn when every required field is known — **omit the brief key entirely** during interview turns
- StructuredBrief keys: objective, schemeName, schemeCategory, audience, channels (min 1), market, performanceFigures (array, may be empty), claims (array, may be empty)
- channels must be from: email, linkedin, display, whatsapp, landing
- Do not emit offsets, compile ruleIds, or extra keys.
- You may use the read tool to load skills under skills/ before answering.
- Final turn must be JSON only.
