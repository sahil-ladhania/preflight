/**
 * Workbench — Screen 5 thread layout.
 * Why: canvas-subtle Workbench page; WorkbenchRoute wires useWorkbench.
 */

import { useEffect, type ReactElement } from "react";

import { Composer } from "@/features/workbench/Composer";
import { Thread } from "@/features/workbench/Thread";
import type { WorkbenchProps } from "@/features/workbench/types";
import { useWorkbench } from "@/features/workbench/useWorkbench";
import { useWorkbenchFixture } from "@/features/workbench/useWorkbenchFixture";
import { useToastContext } from "@/features/shell/ToastHost";

const PREFETCH_FAIL_TOAST = "Could not load rules catalog.";

export function Workbench({
  rules,
  prefetchFailed = false,
  initialMessages = [],
  initialShowSearchFallback = false,
  messages: messagesProp,
  composerText: composerTextProp,
  sendInFlight: sendInFlightProp,
  showSearchFallback: showSearchFallbackProp,
  searchQuery: searchQueryProp,
  onComposerTextChange,
  onSearchQueryChange,
  onSend,
  onGoToCampaign,
}: WorkbenchProps): ReactElement {
  const { enqueue } = useToastContext();
  const fixture = useWorkbenchFixture({
    initialMessages,
    initialShowSearchFallback,
  });
  const controlled = onSend !== undefined;

  useEffect(() => {
    if (!controlled && prefetchFailed) {
      enqueue(PREFETCH_FAIL_TOAST);
    }
  }, [controlled, prefetchFailed, enqueue]);

  const messages = controlled ? (messagesProp ?? []) : fixture.messages;
  const composerText = controlled
    ? (composerTextProp ?? "")
    : fixture.composerText;
  const sendInFlight = controlled
    ? (sendInFlightProp ?? false)
    : fixture.sendInFlight;
  const showSearchFallback = controlled
    ? (showSearchFallbackProp ?? false)
    : fixture.showSearchFallback;
  const searchQuery = controlled ? (searchQueryProp ?? "") : fixture.searchQuery;

  const handleSend = (): void => {
    if (onSend !== undefined) {
      void onSend();
      return;
    }
    fixture.handleSend();
  };

  const handleGoToCampaign = (): void => {
    if (onGoToCampaign !== undefined) {
      void onGoToCampaign();
      return;
    }
    fixture.handleGoToCampaign();
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
          onSearchQueryChange={
            onSearchQueryChange ?? fixture.setSearchQuery
          }
          onGoToCampaign={handleGoToCampaign}
        />
      </div>
      <div className="shrink-0 border-t border-border bg-canvas">
        <div className="mx-auto w-full max-w-[720px] px-8 py-4">
          <Composer
            value={composerText}
            sendInFlight={sendInFlight}
            onChange={onComposerTextChange ?? fixture.setComposerText}
            onSend={handleSend}
            onGoToCampaign={handleGoToCampaign}
          />
        </div>
      </div>
    </div>
  );
}

export function WorkbenchRoute(): ReactElement {
  const hook = useWorkbench();

  return (
    <Workbench
      rules={hook.rules}
      prefetchFailed={hook.prefetchFailed}
      messages={hook.messages}
      composerText={hook.composerText}
      sendInFlight={hook.sendInFlight}
      showSearchFallback={hook.showSearchFallback}
      searchQuery={hook.searchQuery}
      onComposerTextChange={hook.setComposerText}
      onSearchQueryChange={hook.setSearchQuery}
      onSend={() => {
        void hook.send();
      }}
      onGoToCampaign={() => {
        void hook.goToCampaign();
      }}
    />
  );
}
