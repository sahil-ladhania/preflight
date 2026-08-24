/**
 * fold-status — derived asset status from findings (locked branch order).
 * Why: never persisted; schemas-only (documentation/12 Area 6).
 */

import { z } from "zod"
import {
  EvaluationStatusSchema,
  HumanVerdictSchema,
  MachineVerdictSchema,
  RuleKindSchema,
  StatusSchema,
  type Status,
} from "./enums.js"

export { StatusSchema }

export const FoldFindingSchema = z.object({
  kind: RuleKindSchema,
  evaluationStatus: EvaluationStatusSchema,
  machineVerdict: MachineVerdictSchema.nullable(),
  humanVerdict: HumanVerdictSchema.nullable(),
})
export type FoldFinding = z.infer<typeof FoldFindingSchema>

function isBlockedDet(f: FoldFinding): boolean {
  return (
    f.kind === "deterministic" &&
    f.machineVerdict === "fail" &&
    f.humanVerdict !== "waived"
  )
}

function isOpenJudgement(f: FoldFinding): boolean {
  return (
    f.kind === "judgement" &&
    (f.evaluationStatus !== "complete" ||
      (f.machineVerdict === "fail" && f.humanVerdict === null))
  )
}

function isConfirmedJdgFail(f: FoldFinding): boolean {
  return (
    f.kind === "judgement" &&
    f.machineVerdict === "fail" &&
    f.humanVerdict === "confirmed"
  )
}

export function foldStatus(findings: FoldFinding[]): Status {
  if (findings.some(isBlockedDet)) return "blocked"
  if (findings.some(isOpenJudgement)) return "needs_human"
  if (findings.some(isConfirmedJdgFail)) return "needs_regen"
  if (findings.some((f) => f.humanVerdict === "waived")) return "cleared_with_exception"
  return "clear"
}
