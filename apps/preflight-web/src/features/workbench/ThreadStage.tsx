/**
 * ThreadStage — two-part workbench conversation stage.
 * Why: Left conversation thread with bottom-docked composer; right brief ledger rail.
 */

import { useCallback, type ReactElement, type ReactNode } from "react";
import type { RuleCatalogRowDTO } from "@preflight/schemas";

import { BriefReadiness } from "@/features/workbench/BriefReadiness";
import { Thread } from "@/features/workbench/Thread";
import type { WorkbenchMessage, WorkbenchProps } from "@/features/workbench/types";
import { useThreadScrollFade } from "@/features/workbench/useThreadScrollFade";
import { cn } from "@/lib/utils";

export interface ThreadStageProps {
  composer: ReactNode;
  messages: WorkbenchMessage[];
  rules: RuleCatalogRowDTO[];
  briefReadiness?: WorkbenchProps["briefReadiness"];
  handoffEnabled?: boolean;
  handoffInFlight?: boolean;
  handoffDisabledCaption?: string | null;
  onStartCampaign?: () => void;
  onGoToCampaign?: () => void;
}

export function ThreadStage({
  composer,
  messages,
  rules,
  briefReadiness,
  handoffEnabled = false,
  handoffInFlight = false,
  handoffDisabledCaption = null,
  onStartCampaign,
  onGoToCampaign,
}: ThreadStageProps): ReactElement {
  const { scrollRef, showTopFade, onScroll } = useThreadScrollFade(messages.length);

  const scrollToEnd = useCallback((): void => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, [scrollRef]);

  return (
    <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-7xl gap-8 px-8 pb-6 pt-6">
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <div className="relative min-h-0 flex-1">
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 z-10 h-2 transition-opacity duration-150",
              showTopFade ? "opacity-100 shadow-thread-scroll" : "opacity-0",
            )}
            aria-hidden
          />
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex h-full min-h-0 flex-col overflow-y-auto pr-3"
          >
            <div className="mt-auto pb-3">
              <Thread
                messages={messages}
                rules={rules}
                showSearchFallback={false}
                searchQuery=""
                onSearchQueryChange={() => {}}
                onScrollToEnd={scrollToEnd}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 bg-ground pt-2">
          {composer}
        </div>
      </div>

      <aside
        aria-label="Campaign Brief"
        className="sticky top-0 w-[320px] shrink-0 self-start overflow-y-auto border-l border-hairline pl-8"
      >
        <BriefReadiness
          capturedCount={briefReadiness?.capturedCount ?? 0}
          missing={briefReadiness?.missing ?? []}
          complete={briefReadiness?.complete ?? false}
          captured={briefReadiness?.captured}
          handoffEnabled={handoffEnabled}
          handoffInFlight={handoffInFlight}
          handoffDisabledCaption={handoffDisabledCaption}
          onStartCampaignFromConversation={onStartCampaign}
          onGoToCampaign={onGoToCampaign}
        />
      </aside>
    </div>
  );
}
