/**
 * workbench.service — explainer call.
 * Why: no mutations (14-backend-design.md Area 3).
 */
import {
  ExplainerOutputSchema,
  type WorkbenchChatHistoryItem,
  type WorkbenchChatResponse,
} from "@preflight/schemas";

import { buildExplainerPrompt } from "../../../agents/explainer.prompt.js";
import { getLiveCatalog } from "../../lib/catalog.js";
import { InternalError } from "../../lib/http-error.js";

function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return match?.[1]?.trim() ?? trimmed;
}

function parseExplainerOutput(content: string): WorkbenchChatResponse {
  try {
    const parsed: unknown = JSON.parse(stripJsonFence(content));
    return ExplainerOutputSchema.parse(parsed);
  } catch {
    throw new InternalError("Explainer failed.");
  }
}

export async function chat(
  message: string,
  history?: WorkbenchChatHistoryItem[],
): Promise<WorkbenchChatResponse> {
  const catalog = await getLiveCatalog();
  const catalogLines = catalog.map((entry) => ({
    ruleId: entry.ruleId,
    kind: entry.kind,
    wording: entry.wording,
  }));

  try {
    const prompt = buildExplainerPrompt({ message, history, catalogLines });
    const { runAgent } = await import("../../lib/gitagent.js");
    const { content } = await runAgent("explainer", prompt);
    return parseExplainerOutput(content);
  } catch (error) {
    if (error instanceof InternalError) {
      throw error;
    }

    throw new InternalError("Explainer failed.");
  }
}
