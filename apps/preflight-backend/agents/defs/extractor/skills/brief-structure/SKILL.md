---
name: brief-structure
description: Map free-text campaign prose to partial StructuredBrief JSON fields. Use when extracting a brief from operator paste.
---

# Brief structure

Map operator free text into **partial** StructuredBrief keys only.

## Output keys (any subset with at least one key)

- objective, schemeName, schemeCategory, audience, channels, market, performanceFigures, claims

## Rules

- channels must be from: email, linkedin, display, whatsapp, landing
- performanceFigures: array of `{ value, period }`
- claims: array of non-empty strings
- **Never** emit ruleIds or compile hints
- Omit keys you cannot infer; do not invent scheme names not in the text
