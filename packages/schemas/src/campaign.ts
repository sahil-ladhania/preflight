/**
 * campaign — Campaign entity, compile/generate routes and responses.
 * Why: campaign wire + composite responses (documentation/12 Areas 3–5).
 */

import { z } from "zod"
import { RuleKindSchema, ChannelSchema } from "./enums.js"
import { AGENT_INPUT_MAX_LENGTH, HashSchema, IsoDateTimeSchema } from "./primitives.js"
import { StructuredBriefSchema } from "./brief.js"
import { ExtractorOutputSchema } from "./extractor-output.js"

export const CompileRuleCardDTOSchema = z.object({
  ruleId: z.string().min(1),
  kind: RuleKindSchema,
  wording: z.string().min(1),
  applicabilityReason: z.string().min(1),
})
export type CompileRuleCardDTO = z.infer<typeof CompileRuleCardDTOSchema>

export const LastCompileDTOSchema = z.object({
  constraintSetId: z.string().min(1),
  rulesetHash: HashSchema,
  ruleIds: z.array(z.string()),
  rules: z.array(CompileRuleCardDTOSchema),
})
export type LastCompileDTO = z.infer<typeof LastCompileDTOSchema>

export const CampaignDTOSchema = z.object({
  id: z.string().min(1),
  freeText: z.string(),
  structuredBrief: StructuredBriefSchema.nullable(),
  currentConstraintSetId: z.string().min(1).nullable(),
  updatedAt: IsoDateTimeSchema,
  lastCompile: LastCompileDTOSchema.nullable(),
})
export type CampaignDTO = z.infer<typeof CampaignDTOSchema>

export const ConstraintSetDTOSchema = z.object({
  id: z.string().min(1),
  campaignId: z.string().min(1),
  rulesetHash: HashSchema,
  createdAt: IsoDateTimeSchema,
})
export type ConstraintSetDTO = z.infer<typeof ConstraintSetDTOSchema>

export const ConstraintSnapshotDTOSchema = z.object({
  constraintSetId: z.string().min(1),
  ruleId: z.string().min(1),
  kind: RuleKindSchema,
  wording: z.string().min(1),
  predicateFingerprint: HashSchema,
  matcherFingerprint: HashSchema.nullable(),
})
export type ConstraintSnapshotDTO = z.infer<typeof ConstraintSnapshotDTOSchema>

export const CreateCampaignRequestSchema = z.object({
  freeText: z.string().max(AGENT_INPUT_MAX_LENGTH).default(""),
})
export type CreateCampaignRequest = z.infer<typeof CreateCampaignRequestSchema>

export const ExtractRequestSchema = z
  .object({
    freeText: z.string().max(AGENT_INPUT_MAX_LENGTH),
  })
  .strict()
export type ExtractRequest = z.infer<typeof ExtractRequestSchema>

export const CompileRequestSchema = z.object({}).strict()
export type CompileRequest = z.infer<typeof CompileRequestSchema>

export const GenerateRequestSchema = z.object({
  regeneratedFromId: z.string().min(1).optional(),
})
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>

export const ExtractResponseDTOSchema = z.object({
  proposal: ExtractorOutputSchema,
  skillsRead: z.array(z.string().min(1)),
})
export type ExtractResponseDTO = z.infer<typeof ExtractResponseDTOSchema>

export const CompileResponseDTOSchema = z.object({
  constraintSetId: z.string().min(1),
  rulesetHash: HashSchema,
  ruleIds: z.array(z.string()),
  rules: z.array(CompileRuleCardDTOSchema),
})
export type CompileResponseDTO = z.infer<typeof CompileResponseDTOSchema>

export const GenerateResponseItemSchema = z.object({
  id: z.string().min(1),
  channel: ChannelSchema,
})
export type GenerateResponseItem = z.infer<typeof GenerateResponseItemSchema>

export const GenerateResponseDTOSchema = z.object({
  assets: z.array(GenerateResponseItemSchema).min(1),
  skillsRead: z.array(z.string().min(1)),
})
export type GenerateResponseDTO = z.infer<typeof GenerateResponseDTOSchema>

export const LatestCampaignResponseSchema = z.object({
  id: z.string().min(1),
})
export type LatestCampaignResponse = z.infer<typeof LatestCampaignResponseSchema>
