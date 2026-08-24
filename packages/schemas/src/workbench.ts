/**
 * workbench — POST /workbench/chat request and response alias.
 * Why: Phase 8 chat route (documentation/12 Areas 4, 7).
 */

import { z } from "zod"
import { ExplainerOutputSchema } from "./explainer-output.js"

export const WorkbenchChatRequestSchema = z.object({
  message: z.string().trim().min(1),
})
export type WorkbenchChatRequest = z.infer<typeof WorkbenchChatRequestSchema>

export const WorkbenchChatResponseSchema = ExplainerOutputSchema
export type WorkbenchChatResponse = z.infer<typeof WorkbenchChatResponseSchema>
