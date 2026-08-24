/**
 * extractor-output — partial brief proposal from extractor agent.
 * Why: untrusted GitAgent JSON parse (documentation/12 Area 7).
 */

import { z } from "zod"
import { ChannelSchema } from "./enums.js"
import { PerformanceFigureSchema } from "./primitives.js"

export const ExtractorOutputSchema = z
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
  .refine((o) => Object.keys(o).length >= 1, {
    message: "At least one brief field required",
  })
export type ExtractorOutput = z.infer<typeof ExtractorOutputSchema>
