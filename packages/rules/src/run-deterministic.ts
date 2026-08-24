/**
 * run-deterministic — runDeterministic runner locked signature.
 * Why: frozen det snapshots in; findings and hashes out (documentation/12 Area 1).
 */

import type { DetFinding } from "./finding.js"
import type { DetRunRule } from "./hashes.js"

export interface RunDeterministicInput {
  canonicalText: string
  rules: DetRunRule[]
}

export interface RunDeterministicOutput {
  findings: DetFinding[]
  runHash: string
  rulesetHash: string
}

/** @preflight/rules logic — not implemented in types-only phase. */
export function runDeterministic(_input: RunDeterministicInput): RunDeterministicOutput {
  throw new Error("Not implemented")
}
