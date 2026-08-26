/**
 * useBriefReadiness — accumulate draft brief fields from assistant turns.
 * Why: handoff gating and composer readiness share one derived state.
 */

import { useMemo } from "react";

import {
  BRIEF_REQUIRED_SCALAR_FIELDS,
  briefFieldLabel,
  isBriefComplete,
  mergeDraftBrief,
  missingBriefFields,
} from "@preflight/schemas";
import type { BriefField, StructuredBriefInput } from "@preflight/schemas";

import type { WorkbenchMessage } from "@/features/workbench/types";

export function draftBriefsFromMessages(
  messages: WorkbenchMessage[],
): Array<Partial<StructuredBriefInput>> {
  const drafts: Array<Partial<StructuredBriefInput>> = [];
  for (const message of messages) {
    if (message.role === "assistant" && message.brief !== undefined) {
      drafts.push(message.brief);
    }
  }
  return drafts;
}

export function accumulatedBriefFromMessages(
  messages: WorkbenchMessage[],
): Partial<StructuredBriefInput> {
  return mergeDraftBrief(...draftBriefsFromMessages(messages));
}

export function deriveBriefReadiness(messages: WorkbenchMessage[]): {
  captured: Partial<StructuredBriefInput>;
  missing: BriefField[];
  complete: boolean;
  hasUserTurn: boolean;
  capturedCount: number;
} {
  const hasUserTurn = messages.some(
    (message) => message.role === "user" && message.text.trim().length > 0,
  );
  const captured = accumulatedBriefFromMessages(messages);
  const missing = missingBriefFields(captured);
  const capturedCount = BRIEF_REQUIRED_SCALAR_FIELDS.filter((field) => {
    const value = captured[field];
    return typeof value === "string" && value.trim().length > 0;
  }).length + (captured.channels !== undefined && captured.channels.length > 0 ? 1 : 0);

  return {
    captured,
    missing,
    complete: isBriefComplete(captured),
    hasUserTurn,
    capturedCount,
  };
}

export function handoffReadyState(messages: WorkbenchMessage[]): {
  canStart: boolean;
  missing: BriefField[];
  disabledCaption: string | null;
} {
  const readiness = deriveBriefReadiness(messages);
  if (!readiness.hasUserTurn) {
    return {
      canStart: false,
      missing: readiness.missing,
      disabledCaption: "Send a message to start your campaign brief.",
    };
  }
  if (!readiness.complete) {
    const count = readiness.missing.length;
    const labels = readiness.missing.map(briefFieldLabel).join(", ");
    return {
      canStart: false,
      missing: readiness.missing,
      disabledCaption:
        count === 1
          ? `1 detail still needed: ${labels}.`
          : `${count} details still needed: ${labels}.`,
    };
  }
  return {
    canStart: true,
    missing: [],
    disabledCaption: null,
  };
}

export function useBriefReadiness(messages: WorkbenchMessage[]): ReturnType<
  typeof deriveBriefReadiness
> {
  return useMemo(() => deriveBriefReadiness(messages), [messages]);
}
