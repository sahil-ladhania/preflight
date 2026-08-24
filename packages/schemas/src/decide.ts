/**
 * decide — POST /findings/:id/decide discriminated body.
 * Why: confirmed vs overridden branches (documentation/12 Area 4).
 */

import { z } from "zod"

const DecideConfirmedSchema = z.object({ verdict: z.literal("confirmed") }).strict()

const DecideOverriddenSchema = z.object({
  verdict: z.literal("overridden"),
  reason: z.string().trim().min(1),
})

export const DecideRequestSchema = z.discriminatedUnion("verdict", [
  DecideConfirmedSchema,
  DecideOverriddenSchema,
])
export type DecideRequest = z.infer<typeof DecideRequestSchema>
