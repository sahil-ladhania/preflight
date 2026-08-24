/**
 * index — @preflight/rules public API (types + locked signatures).
 * Why: zero-dep engine package (documentation/12 Area 1).
 */

export type {
  Channel,
  MachineVerdict,
  PredicateOp,
  BriefField,
  PerformanceFigure,
  StructuredBrief,
  PredicateSpec,
} from "./structured-brief.js"

export type { Span, MatcherResult } from "./span.js"

export type { DetFinding, MatcherOutput } from "./finding.js"

export type {
  RuleKind,
  DriftKind,
  DriftChange,
  HashableRule,
  DetRunRule,
  DriftItem,
  HashRunInput,
} from "./hashes.js"

export { hashRuleset, hashRun, diffRulesets } from "./hashes.js"

export { appliesSpec } from "./applies-spec.js"

export type { RunDeterministicInput, RunDeterministicOutput } from "./run-deterministic.js"
export { runDeterministic } from "./run-deterministic.js"

export type { DeterministicRule } from "./catalog.js"
