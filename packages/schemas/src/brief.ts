/**
 * brief — StructuredBrief and PUT brief request.
 * Why: compile input on wire (documentation/12 Area 4).
 */

import { z } from "zod"
import { ChannelSchema } from "./enums.js"
import { PerformanceFigureSchema } from "./primitives.js"

export const StructuredBriefSchema = z.object({
  objective: z.string().trim().min(1),
  schemeName: z.string().trim().min(1),
  schemeCategory: z.string().trim().min(1),
  audience: z.string().trim().min(1),
  channels: z.array(ChannelSchema).min(1),
  market: z.string().trim().min(1),
  performanceFigures: z.array(PerformanceFigureSchema),
  claims: z.array(z.string().trim().min(1)),
})
export type StructuredBriefInput = z.infer<typeof StructuredBriefSchema>

export const PutBriefRequestSchema = z.object({
  structuredBrief: StructuredBriefSchema,
})
export type PutBriefRequest = z.infer<typeof PutBriefRequestSchema>
