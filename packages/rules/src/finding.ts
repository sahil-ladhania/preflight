/**
 * finding — engine-layer finding records.
 * Why: runDeterministic output; smaller than wire FindingDTO (documentation/12 Area 1).
 */

import type { MachineVerdict } from "./structured-brief.js"
import type { Span } from "./span.js"

export interface DetFinding {
  ruleId: string
  kind: "deterministic"
  machineVerdict: MachineVerdict
  machineReason: string
  spans: Span[]
}

export interface MatcherOutput {
  ruleId: string
  machineVerdict: MachineVerdict
  spans: Span[]
}
