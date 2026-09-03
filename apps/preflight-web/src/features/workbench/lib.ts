/**
 * lib — workbench-only helpers.
 * Why: catalog filter, handoff gating, and message id generation.
 */

import {
  isBriefComplete,
  mergeDraftBrief,
  parseCompleteBrief,
} from "@preflight/schemas";
import type { StructuredBriefInput, WorkbenchChatHistoryItem } from "@preflight/schemas";
import type { RuleCatalogRowDTO } from "@preflight/schemas";

import {
  accumulatedBriefFromMessages,
  draftBriefsFromMessages,
  handoffReadyState,
} from "@/features/workbench/useBriefReadiness";
import type { WorkbenchMessage } from "@/features/workbench/types";

export const WORKBENCH_HEADLINE = "Query the Rulebook";

export const WORKBENCH_SUBLINE =
  "Ask about a rule, or describe a campaign to start a brief.";

export const WORKBENCH_INVITATION = WORKBENCH_HEADLINE;

export const WORKBENCH_COMPOSER_PLACEHOLDER =
  "Ask about a rule, or describe a campaign";

export const WORKBENCH_PROMPT_GROUPS = [
  {
    label: "ASK ABOUT THE RULES",
    chips: [
      "What does Preflight check before generate?",
      "When is a performance claim allowed?",
    ],
  },
  {
    label: "START A CAMPAIGN",
    chips: [
      "LinkedIn and email for Bluepeak Flexi Cap, professional tone",
      "HNI launch brief: Flexi Cap, India, highlight flexibility",
    ],
  },
] as const;

export function nextMessageId(): string {
  return crypto.randomUUID();
}

export function replaceMessageById(
  messages: WorkbenchMessage[],
  id: string,
  replacement: WorkbenchMessage,
): WorkbenchMessage[] {
  return messages.map((message) =>
    message.id === id ? replacement : message,
  );
}

export function toChatHistory(
  messages: WorkbenchMessage[],
): WorkbenchChatHistoryItem[] {
  return messages
    .filter(
      (message): message is Extract<
        WorkbenchMessage,
        { role: "user" | "assistant" }
      > => message.role === "user" || message.role === "assistant",
    )
    .map((message) => ({
      role: message.role,
      content: message.text,
    }));
}

export function handoffBriefFromMessages(
  messages: WorkbenchMessage[],
): Partial<StructuredBriefInput> | null {
  const captured = accumulatedBriefFromMessages(messages);
  if (!isBriefComplete(captured)) {
    return null;
  }
  return parseCompleteBrief(captured) ?? captured;
}

export function handoffSuggested(messages: WorkbenchMessage[]): boolean {
  return handoffReadyState(messages).canStart;
}

export function handoffEnabled(messages: WorkbenchMessage[]): boolean {
  return handoffReadyState(messages).canStart;
}

export function buildHandoffFreeText(messages: WorkbenchMessage[]): string {
  return messages
    .filter((message): message is Extract<WorkbenchMessage, { role: "user" }> =>
      message.role === "user",
    )
    .map((message) => message.text.trim())
    .filter((text) => text.length > 0)
    .join("\n\n");
}

export function seedProposalFromExplainer(
  extracted: Partial<StructuredBriefInput>,
  explainerBrief: Partial<StructuredBriefInput> | null,
): Partial<StructuredBriefInput> {
  if (explainerBrief === null) {
    return extracted;
  }

  return mergeDraftBrief(explainerBrief, extracted);
}

export function rulesForIds(
  rules: RuleCatalogRowDTO[],
  ruleIds: string[],
): RuleCatalogRowDTO[] {
  const byId = new Map(rules.map((rule) => [rule.ruleId, rule]));
  return ruleIds
    .map((ruleId) => byId.get(ruleId))
    .filter((rule): rule is RuleCatalogRowDTO => rule !== undefined);
}

export function searchRules(
  rules: RuleCatalogRowDTO[],
  query: string,
  limit = 10,
): RuleCatalogRowDTO[] {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return [];
  }
  return rules
    .filter(
      (rule) =>
        rule.ruleId.toLowerCase().includes(needle) ||
        rule.wording.toLowerCase().includes(needle),
    )
    .slice(0, limit);
}

export { accumulatedBriefFromMessages, draftBriefsFromMessages, handoffReadyState };
