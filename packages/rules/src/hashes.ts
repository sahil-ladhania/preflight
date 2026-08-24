/**
 * hashes — hashable rule shapes and locked hash/diff signatures.
 * Why: compile pin, runHash, re-run strip (documentation/12 Area 1).
 */

import type { MatcherResult } from "./span.js"
import type { MatcherOutput } from "./finding.js"

export type RuleKind = "deterministic" | "judgement"

export type DriftKind =
  | "definition_changed"
  | "rules_added_outside_freeze"
  | "frozen_rule_missing"

export type DriftChange = "wording" | "predicate" | "matcher"

export interface HashableRule {
  id: string
  kind: RuleKind
  wording: string
  predicateFingerprint: string
  matcherFingerprint: string | null
}

export interface DetRunRule extends HashableRule {
  kind: "deterministic"
  matcherFingerprint: string
  match: (canonicalText: string) => MatcherResult
}

export type DriftItem =
  | {
      kind: "definition_changed"
      ruleId: string
      frozenWording: string
      liveWording: string
      changes: DriftChange[]
    }
  | {
      kind: "rules_added_outside_freeze"
      ruleId: string
      liveWording: string
    }
  | {
      kind: "frozen_rule_missing"
      ruleId: string
      frozenWording: string
    }

export interface HashRunInput {
  canonicalText: string
  rulesetHash: string
  matcherOutputs: MatcherOutput[]
}

/** @preflight/rules logic — not implemented in types-only phase. */
export function hashRuleset(_defs: HashableRule[]): string {
  throw new Error("Not implemented")
}

/** @preflight/rules logic — not implemented in types-only phase. */
export function hashRun(_input: HashRunInput): string {
  throw new Error("Not implemented")
}

/** @preflight/rules logic — not implemented in types-only phase. */
export function diffRulesets(_frozen: HashableRule[], _live: HashableRule[]): DriftItem[] {
  throw new Error("Not implemented")
}
