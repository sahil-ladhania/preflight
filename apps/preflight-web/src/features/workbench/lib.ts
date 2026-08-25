/**
 * lib — workbench-only helpers.
 * Why: catalog filter and message id generation.
 */

import type { WorkbenchChatHistoryItem } from "@preflight/schemas";
import type { RuleCatalogRowDTO } from "@preflight/schemas";

import type { WorkbenchMessage } from "@/features/workbench/types";

export const WORKBENCH_INVITATION =
  "Ask about rules, compliance, or what Preflight checks before you generate.";

export const WORKBENCH_PROMPT_CHIPS = [
  "What does Preflight check before generate?",
  "When is a performance claim allowed?",
  "How do judgement rules differ from det?",
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
