/**
 * useWorkbenchFixture — local chat state for design-proof Workbench demos.
 * Why: production route uses useWorkbench; fixtures stay interactive offline.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  handoffEnabled as computeHandoffEnabled,
  nextMessageId,
  replaceMessageById,
} from "@/features/workbench/lib";
import type { WorkbenchMessage } from "@/features/workbench/types";
import { CAMPAIGN_ID, EXTRACT_PROPOSAL } from "@/fixtures/campaign";
import { resolveWorkbenchChat } from "@/fixtures/workbench";

const FIXTURE_RESPONSE_DELAY_MS = 600;

export function useWorkbenchFixture(input: {
  initialMessages: WorkbenchMessage[];
  initialShowSearchFallback: boolean;
}): {
  messages: WorkbenchMessage[];
  composerText: string;
  sendInFlight: boolean;
  handoffInFlight: boolean;
  handoffEnabled: boolean;
  showSearchFallback: boolean;
  searchQuery: string;
  setComposerText: (value: string) => void;
  setSearchQuery: (value: string) => void;
  handleSend: () => void;
  handleGoToCampaign: () => void;
  handleStartCampaignFromConversation: () => void;
} {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<WorkbenchMessage[]>(
    input.initialMessages,
  );
  const [composerText, setComposerText] = useState<string>("");
  const [sendInFlight, setSendInFlight] = useState<boolean>(false);
  const [handoffInFlight, setHandoffInFlight] = useState<boolean>(false);
  const [showSearchFallback, setShowSearchFallback] = useState<boolean>(
    input.initialShowSearchFallback,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [assistantTurns, setAssistantTurns] = useState<number>(0);

  const handleGoToCampaign = (): void => {
    void navigate(`/campaign/${CAMPAIGN_ID}`);
  };

  const handleStartCampaignFromConversation = (): void => {
    setHandoffInFlight(true);
    void navigate(`/campaign/${CAMPAIGN_ID}`, {
      state: {
        handoff: {
          proposal: EXTRACT_PROPOSAL,
          freeText: messages
            .filter((message) => message.role === "user")
            .map((message) => message.text)
            .join("\n\n"),
        },
      },
    });
    setHandoffInFlight(false);
  };

  const handleSend = (): void => {
    const text = composerText.trim();
    if (text.length === 0 || sendInFlight) {
      return;
    }

    setSendInFlight(true);
    const userMessage: WorkbenchMessage = {
      id: nextMessageId(),
      role: "user",
      text,
    };
    const pendingId = nextMessageId();
    const turn = assistantTurns;
    setMessages((current) => [
      ...current,
      userMessage,
      { id: pendingId, role: "pending" },
    ]);
    setComposerText("");

    window.setTimeout(() => {
      const result = resolveWorkbenchChat(text, turn);
      if (!result.ok) {
        setMessages((current) =>
          replaceMessageById(current, pendingId, {
            id: nextMessageId(),
            role: "error",
            text: result.error,
          }),
        );
        setShowSearchFallback(true);
      } else {
        setMessages((current) =>
          replaceMessageById(current, pendingId, {
            id: pendingId,
            role: "assistant",
            text: result.data.message,
            ruleIds: result.data.ruleIds,
            suggestedAction: result.data.suggestedAction,
            reveal: true,
          }),
        );
        setAssistantTurns((count) => count + 1);
      }
      setSendInFlight(false);
    }, FIXTURE_RESPONSE_DELAY_MS);
  };

  return {
    messages,
    composerText,
    sendInFlight,
    handoffInFlight,
    handoffEnabled: computeHandoffEnabled(messages),
    showSearchFallback,
    searchQuery,
    setComposerText,
    setSearchQuery,
    handleSend,
    handleGoToCampaign,
    handleStartCampaignFromConversation,
  };
}
