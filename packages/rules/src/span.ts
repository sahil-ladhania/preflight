/**
 * span — matcher span triple and det matcher result.
 * Why: offsets index canonicalText only (documentation/12 Area 1).
 */

import type { MachineVerdict } from "./structured-brief.js"

export interface Span {
  start: number
  end: number
  text: string
}

export interface MatcherResult {
  machineVerdict: MachineVerdict
  machineReason: string
  spans: Span[]
}
