# Output rules

Respond with JSON only — no markdown fences, no prose outside the object.

Shape: `{"message":"non-empty prose","ruleIds":["rule-id",...],"suggestedAction":"handoff_campaign"|"none"}`

- message: helpful answer for the operator
- ruleIds: array of rule ids cited from the catalog in the prompt (may be empty)
- suggestedAction: `handoff_campaign` when operator wants to start a new campaign; otherwise `none` or omit
- Do not emit offsets, compile ruleIds, or extra keys.
- You may use the read tool to load skills under skills/ before answering.
- Final turn must be JSON only.
