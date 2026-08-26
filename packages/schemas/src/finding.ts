/**
 * finding — FindingDTO and finding route bodies/responses.
 * Why: ledger row shape (documentation/12 Areas 3–4).
 */

import { z } from "zod"
import { AgentRunSummaryDTOSchema } from "./agent-run.js"
import {
  AssetStatusSchema,
  EvaluationStatusSchema,
  HumanVerdictSchema,
  RuleKindSchema,
  MachineVerdictSchema,
} from "./enums.js"
import { IsoDateTimeSchema, SpanSchema } from "./primitives.js"

export const FindingDTOSchema = z.object({
  id: z.string().min(1),
  ruleId: z.string().min(1),
  kind: RuleKindSchema,
  frozenWording: z.string().min(1),
  evaluationStatus: EvaluationStatusSchema,
  machineVerdict: MachineVerdictSchema.nullable(),
  machineReason: z.string().nullable(),
  spans: z.array(SpanSchema),
  machineAt: IsoDateTimeSchema.nullable(),
  humanVerdict: HumanVerdictSchema.nullable(),
  humanReason: z.string().nullable(),
  humanActor: z.string().nullable(),
  humanAt: IsoDateTimeSchema.nullable(),
  judgeRun: AgentRunSummaryDTOSchema.nullable(),
})
export type FindingDTO = z.infer<typeof FindingDTOSchema>

export const RetryRequestSchema = z.object({}).strict()
export type RetryRequest = z.infer<typeof RetryRequestSchema>

export const FindingMutationResponseDTOSchema = z.object({
  finding: FindingDTOSchema,
  status: AssetStatusSchema,
})
export type FindingMutationResponseDTO = z.infer<typeof FindingMutationResponseDTOSchema>
