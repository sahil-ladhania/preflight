---
name: sebi-copy-constraints
description: How to obey frozen compliance rule wordings in generated copy without inventing new rules. Use on every generate call alongside brand-voice and channel skills.
---

# SEBI copy constraints

## When to load

Load for every generate call after brand-voice. The per-call prompt includes frozen rule wordings and deterministic hint lines — this skill explains how to satisfy them through copy only.

## Core principle

Treat each frozen rule wording in the prompt as a **hard constraint** on the four output strings that compose `canonicalText`. You satisfy rules by writing compliant copy — not by referencing rule ids in output.

Channel headline character caps from brand-voice and channel skills do not override compliance wordings — satisfy both.

## Deterministic hints

When the prompt lists "Deterministic implementation" lines:

- If a hint says disclaimer must contain an exact phrase, include that phrase verbatim in the **disclaimer** field
- If a hint references a forbidden pattern, ensure headline, body, disclaimer, and cta contain no violating substring
- Hints describe what `runDeterministic` will check — your copy must pass those checks

## Performance and claims

- Do not invent performance figures beyond the structured brief
- When citing figures from the brief, include the period label in body (or headline if space requires)
- Do not add new marketing claims the brief did not authorize

## Revision context

When the prompt includes a prior draft and failed rules:

- Fix every listed failure span without dropping language that already passed
- Do not introduce new violations while fixing old ones
- Prefer minimal edits to failing spans

## Do

- Read frozen wordings carefully before writing
- Cross-check output against det hint lines before final JSON

## Don't

- Add rule ids to output JSON
- Argue with or explain rules in prose — output JSON only on final turn
- Assume judgement rules are satisfied by disclaimer alone — check each wording

## Never

- Invoke compile, findings, or engine tools
- Emit offsets, coordinates, or trusted span positions
- Invent new compliance rules not in the prompt
