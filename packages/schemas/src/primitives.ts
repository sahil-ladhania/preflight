/**
 * primitives — scalar and structural building blocks.
 * Why: shared Span, Hash, PredicateSpec (documentation/12 Area 2).
 */

import { z } from "zod"
import { BriefFieldSchema, ChannelSchema } from "./enums.js"

/** Max chars for LLM-bound free text (extract, workbench). */
export const AGENT_INPUT_MAX_LENGTH = 50_000

export const HashSchema = z.string().regex(/^[a-f0-9]{64}$/)
export type Hash = z.infer<typeof HashSchema>

export const IsoDateTimeSchema = z.string().datetime()
export type IsoDateTime = z.infer<typeof IsoDateTimeSchema>

export const SpanSchema = z
  .object({
    start: z.number().int().min(0),
    end: z.number().int().min(1),
    text: z.string().min(1),
  })
  .refine(({ start, end }) => end > start)
export type Span = z.infer<typeof SpanSchema>

export const PerformanceFigureSchema = z.object({
  value: z.string().min(1),
  period: z.string().min(1),
})
export type PerformanceFigure = z.infer<typeof PerformanceFigureSchema>

const PredicateSpecEqualsSchema = z.object({
  field: BriefFieldSchema,
  op: z.literal("equals"),
  value: z.string().min(1),
})

const PredicateSpecInSchema = z.object({
  field: BriefFieldSchema,
  op: z.literal("in"),
  value: z.array(z.string().min(1)).min(1),
})

export const PredicateSpecSchema = z
  .discriminatedUnion("op", [PredicateSpecEqualsSchema, PredicateSpecInSchema])
  .refine((data) => data.field !== "performanceFigures", {
    message: "performanceFigures is not allowed in predicateSpec",
  })
  .refine(
    (data) => {
      if (data.field === "channels" && data.op === "equals") {
        return ChannelSchema.safeParse(data.value).success
      }
      return true
    },
    { message: "channels equals value must be a valid Channel" },
  )
export type PredicateSpec = z.infer<typeof PredicateSpecSchema>
