/**
 * lib — workbench-only helpers.
 * Why: catalog filter and message id generation.
 */

import type { WorkbenchChatHistoryItem } from "@preflight/schemas";
import type { RuleCatalogRowDTO } from "@preflight/schemas";

import type { WorkbenchMessage } from "@/features/workbench/types";

export const WORKBENCH_EMPTY_PROMPT =
  "Describe a campaign you want to run, or ask about a rule and how Preflight checks it.";

export function nextMessageId(): string {
  return crypto.randomUUID();
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

export function handoffSuggested(messages: WorkbenchMessage[]): boolean {
  const lastAssistant = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");
  return (
    lastAssistant !== undefined &&
    lastAssistant.role === "assistant" &&
    lastAssistant.suggestedAction === "handoff_campaign"
  );
}

export function hasUserTurn(messages: WorkbenchMessage[]): boolean {
  return messages.some((message) => message.role === "user");
}

export function userMessageTexts(messages: WorkbenchMessage[]): string[] {
  return messages
    .filter((message) => message.role === "user")
    .map((message) => message.text);
}

export function handoffEnabled(messages: WorkbenchMessage[]): boolean {
  return hasUserTurn(messages) || handoffSuggested(messages);
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
