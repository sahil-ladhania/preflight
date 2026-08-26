/**
 * workbench — POST /workbench/chat request and response alias.
 * Why: Phase 8 chat route (documentation/12 Areas 4, 7).
 */

import { z } from "zod"
import { ExplainerBriefDraftSchema, ExplainerOutputSchema } from "./explainer-output.js"
import { AGENT_INPUT_MAX_LENGTH } from "./primitives.js"

export const WorkbenchChatHistoryItemSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(AGENT_INPUT_MAX_LENGTH),
})
export type WorkbenchChatHistoryItem = z.infer<
  typeof WorkbenchChatHistoryItemSchema
>

export const WorkbenchChatRequestSchema = z.object({
  message: z.string().trim().min(1).max(AGENT_INPUT_MAX_LENGTH),
  history: z.array(WorkbenchChatHistoryItemSchema).optional(),
  capturedBrief: ExplainerBriefDraftSchema.optional(),
})
export type WorkbenchChatRequest = z.infer<typeof WorkbenchChatRequestSchema>

export const WorkbenchChatResponseSchema = ExplainerOutputSchema
export type WorkbenchChatResponse = z.infer<typeof WorkbenchChatResponseSchema>
