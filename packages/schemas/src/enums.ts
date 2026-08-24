/**
 * enums — shared wire unions (schemas-only extras included).
 * Why: z.infer only; never import @preflight/rules (documentation/12 Area 2).
 */

import { z } from "zod"

export const ChannelSchema = z.enum([
  "email",
  "linkedin",
  "display",
  "whatsapp",
  "landing",
] as const)
export type Channel = z.infer<typeof ChannelSchema>

export const RuleKindSchema = z.enum(["deterministic", "judgement"] as const)
export type RuleKind = z.infer<typeof RuleKindSchema>

export const MachineVerdictSchema = z.enum(["pass", "fail"] as const)
export type MachineVerdict = z.infer<typeof MachineVerdictSchema>

export const PredicateOpSchema = z.enum(["equals", "in"] as const)
export type PredicateOp = z.infer<typeof PredicateOpSchema>

export const BriefFieldSchema = z.enum([
  "objective",
  "schemeName",
  "schemeCategory",
  "audience",
  "channels",
  "market",
  "performanceFigures",
  "claims",
] as const)
export type BriefField = z.infer<typeof BriefFieldSchema>

export const DriftKindSchema = z.enum([
  "definition_changed",
  "rules_added_outside_freeze",
  "frozen_rule_missing",
] as const)
export type DriftKind = z.infer<typeof DriftKindSchema>

export const DriftChangeSchema = z.enum(["wording", "predicate", "matcher"] as const)
export type DriftChange = z.infer<typeof DriftChangeSchema>

export const AssetStatusSchema = z.enum([
  "blocked",
  "needs_human",
  "needs_regen",
  "cleared_with_exception",
  "clear",
] as const)
export type AssetStatus = z.infer<typeof AssetStatusSchema>

/** Alias used by fold-status.ts locked signature. */
export const StatusSchema = AssetStatusSchema
export type Status = AssetStatus

export const EvaluationStatusSchema = z.enum(["pending", "complete", "unavailable"] as const)
export type EvaluationStatus = z.infer<typeof EvaluationStatusSchema>

export const HumanVerdictSchema = z.enum(["confirmed", "overridden", "waived"] as const)
export type HumanVerdict = z.infer<typeof HumanVerdictSchema>

export const DecideVerdictSchema = z.enum(["confirmed", "overridden"] as const)
export type DecideVerdict = z.infer<typeof DecideVerdictSchema>
