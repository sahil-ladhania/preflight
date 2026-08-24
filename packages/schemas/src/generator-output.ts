/**
 * generator-output — four display strings from generator agent.
 * Why: untrusted GitAgent JSON parse (documentation/12 Area 7).
 */

import { z } from "zod"

export const GeneratorOutputSchema = z
  .object({
    headline: z.string().trim().min(1),
    body: z.string().trim().min(1),
    disclaimer: z.string().trim().min(1),
    cta: z.string().trim().min(1),
  })
  .strict()
export type GeneratorOutput = z.infer<typeof GeneratorOutputSchema>
