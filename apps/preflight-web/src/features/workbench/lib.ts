/**
 * lib — workbench-only helpers.
 * Why: catalog filter and message id generation.
 */

import type { StructuredBriefInput, WorkbenchChatHistoryItem } from "@preflight/schemas";
import type { RuleCatalogRowDTO } from "@preflight/schemas";

import type { WorkbenchMessage } from "@/features/workbench/types";

export const WORKBENCH_INVITATION =
  "Describe the campaign you want to build — or ask about a rule.";

export const WORKBENCH_PROMPT_CHIPS = [
  "LinkedIn and email for Bluepeak Flexi Cap, professional tone.",
  "HNI launch brief: Flexi Cap, India, highlight flexibility.",
  "What does Preflight check before generate?",
] as const;

const CAMPAIGN_INTENT_KEYWORDS = [
  "campaign",
  "brief",
  "linkedin",
  "email",
  "whatsapp",
  "landing",
  "display",
  "audience",
  "scheme",
  "fund",
  "bluepeak",
  "generate copy",
] as const;

export function hasCampaignIntent(messages: WorkbenchMessage[]): boolean {
  return messages.some((message) => {
    if (message.role !== "user") {
      return false;
    }
    const lower = message.text.toLowerCase();
    return CAMPAIGN_INTENT_KEYWORDS.some((keyword) => lower.includes(keyword));
  });
}

export function lastAssistantSuggestsHandoff(
  messages: WorkbenchMessage[],
): boolean {
  const lastAssistant = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");
  return (
    lastAssistant !== undefined &&
    lastAssistant.role === "assistant" &&
    lastAssistant.suggestedAction === "handoff_campaign"
  );
}

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
  const lastAssistant = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");
  if (
    lastAssistant === undefined ||
    lastAssistant.role !== "assistant" ||
    lastAssistant.suggestedAction !== "handoff_campaign" ||
    lastAssistant.brief === undefined
  ) {
    return null;
  }
  return lastAssistant.brief;
}

export function handoffSuggested(messages: WorkbenchMessage[]): boolean {
  return handoffBriefFromMessages(messages) !== null;
}

export function handoffEnabled(messages: WorkbenchMessage[]): boolean {
  return (
    lastAssistantSuggestsHandoff(messages) || hasCampaignIntent(messages)
  );
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

  const merged: Partial<StructuredBriefInput> = { ...explainerBrief, ...extracted };

  if (extracted.channels === undefined) {
    merged.channels = explainerBrief.channels;
  }
  if (extracted.performanceFigures === undefined) {
    merged.performanceFigures = explainerBrief.performanceFigures;
  }
  if (extracted.claims === undefined) {
    merged.claims = explainerBrief.claims;
  }

  return merged;
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
