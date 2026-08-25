# Output rules

Respond with JSON only — no markdown fences, no prose outside the object.

Shape: `{"headline":"...","body":"...","disclaimer":"...","cta":"..."}`

- All four fields required, non-empty strings.
- Do not emit rule IDs, offsets, or extra keys.
- Do not use tools.
