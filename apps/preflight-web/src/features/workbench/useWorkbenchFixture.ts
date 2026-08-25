/**
 * useWorkbenchFixture — local chat state for design-proof Workbench demos.
 * Why: production route uses useWorkbench; fixtures stay interactive offline.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { nextMessageId } from "@/features/workbench/lib";
import type { WorkbenchMessage } from "@/features/workbench/types";
import { CAMPAIGN_ID } from "@/fixtures/campaign";
import { resolveWorkbenchChat } from "@/fixtures/workbench";

export function useWorkbenchFixture(input: {
  initialMessages: WorkbenchMessage[];
  initialShowSearchFallback: boolean;
}): {
  messages: WorkbenchMessage[];
  composerText: string;
  sendInFlight: boolean;
  showSearchFallback: boolean;
  searchQuery: string;
  setComposerText: (value: string) => void;
  setSearchQuery: (value: string) => void;
  handleSend: () => void;
  handleGoToCampaign: () => void;
} {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<WorkbenchMessage[]>(
    input.initialMessages,
  );
  const [composerText, setComposerText] = useState<string>("");
  const [sendInFlight, setSendInFlight] = useState<boolean>(false);
  const [showSearchFallback, setShowSearchFallback] = useState<boolean>(
    input.initialShowSearchFallback,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [assistantTurns, setAssistantTurns] = useState<number>(0);

  const handleGoToCampaign = (): void => {
    void navigate(`/campaign/${CAMPAIGN_ID}`);
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
    setMessages((current) => [...current, userMessage]);
    setComposerText("");

    const result = resolveWorkbenchChat(text, assistantTurns);
    if (!result.ok) {
      setMessages((current) => [
        ...current,
        { id: nextMessageId(), role: "error", text: result.error },
      ]);
      setShowSearchFallback(true);
    } else {
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId(),
          role: "assistant",
          text: result.data.message,
          ruleIds: result.data.ruleIds,
        },
      ]);
      setAssistantTurns((count) => count + 1);
    }
    setSendInFlight(false);
  };

  return {
    messages,
    composerText,
    sendInFlight,
    showSearchFallback,
    searchQuery,
    setComposerText,
    setSearchQuery,
    handleSend,
    handleGoToCampaign,
  };
}
