/**
 * brief-completeness — required-field checks and draft merge for interview.
 * Why: workbench readiness and campaign gates share one source (doc 19 UX).
 */

import type { BriefField } from "./enums.js"
import type { ExplainerBriefDraft } from "./explainer-output.js"
import type { StructuredBriefInput } from "./brief.js"
import { StructuredBriefSchema } from "./brief.js"

export const BRIEF_REQUIRED_SCALAR_FIELDS: BriefField[] = [
  "objective",
  "schemeName",
  "schemeCategory",
  "audience",
  "market",
]

export const BRIEF_FIELD_LABELS: Record<BriefField, string> = {
  objective: "Objective",
  schemeName: "Scheme name",
  schemeCategory: "Scheme category",
  audience: "Audience",
  channels: "Channels",
  market: "Market",
  performanceFigures: "Performance figures",
  claims: "Claims",
}

export function briefFieldLabel(field: BriefField): string {
  return BRIEF_FIELD_LABELS[field]
}

export function missingBriefFields(
  brief: Partial<StructuredBriefInput> | StructuredBriefInput,
): BriefField[] {
  const missing: BriefField[] = []
  for (const key of BRIEF_REQUIRED_SCALAR_FIELDS) {
    const value = brief[key]
    if (typeof value !== "string" || value.trim().length === 0) {
      missing.push(key)
    }
  }
  if (brief.channels === undefined || brief.channels.length === 0) {
    missing.push("channels")
  }
  return missing
}

export function isBriefComplete(
  brief: Partial<StructuredBriefInput> | StructuredBriefInput,
): boolean {
  return missingBriefFields(brief).length === 0
}

type DraftLike = Partial<StructuredBriefInput> | ExplainerBriefDraft | undefined

export function mergeDraftBrief(...drafts: DraftLike[]): Partial<StructuredBriefInput> {
  const merged: Partial<StructuredBriefInput> = {}

  for (const draft of drafts) {
    if (draft === undefined) {
      continue
    }

    if (draft.objective !== undefined && draft.objective.trim().length > 0) {
      merged.objective = draft.objective.trim()
    }
    if (draft.schemeName !== undefined && draft.schemeName.trim().length > 0) {
      merged.schemeName = draft.schemeName.trim()
    }
    if (
      draft.schemeCategory !== undefined &&
      draft.schemeCategory.trim().length > 0
    ) {
      merged.schemeCategory = draft.schemeCategory.trim()
    }
    if (draft.audience !== undefined && draft.audience.trim().length > 0) {
      merged.audience = draft.audience.trim()
    }
    if (draft.market !== undefined && draft.market.trim().length > 0) {
      merged.market = draft.market.trim()
    }
    if (draft.channels !== undefined && draft.channels.length > 0) {
      merged.channels = draft.channels
    }
    if (draft.performanceFigures !== undefined) {
      merged.performanceFigures = draft.performanceFigures
    }
    if (draft.claims !== undefined) {
      merged.claims = draft.claims
    }
  }

  return merged
}

export function parseCompleteBrief(
  brief: Partial<StructuredBriefInput> | StructuredBriefInput,
): StructuredBriefInput | null {
  const result = StructuredBriefSchema.safeParse(brief)
  if (!result.success) {
    return null
  }
  return result.data
}
