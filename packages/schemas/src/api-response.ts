/**
 * api-response — locked ApiResponse envelope builders.
 * Why: every route wraps success/error (documentation/12 Area 2).
 */

import { z } from "zod"

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export function apiSuccessSchema<T extends z.ZodTypeAny>(
  dataSchema: T,
): z.ZodObject<{ success: z.ZodLiteral<true>; data: T }> {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  })
}

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string().min(1),
})

export function parseApiResponse<T extends z.ZodTypeAny>(
  dataSchema: T,
): z.ZodUnion<[ReturnType<typeof apiSuccessSchema<T>>, typeof apiErrorSchema]> {
  return z.union([apiSuccessSchema(dataSchema), apiErrorSchema])
}
