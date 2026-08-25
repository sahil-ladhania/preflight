# src

Public API and implementation of the matching engine. Catalog, predicates, the spec interpreter, hashes, and the deterministic runner sit at this level. Matchers and small text helpers are in subfolders.

| Item | What it is |
|---|---|
| `applies-spec.test.ts` | Tests for the judgement predicate spec interpreter. |
| `applies-spec.ts` | Evaluates `{ field, op, value }` specs against a brief. |
| `catalog.ts` | Deterministic rule definitions and matcher registration. |
| `finding.ts` | Deterministic finding and matcher output types. |
| `hashes.test.ts` | Tests for ruleset, run, and drift hashing. |
| `hashes.ts` | hashRuleset, hashRun, and diffRulesets. |
| `index.ts` | Public exports for the package. |
| `lib/` | Shared text normalization and hashing helpers. |
| `matchers/` | One file per deterministic rule with in-file adversarial tests. |
| `predicates.test.ts` | Tests for package deterministic applies(brief). |
| `predicates.ts` | Which det rules apply to a given structured brief. |
| `run-deterministic.test.ts` | Tests for the deterministic runner. |
| `run-deterministic.ts` | Runs frozen det rules against canonical copy text. |
| `span.ts` | Span and matcher result types for offset reporting. |
| `structured-brief.ts` | StructuredBrief type — sole compile input shape. |
| `types.test.ts` | Type-level and export smoke tests. |
