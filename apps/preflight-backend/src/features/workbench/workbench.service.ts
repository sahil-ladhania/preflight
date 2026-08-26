/**
 * workbench.service — explainer call.
 * Why: no mutations (14-backend-design.md Area 3).
 */
import {
  coerceExplainerOutput,
  parseExplainerWireOutput,
  type ExplainerBriefDraft,
  type WorkbenchChatHistoryItem,
  type WorkbenchChatResponse,
} from "@preflight/schemas";
import { ZodError } from "zod";

import { buildExplainerPrompt } from "../../../agents/explainer.prompt.js";
import { env } from "../../config/env.js";
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
    return coerceExplainerOutput(parseExplainerWireOutput(parsed));
  } catch (error: unknown) {
    if (env.NODE_ENV === "development") {
      const preview = content.slice(0, 500);
      if (error instanceof ZodError) {
        console.error("parseExplainerOutput schema failure:", error.issues);
      } else {
        console.error("parseExplainerOutput failure:", error);
      }
      console.error("parseExplainerOutput raw content:", preview);
    }

    throw new InternalError("Explainer failed.");
  }
}

export async function chat(
  message: string,
  history?: WorkbenchChatHistoryItem[],
  capturedBrief?: ExplainerBriefDraft,
): Promise<WorkbenchChatResponse> {
  const catalog = await getLiveCatalog();
  const catalogLines = catalog.map((entry) => ({
    ruleId: entry.ruleId,
    kind: entry.kind,
    wording: entry.wording,
  }));

  try {
    const prompt = buildExplainerPrompt({
      message,
      history,
      capturedBrief,
      catalogLines,
    });
    const { runAgent } = await import("../../lib/gitagent.js");
    const { content } = await runAgent("explainer", prompt);
    return parseExplainerOutput(content);
  } catch (error) {
    if (error instanceof InternalError) {
      throw error;
    }

    if (env.NODE_ENV === "development") {
      console.error("workbench chat agent failure:", error);
    }

    throw new InternalError("Explainer failed.");
  }
}
