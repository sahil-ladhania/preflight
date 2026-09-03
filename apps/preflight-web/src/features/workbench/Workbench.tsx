/**
 * Workbench — Screen 5 stage layout.
 * Why: empty welcome or thread + stage-docked composer; no page footer strip.
 */

import { useEffect, type ReactElement } from "react";

import { BriefReadiness } from "@/features/workbench/BriefReadiness";
import { Composer } from "@/features/workbench/Composer";
import { EmptyStage } from "@/features/workbench/EmptyStage";
import { Thread } from "@/features/workbench/Thread";
import type { WorkbenchProps } from "@/features/workbench/types";
import { useWorkbench } from "@/features/workbench/useWorkbench";
import { useWorkbenchFixture } from "@/features/workbench/useWorkbenchFixture";
import { PageStage } from "@/features/shell/PageStage";
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
  handoffInFlight: handoffInFlightProp,
  handoffEnabled: handoffEnabledProp,
  handoffDisabledCaption: handoffDisabledCaptionProp,
  briefReadiness: briefReadinessProp,
  showSearchFallback: showSearchFallbackProp,
  searchQuery: searchQueryProp,
  onComposerTextChange,
  onSearchQueryChange,
  onSend,
  onGoToCampaign,
  onStartCampaignFromConversation,
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
  const handoffInFlight = controlled
    ? (handoffInFlightProp ?? false)
    : fixture.handoffInFlight;
  const handoffEnabled = controlled
    ? (handoffEnabledProp ?? false)
    : fixture.handoffEnabled;
  const handoffDisabledCaption = controlled
    ? (handoffDisabledCaptionProp ?? null)
    : fixture.handoffDisabledCaption;
  const briefReadiness = controlled
    ? briefReadinessProp
    : fixture.briefReadiness;
  const showSearchFallback = controlled
    ? (showSearchFallbackProp ?? false)
    : fixture.showSearchFallback;
  const searchQuery = controlled ? (searchQueryProp ?? "") : fixture.searchQuery;
  const isEmpty = messages.length === 0;

  const setComposerText = onComposerTextChange ?? fixture.setComposerText;

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

  const handleStartCampaign = (): void => {
    if (onStartCampaignFromConversation !== undefined) {
      void onStartCampaignFromConversation();
      return;
    }
    fixture.handleStartCampaignFromConversation();
  };

  const composer = (
    <Composer
      value={composerText}
      disabled={prefetchFailed}
      sendInFlight={sendInFlight}
      handoffInFlight={handoffInFlight}
      handoffEnabled={handoffEnabled}
      handoffDisabledCaption={handoffDisabledCaption}
      showCampaignActions={!isEmpty}
      onChange={setComposerText}
      onSend={handleSend}
      onGoToCampaign={handleGoToCampaign}
      onStartCampaignFromConversation={handleStartCampaign}
    />
  );

  return (
    <div className="bg-ground">
      <PageStage>
        {isEmpty ? (
          <EmptyStage
            composer={composer}
            handoffInFlight={handoffInFlight}
            onPromptSelect={setComposerText}
            onGoToCampaign={handleGoToCampaign}
          />
        ) : (
          <>
            <Thread
              messages={messages}
              rules={rules}
              showSearchFallback={showSearchFallback}
              searchQuery={searchQuery}
              onSearchQueryChange={
                onSearchQueryChange ?? fixture.setSearchQuery
              }
            />
            <div className="shrink-0 border-t border-border p-4 sm:px-6">
              {briefReadiness !== undefined ? (
                <div className="mb-2">
                  <BriefReadiness
                    capturedCount={briefReadiness.capturedCount}
                    missing={briefReadiness.missing}
                    complete={briefReadiness.complete}
                  />
                </div>
              ) : null}
              {composer}
            </div>
          </>
        )}
      </PageStage>
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
      handoffInFlight={hook.handoffInFlight}
      handoffEnabled={hook.handoffEnabled}
      handoffDisabledCaption={hook.handoffDisabledCaption}
      briefReadiness={hook.briefReadiness}
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
      onStartCampaignFromConversation={() => {
        void hook.startCampaignFromConversation();
      }}
    />
  );
}
