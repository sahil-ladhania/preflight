# Output rules

Respond with JSON only — no markdown fences, no prose outside the object.

Shape: `{"message":"non-empty prose","ruleIds":["rule-id",...]}`

- message: helpful answer for the operator
- ruleIds: array of rule ids cited from the catalog in the prompt (may be empty)
- Do not emit offsets or extra keys.
- Do not use tools.
