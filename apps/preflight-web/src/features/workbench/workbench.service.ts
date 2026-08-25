/**
 * workbench.service — workbench chat HTTP.
 * Why: hooks call services only, never lib/api directly.
 */

import { WorkbenchChatResponseSchema } from "@preflight/schemas";
import type {
  WorkbenchChatRequest,
  WorkbenchChatResponse,
} from "@preflight/schemas";

import { ApiClientError, apiRequest } from "@/lib/api";

export async function sendWorkbenchChatService(
  body: WorkbenchChatRequest,
  signal: AbortSignal,
): Promise<WorkbenchChatResponse> {
  try {
    return await apiRequest("POST", "/workbench/chat", {
      body,
      signal,
      dataSchema: WorkbenchChatResponseSchema,
      agent: true,
    });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "sendWorkbenchChatService failed";
    throw new Error(`sendWorkbenchChatService: ${message}`, { cause: error });
  }
}
