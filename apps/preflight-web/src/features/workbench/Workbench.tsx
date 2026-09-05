/**
 * Workbench — Screen 5 stage layout.
 * Why: empty welcome or thread + stage-docked composer; no page footer strip.
 */

import { useEffect, useRef, type ReactElement } from "react";

import { Composer } from "@/features/workbench/Composer";
import { EmptyStage } from "@/features/workbench/EmptyStage";
import { SessionStartInterstitial } from "@/features/workbench/SessionStartInterstitial";
import { ThreadStage } from "@/features/workbench/ThreadStage";
import type { WorkbenchProps } from "@/features/workbench/types";
import { useSessionTransition } from "@/features/workbench/useSessionTransition";
import { useWorkbench } from "@/features/workbench/useWorkbench";
import { useWorkbenchFixture } from "@/features/workbench/useWorkbenchFixture";
import { WorkbenchTexture } from "@/features/workbench/WorkbenchTexture";
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
  onComposerTextChange,
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

  const setComposerText = onComposerTextChange ?? fixture.setComposerText;
  const lastSubmittedTextRef = useRef<string>("");

  const handleSendCore = (): void | Promise<void> => {
    lastSubmittedTextRef.current = composerText;
    if (onSend !== undefined) {
      return onSend();
    }
    fixture.handleSend();
  };

  const sessionTransition = useSessionTransition({
    hasMessages: messages.length > 0,
    sendInFlight,
    onSend: handleSendCore,
  });

  const isThreadView = sessionTransition.transitionState === "thread";

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
      value={
        sessionTransition.isHoldingComposer
          ? (lastSubmittedTextRef.current || composerText)
          : composerText
      }
      disabled={prefetchFailed || sessionTransition.isHoldingComposer}
      sendInFlight={sendInFlight || sessionTransition.isHoldingComposer}
      handoffInFlight={handoffInFlight}
      handoffEnabled={handoffEnabled}
      handoffDisabledCaption={handoffDisabledCaption}
      showCampaignActions={false}
      appearance={isThreadView ? "thread" : "empty"}
      onChange={setComposerText}
      onSend={sessionTransition.handleSessionSend}
      onGoToCampaign={handleGoToCampaign}
      onStartCampaignFromConversation={handleStartCampaign}
    />
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-ground w-full">
      <WorkbenchTexture />
      {!isThreadView ? (
        <div className="relative z-10 flex h-full min-h-0 w-full flex-1 flex-col">
          <EmptyStage
            composer={composer}
            handoffInFlight={handoffInFlight}
            onPromptSelect={setComposerText}
          />
          {sessionTransition.showInterstitial ? (
            <SessionStartInterstitial isFadingOut={sessionTransition.isFadingOut} />
          ) : null}
        </div>
      ) : (
        <ThreadStage
          composer={composer}
          messages={messages}
          rules={rules}
          briefReadiness={briefReadiness}
          handoffEnabled={handoffEnabled}
          handoffInFlight={handoffInFlight}
          handoffDisabledCaption={handoffDisabledCaption}
          onStartCampaign={handleStartCampaign}
          onGoToCampaign={handleGoToCampaign}
        />
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
      onSend={() => hook.send()}
      onGoToCampaign={() => {
        void hook.goToCampaign();
      }}
      onStartCampaignFromConversation={() => {
        void hook.startCampaignFromConversation();
      }}
    />
  );
}
