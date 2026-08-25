---
name: brief-structure
description: Map free-text campaign prose to partial StructuredBrief JSON fields. Use when extracting a brief from operator paste or Workbench handoff free text.
---

# Brief structure

## When to load

Use when the operator provides unstructured campaign prose (paste, handoff free text, or notes). Your job is field mapping — not rule selection, not compile, not generate.

## Output keys (any subset; at least one key required)

- `objective` — campaign goal in one sentence
- `schemeName` — fund or product name as stated in the text
- `schemeCategory` — e.g. equity, debt, hybrid, flexi cap
- `audience` — who the campaign targets (not "everyone")
- `channels` — array from: email, linkedin, display, whatsapp, landing
- `market` — geography or segment (e.g. India, HNI, retail)
- `performanceFigures` — array of `{ value, period }` objects
- `claims` — array of non-empty marketing claim strings

## Mapping rules

- **channels**: only use the five allowed values; infer from mentions (e.g. "LinkedIn post" → linkedin)
- **performanceFigures**: extract numeric claims with their stated period (e.g. "12% over 3 years" → `{ value: "12%", period: "3 years" }`)
- **claims**: pull explicit marketing claims; omit vague filler
- Omit keys you cannot infer from the text — do not invent scheme names or figures

## Do

- Prefer partial extraction over guessing
- Normalize channel names to the allowed enum
- Keep audience specific (e.g. "retail investors in metro cities")

## Don't

- Emit `ruleIds` or compile-related keys
- Use audience value `"everyone"`
- Fill performance figures the operator did not state
- Auto-complete a "full" brief when the text is thin

## Never

- Choose which compliance rules apply
- Suggest compile, generate, or findings actions
- Emit extra keys beyond the StructuredBrief partial shape
