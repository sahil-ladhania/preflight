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
import { WorkbenchTexture } from "@/features/workbench/WorkbenchTexture";
import { WORKBENCH_HEADLINE, WORKBENCH_SUBLINE } from "@/features/workbench/lib";
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
  showSearchFallback: _showSearchFallbackProp,
  searchQuery: _searchQueryProp,
  onComposerTextChange,
  onSearchQueryChange: _onSearchQueryChange,
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
  const composerText = controlled ? (composerTextProp ?? "") : fixture.composerText;
  const sendInFlight = controlled ? (sendInFlightProp ?? false) : fixture.sendInFlight;
  const handoffInFlight = controlled ? (handoffInFlightProp ?? false) : fixture.handoffInFlight;
  const handoffEnabled = controlled ? (handoffEnabledProp ?? false) : fixture.handoffEnabled;
  const handoffDisabledCaption = controlled ? (handoffDisabledCaptionProp ?? null) : fixture.handoffDisabledCaption;
  const briefReadiness = controlled ? briefReadinessProp : fixture.briefReadiness;
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
      showCampaignActions={false}
      appearance={isEmpty ? "empty" : "thread"}
      onChange={setComposerText}
      onSend={handleSend}
      onGoToCampaign={handleGoToCampaign}
      onStartCampaignFromConversation={handleStartCampaign}
    />
  );

  return (
    <div className="relative min-h-below-topbar w-full bg-ground">
      <WorkbenchTexture />
      {isEmpty ? (
        <div className="relative z-10">
          <EmptyStage
            composer={composer}
            handoffInFlight={handoffInFlight}
            onPromptSelect={setComposerText}
          />
        </div>
      ) : (
        <div className="relative z-10 mx-auto flex min-h-below-topbar w-full max-w-workbench flex-col px-8 py-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-subject-title text-fg">
              {WORKBENCH_HEADLINE}
            </h1>
            <p className="text-ui text-fg-muted">{WORKBENCH_SUBLINE}</p>
          </div>
          <div className="mt-6">
            {composer}
          </div>
          <div className="mt-6 flex flex-col gap-6">
            <Thread
              messages={messages}
              rules={rules}
              showSearchFallback={false}
              searchQuery=""
              onSearchQueryChange={() => {}}
            />
            {briefReadiness !== undefined ? (
              <BriefReadiness
                capturedCount={briefReadiness.capturedCount}
                missing={briefReadiness.missing}
                complete={briefReadiness.complete}
                handoffEnabled={handoffEnabled}
                handoffInFlight={handoffInFlight}
                handoffDisabledCaption={handoffDisabledCaption}
                onStartCampaignFromConversation={handleStartCampaign}
                onGoToCampaign={handleGoToCampaign}
              />
            ) : null}
          </div>
          <div className="mt-auto pt-8">
            <div className="border-t border-fg pt-3">
              <span className="text-label-strong uppercase text-fg-muted">
                End of conversation
              </span>
            </div>
          </div>
        </div>
      )}
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
