/**
 * Workbench — Screen 5 thread layout.
 * Why: canvas-subtle Workbench page.
 */

import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { Composer } from "@/features/workbench/Composer";
import { nextMessageId } from "@/features/workbench/lib";
import { Thread } from "@/features/workbench/Thread";
import type { WorkbenchMessage, WorkbenchProps } from "@/features/workbench/types";
import { useToastContext } from "@/features/shell/ToastHost";
import { CAMPAIGN_ID } from "@/fixtures/campaign";
import { resolveWorkbenchChat } from "@/fixtures/workbench";

export function Workbench({
  rules,
  prefetchFailed = false,
  initialMessages = [],
  initialShowSearchFallback = false,
}: WorkbenchProps): ReactElement {
  const navigate = useNavigate();
  const { enqueue } = useToastContext();
  const [messages, setMessages] = useState<WorkbenchMessage[]>(initialMessages);
  const [composerText, setComposerText] = useState<string>("");
  const [sendInFlight, setSendInFlight] = useState<boolean>(false);
  const [showSearchFallback, setShowSearchFallback] = useState<boolean>(
    initialShowSearchFallback,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [assistantTurns, setAssistantTurns] = useState<number>(0);

  useEffect(() => {
    if (prefetchFailed) {
      enqueue("Could not load rules catalog.");
    }
  }, [prefetchFailed, enqueue]);

  const handleGoToCampaign = (): void => {
    // Will GET /campaigns/latest or POST /campaigns before navigate.
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

    // Will POST /workbench/chat.
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

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col bg-canvas-subtle">
      <div className="mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col px-8 pt-6">
        <h1 className="mb-4 shrink-0 text-title text-fg">Workbench</h1>
        <Thread
          messages={messages}
          rules={rules}
          showSearchFallback={showSearchFallback}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onGoToCampaign={handleGoToCampaign}
        />
      </div>
      <div className="shrink-0 border-t border-border bg-canvas">
        <div className="mx-auto w-full max-w-[720px] px-8 py-4">
          <Composer
            value={composerText}
            disabled={prefetchFailed}
            sendInFlight={sendInFlight}
            onChange={setComposerText}
            onSend={handleSend}
            onGoToCampaign={handleGoToCampaign}
          />
        </div>
      </div>
    </div>
  );
}
