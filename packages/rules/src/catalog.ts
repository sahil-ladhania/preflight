/**
 * catalog — deterministic rule catalog entry shape.
 * Why: package det defs; judgement wording lives in Postgres (documentation/12 Area 1).
 */

import type { StructuredBrief } from "./structured-brief.js"
import type { MatcherResult } from "./span.js"

export interface DeterministicRule {
  id: string
  wording: string
  kind: "deterministic"
  applies: (brief: StructuredBrief) => boolean
  match: (canonicalText: string) => MatcherResult
}
