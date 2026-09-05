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

import type { PersonaId } from "@/features/shell/types";
import {
  accumulatedBriefFromMessages,
  draftBriefsFromMessages,
  handoffReadyState,
} from "@/features/workbench/useBriefReadiness";
import type { WorkbenchMessage } from "@/features/workbench/types";

export const WORKBENCH_HEADLINE = "Ask a question, or start a brief.";

export const WORKBENCH_SUBLINE =
  "Ask about a rule, or describe a campaign to start a brief.";

export const WORKBENCH_INVITATION = WORKBENCH_HEADLINE;

export const WORKBENCH_COMPOSER_PLACEHOLDER =
  "Type your question, or paste your brief…";

export const WORKBENCH_START_CAMPAIGN_NOTE =
  "Carries this conversation as a form proposal — you still review and save on Campaign.";

export const WORKBENCH_GO_CAMPAIGN_NOTE =
  "Opens Campaign without this conversation's draft.";

export function workbenchModeLine({
  hasMessages,
  briefing,
  capturedCount,
}: {
  hasMessages: boolean;
  briefing: boolean;
  capturedCount: number;
}): string {
  if (!hasMessages) {
    return WORKBENCH_SUBLINE;
  }
  if (briefing || capturedCount > 0) {
    return `Collecting your campaign brief — ${capturedCount} of 6 fields captured.`;
  }
  return "Answering questions about the rulebook.";
}

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

export type WorkbenchPromptGroup = (typeof WORKBENCH_PROMPT_GROUPS)[number];

/** Meera's job is the campaign; Arjun's is the rulebook. Both groups stay. */
export function promptGroupsForPersona(
  personaId: PersonaId,
): readonly [WorkbenchPromptGroup, WorkbenchPromptGroup] {
  const rulesGroup = WORKBENCH_PROMPT_GROUPS[0];
  const campaignGroup = WORKBENCH_PROMPT_GROUPS[1];
  if (personaId === "meera") {
    return [campaignGroup, rulesGroup];
  }
  return [rulesGroup, campaignGroup];
}

export function nextMessageId(): string {
  return crypto.randomUUID();
}

export function messageCreatedAt(): string {
  return new Date().toISOString();
}

export function formatMessageAge(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffMs = Math.max(0, now.getTime() - then);
  const seconds = Math.floor(diffMs / 1000);

  if (seconds < 60) {
    return seconds <= 1 ? "just now" : `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
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
