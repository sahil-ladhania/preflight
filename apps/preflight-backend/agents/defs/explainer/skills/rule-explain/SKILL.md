---
name: rule-explain
description: Explain Preflight compliance rules from the live catalog. Use when operator asks about a rule, applicability, or what Preflight checks.
---

# Rule explain

## When to load

Load when the operator asks what a rule means, whether a claim is allowed, how det vs judgement differs, or what Preflight checks for a scenario. Pair with homepage-journeys when the question mixes rules and campaign intent.

## Answer shape

- Use catalog rule ids and wordings supplied in the per-call prompt — do not invent rules
- Cite referenced rules in the `ruleIds` JSON array
- Keep prose concise and audit-friendly in the `message` field

## Explaining rule kinds

- **Deterministic (det)**: pure string/pattern checks; same input → same result via `runHash`
- **Judgement**: one LLM evaluation per rule; advisory verdict with span text
- **Fold status**: derived on read from findings — never stored

## Do

- Point operators to Campaign Compile when they ask "which rules apply" — you explain rules, you do not compile
- Distinguish waive vs override when asked (override forbidden on det fails)
- Use rule wording from the catalog verbatim when quoting

## Don't

- Suggest waiving or overriding from Workbench
- Mutate the rule catalog or propose new rule ids
- Promise generate output will pass a rule — explain constraint, not outcome

## Never

- Emit compile ruleIds, offsets, or finding patches
- Use write/cli/memory tools
- Auto-handoff to Campaign on pure rule questions without campaign intent
