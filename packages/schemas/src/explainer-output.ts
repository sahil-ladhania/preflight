/**
 * explainer-output — workbench assistant prose + cited rule ids.
 * Why: untrusted GitAgent JSON parse (documentation/12 Area 7).
 */
// size: wire sanitizer helpers for performance figures and channels stay with schema

import { z } from "zod"

import { StructuredBriefSchema } from "./brief.js"
import { ChannelSchema, type Channel } from "./enums.js"
import { PerformanceFigureSchema } from "./primitives.js"

export const ExplainerSuggestedActionSchema = z.enum([
  "handoff_campaign",
  "compile",
  "generate",
  "none",
])

const BRIEF_STRING_KEYS = [
  "objective",
  "schemeName",
  "schemeCategory",
  "audience",
  "market",
] as const

function isPerformanceFigureWire(
  value: unknown,
): value is { value: string; period: string } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false
  }
  const record = value as Record<string, unknown>
  return (
    typeof record.value === "string" &&
    record.value.trim().length > 0 &&
    typeof record.period === "string" &&
    record.period.trim().length > 0
  )
}

function normalizeChannelWire(value: string): Channel | undefined {
  const normalized = value.trim().toLowerCase()
  const exact = ChannelSchema.safeParse(normalized)
  if (exact.success) {
    return exact.data
  }
  if (normalized.includes("linkedin")) {
    return "linkedin"
  }
  if (normalized.includes("whatsapp")) {
    return "whatsapp"
  }
  if (normalized.includes("display")) {
    return "display"
  }
  if (normalized.includes("landing")) {
    return "landing"
  }
  if (normalized.includes("email") || normalized.includes("newsletter")) {
    return "email"
  }
  return undefined
}

function dedupeChannels(channels: Channel[]): Channel[] {
  const seen = new Set<Channel>()
  const result: Channel[] = []
  for (const channel of channels) {
    if (seen.has(channel)) {
      continue
    }
    seen.add(channel)
    result.push(channel)
  }
  return result
}

/** Drop empty strings and blank arrays from agent brief JSON before Zod min(1). */
export function sanitizeExplainerBriefWire(brief: unknown): unknown {
  if (brief === null || brief === undefined) {
    return undefined
  }
  if (typeof brief !== "object" || Array.isArray(brief)) {
    return undefined
  }

  const raw = brief as Record<string, unknown>
  const out: Record<string, unknown> = {}

  for (const key of BRIEF_STRING_KEYS) {
    const value = raw[key]
    if (typeof value === "string" && value.trim().length > 0) {
      out[key] = value.trim()
    }
  }

  if (Array.isArray(raw.channels) && raw.channels.length > 0) {
    const normalized = dedupeChannels(
      raw.channels
        .filter((item): item is string => typeof item === "string")
        .map((item) => normalizeChannelWire(item))
        .filter((item): item is Channel => item !== undefined),
    )
    if (normalized.length > 0) {
      out.channels = normalized
    }
  }

  if (Array.isArray(raw.performanceFigures)) {
    out.performanceFigures = raw.performanceFigures.filter(isPerformanceFigureWire)
  }

  if (Array.isArray(raw.claims)) {
    out.claims = raw.claims.filter(
      (claim): claim is string =>
        typeof claim === "string" && claim.trim().length > 0,
    )
  }

  if (Object.keys(out).length === 0) {
    return undefined
  }

  return out
}

/** Partial brief on wire during interview; full validation only on handoff. */
export const ExplainerBriefDraftSchema = z
  .object({
    objective: z.string().trim().min(1).optional(),
    schemeName: z.string().trim().min(1).optional(),
    schemeCategory: z.string().trim().min(1).optional(),
    audience: z.string().trim().min(1).optional(),
    channels: z.array(ChannelSchema).min(1).optional(),
    market: z.string().trim().min(1).optional(),
    performanceFigures: z.array(PerformanceFigureSchema).optional(),
    claims: z.array(z.string().trim().min(1)).optional(),
  })
  .strict()
export type ExplainerBriefDraft = z.infer<typeof ExplainerBriefDraftSchema>

const ExplainerBriefDraftWireSchema = z.preprocess(
  sanitizeExplainerBriefWire,
  ExplainerBriefDraftSchema.optional(),
)

export const ExplainerOutputSchema = z
  .object({
    message: z.string().trim().min(1),
    ruleIds: z.array(z.string().min(1)),
    suggestedAction: ExplainerSuggestedActionSchema.optional(),
    brief: ExplainerBriefDraftWireSchema,
  })
  .strict()
export type ExplainerOutput = z.infer<typeof ExplainerOutputSchema>

export type ExplainerSuggestedAction = z.infer<
  typeof ExplainerSuggestedActionSchema
>

function withoutBrief(
  output: ExplainerOutput,
  suggestedAction: ExplainerSuggestedAction | undefined = output.suggestedAction,
): ExplainerOutput {
  return {
    message: output.message,
    ruleIds: output.ruleIds,
    suggestedAction,
  }
}

function validatedDraft(
  brief: ExplainerOutput["brief"],
): ExplainerBriefDraft | undefined {
  if (brief === undefined) {
    return undefined
  }
  const draftResult = ExplainerBriefDraftSchema.safeParse(brief)
  if (!draftResult.success || Object.keys(draftResult.data).length === 0) {
    return undefined
  }
  return draftResult.data
}

/** Parse untrusted explainer JSON; sanitizes empty brief placeholders first. */
export function parseExplainerWireOutput(wire: unknown): ExplainerOutput {
  return ExplainerOutputSchema.parse(wire)
}

/** Keep interview drafts; handoff requires a Save-ready StructuredBrief. */
export function coerceExplainerOutput(output: ExplainerOutput): ExplainerOutput {
  const action = output.suggestedAction

  if (action === "compile" || action === "generate") {
    return withoutBrief(output)
  }

  if (action === "handoff_campaign") {
    const briefResult = StructuredBriefSchema.safeParse(output.brief)
    if (briefResult.success) {
      return {
        message: output.message,
        ruleIds: output.ruleIds,
        suggestedAction: "handoff_campaign",
        brief: briefResult.data,
      }
    }

    const draft = validatedDraft(output.brief)
    if (draft !== undefined) {
      return {
        message: output.message,
        ruleIds: output.ruleIds,
        suggestedAction: "none",
        brief: draft,
      }
    }

    return withoutBrief(output, "none")
  }

  const draft = validatedDraft(output.brief)
  if (draft !== undefined) {
    return {
      message: output.message,
      ruleIds: output.ruleIds,
      suggestedAction: action,
      brief: draft,
    }
  }

  return withoutBrief(output)
}
