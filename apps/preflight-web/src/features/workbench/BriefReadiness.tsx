import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import type { BriefField } from "@preflight/schemas";

import { CampaignHandoffLink } from "@/features/workbench/CampaignHandoffLink";

export interface BriefReadinessProps {
  capturedCount: number;
  missing: BriefField[];
  complete: boolean;
  handoffEnabled?: boolean;
  handoffInFlight?: boolean;
  handoffDisabledCaption?: string | null;
  onStartCampaignFromConversation?: () => void;
  onGoToCampaign?: () => void;
}

export function BriefReadiness({
  capturedCount,
  missing: _missing,
  complete,
  handoffEnabled = false,
  handoffInFlight = false,
  handoffDisabledCaption = null,
  onStartCampaignFromConversation,
  onGoToCampaign,
}: BriefReadinessProps): ReactElement | null {
  const showHandoff = onStartCampaignFromConversation !== undefined;
  const showLink = onGoToCampaign !== undefined;

  const capturedLabel =
    capturedCount === 1 ? "1 field captured" : `${capturedCount} fields captured`;

  return (
    <div className="border border-hairline p-4 flex flex-col gap-3 bg-transparent">
      <div>
        {complete ? (
          <p className="text-caption text-fg-muted">
            Brief complete — all required details captured.
          </p>
        ) : capturedCount > 0 ? (
          <p className="text-caption text-fg-muted">
            {capturedLabel}
          </p>
        ) : (
          <p className="text-caption text-fg-muted">
            Preflight will capture your brief as you chat.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showHandoff ? (
          <button
            type="button"
            disabled={!handoffEnabled || handoffInFlight}
            onClick={onStartCampaignFromConversation}
            className="cursor-pointer font-sans text-ui-strong font-semibold text-decision hover:underline disabled:pointer-events-none disabled:opacity-50"
          >
            {handoffInFlight ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                Starting…
              </span>
            ) : (
              "Start campaign from this conversation →"
            )}
          </button>
        ) : null}

        {showHandoff && !handoffEnabled && handoffDisabledCaption !== null ? (
          <span className="text-caption text-fg-muted">
            {handoffDisabledCaption}
          </span>
        ) : null}
      </div>

      {showLink ? (
        <div className="pt-0.5">
          <CampaignHandoffLink
            onClick={onGoToCampaign}
            disabled={handoffInFlight}
          />
        </div>
      ) : null}
    </div>
  );
}
