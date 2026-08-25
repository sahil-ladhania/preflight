/**
 * explainer-output — workbench assistant prose + cited rule ids.
 * Why: untrusted GitAgent JSON parse (documentation/12 Area 7).
 */

import { z } from "zod"

export const ExplainerSuggestedActionSchema = z.enum([
  "handoff_campaign",
  "none",
])

export const ExplainerOutputSchema = z
  .object({
    message: z.string().trim().min(1),
    ruleIds: z.array(z.string().min(1)),
    suggestedAction: ExplainerSuggestedActionSchema.optional(),
  })
  .strict()
export type ExplainerOutput = z.infer<typeof ExplainerOutputSchema>
export type ExplainerSuggestedAction = z.infer<
  typeof ExplainerSuggestedActionSchema
>
