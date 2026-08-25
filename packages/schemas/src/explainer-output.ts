/**
 * explainer-output — workbench assistant prose + cited rule ids.
 * Why: untrusted GitAgent JSON parse (documentation/12 Area 7).
 */

import { z } from "zod"

import { StructuredBriefSchema } from "./brief.js"
import { ChannelSchema } from "./enums.js"
import { PerformanceFigureSchema } from "./primitives.js"

export const ExplainerSuggestedActionSchema = z.enum([
  "handoff_campaign",
  "none",
])

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

export const ExplainerOutputSchema = z
  .object({
    message: z.string().trim().min(1),
    ruleIds: z.array(z.string().min(1)),
    suggestedAction: ExplainerSuggestedActionSchema.optional(),
    brief: ExplainerBriefDraftSchema.optional(),
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

/** Strip draft brief unless handoff includes a Save-ready StructuredBrief. */
export function coerceExplainerOutput(output: ExplainerOutput): ExplainerOutput {
  if (output.suggestedAction !== "handoff_campaign") {
    return withoutBrief(output);
  }

  const briefResult = StructuredBriefSchema.safeParse(output.brief);
  if (!briefResult.success) {
    return withoutBrief(output, "none");
  }

  return {
    message: output.message,
    ruleIds: output.ruleIds,
    suggestedAction: "handoff_campaign",
    brief: briefResult.data,
  };
}
