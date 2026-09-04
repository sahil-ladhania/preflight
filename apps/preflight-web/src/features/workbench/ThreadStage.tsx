/**
 * ThreadStage — two-part workbench conversation stage.
 * Why: Left conversation thread with bottom-docked composer; right brief ledger rail.
 */

import type { ReactElement, ReactNode } from "react";
import type { RuleCatalogRowDTO } from "@preflight/schemas";

import { BriefReadiness } from "@/features/workbench/BriefReadiness";
import { Thread } from "@/features/workbench/Thread";
import type { WorkbenchMessage, WorkbenchProps } from "@/features/workbench/types";
import { WORKBENCH_HEADLINE } from "@/features/workbench/lib";

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
  return (
    <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl px-8 pt-8 pb-6 gap-8">
      {/* Left side: Conversation stream + bottom-docked composer */}
      <div className="flex-1 min-w-0 flex flex-col h-full">
        <div className="shrink-0 mb-4">
          <h1 className="font-serif text-page-title text-fg font-semibold tracking-tight">
            {WORKBENCH_HEADLINE}
          </h1>
        </div>

        {/* Scrollable message thread */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-3 pb-3 flex flex-col gap-6">
          <Thread
            messages={messages}
            rules={rules}
            showSearchFallback={false}
            searchQuery=""
            onSearchQueryChange={() => {}}
          />
        </div>

        {/* Fixed bottom composer */}
        <div className="shrink-0 pt-2">
          {composer}
        </div>
      </div>

      {/* Right side: Brief ledger rail */}
      <aside
        aria-label="Campaign Brief"
        className="w-[320px] shrink-0 border-l border-hairline pl-8 overflow-y-auto sticky top-0 self-start"
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
