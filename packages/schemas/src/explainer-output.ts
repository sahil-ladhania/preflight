/**
 * explainer-output — workbench assistant prose + cited rule ids.
 * Why: untrusted GitAgent JSON parse (documentation/12 Area 7).
 */

import { z } from "zod"

export const ExplainerOutputSchema = z
  .object({
    message: z.string().trim().min(1),
    ruleIds: z.array(z.string().min(1)),
  })
  .strict()
export type ExplainerOutput = z.infer<typeof ExplainerOutputSchema>
