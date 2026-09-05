/**
 * BriefReadiness — Campaign Brief ledger rail.
 * Why: small ledger listing what is captured and what is missing; handoff actions.
 */

import type { ReactElement } from "react";
import { ClipboardList } from "lucide-react";

import { PrimaryButton } from "@/components/ui/primary-button";
import type { BriefField, StructuredBriefInput } from "@preflight/schemas";
import { BriefFieldRow } from "@/features/workbench/BriefFieldRow";
import {
  formatBriefFieldValue,
  OPTIONAL_BRIEF_FIELDS,
  REQUIRED_BRIEF_FIELDS,
} from "@/features/workbench/brief-readiness-lib";
import { CampaignHandoffLink } from "@/features/workbench/CampaignHandoffLink";
import {
  WORKBENCH_GO_CAMPAIGN_NOTE,
  WORKBENCH_START_CAMPAIGN_NOTE,
} from "@/features/workbench/lib";

export interface BriefReadinessProps {
  capturedCount: number;
  missing?: BriefField[];
  complete: boolean;
  captured?: Partial<StructuredBriefInput>;
  handoffEnabled?: boolean;
  handoffInFlight?: boolean;
  handoffDisabledCaption?: string | null;
  onStartCampaignFromConversation?: () => void;
  onGoToCampaign?: () => void;
}

const HANDOFF_LABEL = "Start campaign";

export function BriefReadiness({
  capturedCount,
  complete,
  captured,
  handoffEnabled = false,
  handoffInFlight = false,
  handoffDisabledCaption = null,
  onStartCampaignFromConversation,
  onGoToCampaign,
}: BriefReadinessProps): ReactElement {
  const showHandoff = onStartCampaignFromConversation !== undefined;
  const showLink = onGoToCampaign !== undefined;
  const canStart = complete && handoffEnabled;

  return (
    <div className="flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 text-label-strong uppercase tracking-wider text-fg-muted">
          <ClipboardList className="size-3.5 shrink-0" aria-hidden />
          Campaign Brief
        </span>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="font-serif text-wordmark font-semibold tracking-tight text-fg">
            {capturedCount}
          </span>
          <span className="font-sans text-caption text-fg-muted">
            of 6 required captured
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {REQUIRED_BRIEF_FIELDS.map(({ key, label }) => (
          <BriefFieldRow
            key={key}
            fieldKey={key}
            label={label}
            value={formatBriefFieldValue(key, captured)}
            ariaSuffix="not yet captured"
          />
        ))}
      </div>

      <div className="flex flex-col gap-3.5 border-t border-hairline pt-3">
        <span className="text-caption text-fg-muted">
          Optional — &quot;none&quot; is a valid answer for both.
        </span>
        {OPTIONAL_BRIEF_FIELDS.map(({ key, label }) => (
          <BriefFieldRow
            key={key}
            fieldKey={key}
            label={label}
            value={formatBriefFieldValue(key, captured)}
            optional
            requiredComplete={complete}
            ariaSuffix="optional"
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-hairline pt-3">
        {showHandoff ? (
          <div className="flex flex-col gap-1.5">
            {canStart ? (
              <PrimaryButton
                loading={handoffInFlight}
                disabled={handoffInFlight}
                icon={<ClipboardList className="size-4 shrink-0" aria-hidden />}
                aria-label="Start campaign from this conversation"
                onClick={onStartCampaignFromConversation}
                className="w-full justify-center"
              >
                {HANDOFF_LABEL}
              </PrimaryButton>
            ) : (
              <button
                type="button"
                disabled
                aria-label="Start campaign from this conversation"
                className="flex h-9 w-full cursor-not-allowed items-center justify-center gap-2 rounded-none border border-hairline bg-transparent px-4 font-sans text-button font-medium text-fg-faint"
              >
                <ClipboardList className="size-4 shrink-0 opacity-50" aria-hidden />
                {HANDOFF_LABEL}
              </button>
            )}
            {!canStart && handoffDisabledCaption !== null ? (
              <span className="font-sans text-caption leading-snug text-fg-muted">
                {handoffDisabledCaption}
              </span>
            ) : null}
            {canStart ? (
              <p className="font-sans text-caption leading-snug text-fg-muted">
                {WORKBENCH_START_CAMPAIGN_NOTE}
              </p>
            ) : null}
          </div>
        ) : null}

        {showLink ? (
          <div className="flex flex-col gap-1">
            <CampaignHandoffLink
              onClick={onGoToCampaign}
              disabled={handoffInFlight}
            />
            <p className="font-sans text-caption leading-snug text-fg-muted">
              {WORKBENCH_GO_CAMPAIGN_NOTE}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
