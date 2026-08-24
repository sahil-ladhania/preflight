/**
 * waive — POST /findings/:id/waive body.
 * Why: human waiver requires nonempty reason (documentation/12 Area 4).
 */

import { z } from "zod"

export const WaiveRequestSchema = z.object({
  reason: z.string().trim().min(1),
})
export type WaiveRequest = z.infer<typeof WaiveRequestSchema>
