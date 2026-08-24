/**
 * rerun-strip — ephemeral POST /assets/:id/rerun response.
 * Why: hash compare + catalog drift (documentation/12 Area 5).
 */

import { z } from "zod"
import { DriftChangeSchema } from "./enums.js"
import { HashSchema } from "./primitives.js"

const DriftDefinitionChangedSchema = z.object({
  kind: z.literal("definition_changed"),
  ruleId: z.string().min(1),
  frozenWording: z.string().min(1),
  liveWording: z.string().min(1),
  changes: z.array(DriftChangeSchema).min(1),
})

const DriftRulesAddedSchema = z.object({
  kind: z.literal("rules_added_outside_freeze"),
  ruleId: z.string().min(1),
  liveWording: z.string().min(1),
})

const DriftFrozenRuleMissingSchema = z.object({
  kind: z.literal("frozen_rule_missing"),
  ruleId: z.string().min(1),
  frozenWording: z.string().min(1),
})

export const DriftItemDTOSchema = z.discriminatedUnion("kind", [
  DriftDefinitionChangedSchema,
  DriftRulesAddedSchema,
  DriftFrozenRuleMissingSchema,
])
export type DriftItemDTO = z.infer<typeof DriftItemDTOSchema>

export const RerunStripDTOSchema = z.object({
  runHash: HashSchema,
  rerunHash: HashSchema,
  hashesMatch: z.boolean(),
  rulesetHash: HashSchema,
  liveRulesetHash: HashSchema,
  driftItems: z.array(DriftItemDTOSchema),
})
export type RerunStripDTO = z.infer<typeof RerunStripDTOSchema>
