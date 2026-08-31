/**
 * workbench-parse — explainer JSON parse and brief salvage.
 * Why: testable without env; omit brief on nested shape failure (Fix 3).
 */
import {
  coerceExplainerOutput,
  parseExplainerWireOutput,
  type WorkbenchChatResponse,
} from "@preflight/schemas";
import { ZodError } from "zod";

export interface ParsedExplainerOutput {
  response: WorkbenchChatResponse;
  droppedBrief: boolean;
}

function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return match?.[1]?.trim() ?? trimmed;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBriefParseFailure(error: unknown): boolean {
  if (!(error instanceof ZodError)) {
    return false;
  }

  return error.issues.some((issue) => issue.path[0] === "brief");
}

function buildSalvageWire(parsed: Record<string, unknown>): Record<string, unknown> {
  const wire: Record<string, unknown> = {
    message: parsed.message,
    ruleIds: Array.isArray(parsed.ruleIds) ? parsed.ruleIds : [],
  };

  if (parsed.suggestedAction !== undefined) {
    wire.suggestedAction = parsed.suggestedAction;
  }

  return wire;
}

function parseWire(parsed: unknown): WorkbenchChatResponse {
  return coerceExplainerOutput(parseExplainerWireOutput(parsed));
}

export function parseExplainerOutput(content: string): ParsedExplainerOutput {
  const parsed: unknown = JSON.parse(stripJsonFence(content));

  try {
    return { response: parseWire(parsed), droppedBrief: false };
  } catch (error: unknown) {
    if (!isBriefParseFailure(error) || !isRecord(parsed)) {
      throw error;
    }

    if (typeof parsed.message !== "string") {
      throw error;
    }

    const salvaged = parseWire(buildSalvageWire(parsed));
    return { response: salvaged, droppedBrief: true };
  }
}
