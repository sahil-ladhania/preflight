/**
 * structured-brief — compile input unions and shapes.
 * Why: sole brief shape @preflight/rules understands (documentation/12 Area 1).
 */

export type Channel = "email" | "linkedin" | "display" | "whatsapp" | "landing"

export type MachineVerdict = "pass" | "fail"

export type PredicateOp = "equals" | "in"

export type BriefField =
  | "objective"
  | "schemeName"
  | "schemeCategory"
  | "audience"
  | "channels"
  | "market"
  | "performanceFigures"
  | "claims"

export interface PerformanceFigure {
  value: string
  period: string
}

export interface StructuredBrief {
  objective: string
  schemeName: string
  schemeCategory: string
  audience: string
  channels: Channel[]
  market: string
  performanceFigures: PerformanceFigure[]
  claims: string[]
}

export interface PredicateSpec {
  field: BriefField
  op: PredicateOp
  value: string | string[]
}
