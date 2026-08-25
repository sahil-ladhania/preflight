# Output rules

Respond with JSON only — no markdown fences, no prose outside the object.

Shape: `{"verdict":"pass"|"fail","reason":"non-empty string","spanText":"optional verbatim phrase"}`

- `verdict`: exactly `pass` or `fail`
- `reason`: non-empty explanation
- `spanText`: include only when verdict is `fail` and a specific phrase from the copy violates the rule. Must be an exact substring of the copy.
- Do not emit rule IDs, offsets, coordinates, or extra keys.
- Do not use tools.
