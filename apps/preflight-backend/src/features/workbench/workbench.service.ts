/**
 * workbench.service — explainer call.
 * Why: no mutations (14-backend-design.md Area 3).
 */
import type {
  ExplainerBriefDraft,
  WorkbenchChatHistoryItem,
  WorkbenchChatResponse,
} from "@preflight/schemas";

import { buildExplainerPrompt } from "../../../agents/explainer.prompt.js";
import { env } from "../../config/env.js";
import { AgentInvocationError, hashAgentText } from "../../lib/gitagent.js";
import { getLiveCatalog } from "../../lib/catalog.js";
import { detectInjectionSignals } from "../../lib/injection-guard.js";
import { InternalError } from "../../lib/http-error.js";
import { recordAgentRun } from "../agent-runs/agent-runs.service.js";
import { parseExplainerOutput } from "./workbench-parse.js";

function untrustedExplainerText(
  message: string,
  history: WorkbenchChatHistoryItem[] | undefined,
): string {
  const parts = [...(history ?? []).map((turn) => turn.content), message];
  return parts.join("\n");
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
  const injection = detectInjectionSignals(untrustedExplainerText(message, history));

  try {
    const prompt = buildExplainerPrompt({
      message,
      history,
      capturedBrief,
      catalogLines,
    });
    const { runAgent } = await import("../../lib/gitagent.js");
    const { content, meta } = await runAgent("explainer", prompt);

    try {
      const { response, droppedBrief } = parseExplainerOutput(content);

      if (droppedBrief) {
        void recordAgentRun(
          {
            ...meta,
            ok: false,
            errorKind: "parse_failed",
            output: content,
            outputHash: hashAgentText(content),
          },
          { kind: "chat", id: null },
          injection,
        );
        return response;
      }

      void recordAgentRun(meta, { kind: "chat", id: null }, injection);
      return response;
    } catch (parseError: unknown) {
      if (env.NODE_ENV === "development") {
        console.error("parseExplainerOutput failure:", parseError);
        console.error("parseExplainerOutput raw content:", content.slice(0, 500));
      }

      void recordAgentRun(
        {
          ...meta,
          ok: false,
          errorKind: "parse_failed",
          output: content,
          outputHash: hashAgentText(content),
        },
        { kind: "chat", id: null },
        injection,
      );
      throw new InternalError("Explainer failed.");
    }
  } catch (error) {
    if (error instanceof AgentInvocationError) {
      void recordAgentRun(error.meta, { kind: "chat", id: null }, injection);
    }

    if (error instanceof InternalError) {
      throw error;
    }

    if (env.NODE_ENV === "development") {
      console.error("workbench chat agent failure:", error);
    }

    throw new InternalError("Explainer failed.");
  }
}
