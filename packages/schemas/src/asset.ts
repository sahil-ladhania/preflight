/**
 * asset — Asset entity, list/detail composites, lineage, exceptions.
 * Why: stored columns + derived read shapes (documentation/12 Areas 3, 5).
 */

import { z } from "zod"
import { AssetStatusSchema, ChannelSchema } from "./enums.js"
import { HashSchema, IsoDateTimeSchema } from "./primitives.js"
import { BrandKitDTOSchema } from "./brand-kit.js"
import { FindingDTOSchema } from "./finding.js"

export const FieldOffsetRangeSchema = z
  .object({
    start: z.number().int().min(0),
    end: z.number().int().min(1),
  })
  .refine(({ start, end }) => end > start)
export type FieldOffsetRange = z.infer<typeof FieldOffsetRangeSchema>

export const FieldOffsetsSchema = z.object({
  headline: FieldOffsetRangeSchema,
  body: FieldOffsetRangeSchema,
  disclaimer: FieldOffsetRangeSchema,
  cta: FieldOffsetRangeSchema,
})
export type FieldOffsets = z.infer<typeof FieldOffsetsSchema>

export const AssetDTOSchema = z.object({
  id: z.string().min(1),
  campaignId: z.string().min(1),
  channel: ChannelSchema,
  constraintSetId: z.string().min(1),
  headline: z.string(),
  body: z.string(),
  disclaimer: z.string(),
  cta: z.string(),
  canonicalText: z.string(),
  fieldOffsets: FieldOffsetsSchema,
  runHash: HashSchema,
  rulesetHash: HashSchema,
  kitFingerprint: HashSchema,
  generatedAt: IsoDateTimeSchema,
  regeneratedFromId: z.string().min(1).nullable(),
  generationIndex: z.number().int().min(1),
})
export type AssetDTO = z.infer<typeof AssetDTOSchema>

export const AssetListItemDTOSchema = z.object({
  id: z.string().min(1),
  channel: ChannelSchema,
  headline: z.string(),
  status: AssetStatusSchema,
  generationIndex: z.number().int().min(1),
  regeneratedFromId: z.string().min(1).nullable(),
  generatedAt: IsoDateTimeSchema,
  pendingCount: z.number().int().min(0),
  statusDetail: z.string().min(1),
})
export type AssetListItemDTO = z.infer<typeof AssetListItemDTOSchema>

export const AssetsListResponseSchema = z.object({
  assets: z.array(AssetListItemDTOSchema),
})
export type AssetsListResponse = z.infer<typeof AssetsListResponseSchema>

export const ExceptionItemDTOSchema = z.object({
  findingId: z.string().min(1),
  ruleId: z.string().min(1),
  frozenWording: z.string().min(1),
  humanReason: z.string().min(1),
  humanActor: z.string().min(1),
  humanAt: IsoDateTimeSchema,
})
export type ExceptionItemDTO = z.infer<typeof ExceptionItemDTOSchema>

export const LineageDTOSchema = z.object({
  parentId: z.string().min(1),
  parentGenerationIndex: z.number().int().min(1),
  parentStatus: AssetStatusSchema,
  ruleIds: z.array(z.string()),
})
export type LineageDTO = z.infer<typeof LineageDTOSchema>

export const AssetDetailDTOSchema = AssetDTOSchema.extend({
  status: AssetStatusSchema,
  findings: z.array(FindingDTOSchema),
  exceptions: z.array(ExceptionItemDTOSchema),
  lineage: LineageDTOSchema.nullable(),
  brandKit: BrandKitDTOSchema,
})
export type AssetDetailDTO = z.infer<typeof AssetDetailDTOSchema>
