/**
 * rule — Rulebook catalog rows and judgement CRUD bodies.
 * Why: merged det+jdg list + writes (documentation/12 Areas 3–5).
 */

import { z } from "zod"
import { RuleKindSchema } from "./enums.js"
import { PredicateSpecSchema } from "./primitives.js"

export const RuleCatalogRowDTOSchema = z.object({
  ruleId: z.string().min(1),
  kind: RuleKindSchema,
  wording: z.string().min(1),
  predicateSpec: PredicateSpecSchema.nullable(),
  applicabilitySummary: z.string().nullable(),
  editable: z.boolean(),
})
export type RuleCatalogRowDTO = z.infer<typeof RuleCatalogRowDTOSchema>

export const JudgementRuleDTOSchema = RuleCatalogRowDTOSchema
export type JudgementRuleDTO = z.infer<typeof JudgementRuleDTOSchema>

export const RulesListResponseSchema = z.object({
  rules: z.array(RuleCatalogRowDTOSchema),
})
export type RulesListResponse = z.infer<typeof RulesListResponseSchema>

export const CreateJudgementRuleRequestSchema = z.object({
  wording: z.string().min(1),
  predicateSpec: PredicateSpecSchema,
})
export type CreateJudgementRuleRequest = z.infer<typeof CreateJudgementRuleRequestSchema>

export const UpdateJudgementRuleRequestSchema = z
  .object({
    wording: z.string().min(1).optional(),
    predicateSpec: PredicateSpecSchema.optional(),
  })
  .refine((body) => body.wording !== undefined || body.predicateSpec !== undefined, {
    message: "At least one of wording or predicateSpec required",
  })
export type UpdateJudgementRuleRequest = z.infer<typeof UpdateJudgementRuleRequestSchema>
