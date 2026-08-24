/**
 * applies-spec — appliesSpec(brief, spec) locked signature.
 * Why: DB judgement predicate JSON interpreter (documentation/12 Area 1).
 */

import type { StructuredBrief, PredicateSpec } from "./structured-brief.js"

/** @preflight/rules logic — not implemented in types-only phase. */
export function appliesSpec(_brief: StructuredBrief, _spec: PredicateSpec): boolean {
  throw new Error("Not implemented")
}
