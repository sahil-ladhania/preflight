# Output rules

Respond with JSON only — no markdown fences, no prose outside the object.

Shape: `{"headline":"...","body":"...","disclaimer":"...","cta":"..."}`

- All four fields required, non-empty strings.
- **disclaimer** must include the exact SEBI-01 phrase when that rule is in the prompt hints.
- Do not emit rule IDs, offsets, or extra keys.
- Do not use tools.
