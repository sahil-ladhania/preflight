/**
 * BriefReadiness — Campaign Brief ledger rail.
 * Why: small ledger listing what is captured and what is missing; handoff actions.
 */

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import type { BriefField, StructuredBriefInput } from "@preflight/schemas";
import { CampaignHandoffLink } from "@/features/workbench/CampaignHandoffLink";

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

const REQUIRED_FIELDS = [
  { key: "objective", label: "OBJECTIVE" },
  { key: "schemeName", label: "SCHEME NAME" },
  { key: "schemeCategory", label: "SCHEME CATEGORY" },
  { key: "audience", label: "AUDIENCE" },
  { key: "market", label: "MARKET" },
  { key: "channels", label: "CHANNELS" },
] as const;

const OPTIONAL_FIELDS = [
  { key: "performanceFigures", label: "PERFORMANCE FIGURES" },
  { key: "claims", label: "CLAIMS" },
] as const;

function formatFieldValue(
  key: string,
  captured?: Partial<StructuredBriefInput>,
): string | null {
  if (!captured) return null;
  const val = captured[key as keyof StructuredBriefInput];
  if (val === undefined || val === null) return null;
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return null;
    if (key === "performanceFigures") {
      return (val as Array<{ value: string; period: string }>)
        .map((item) => `${item.value} (${item.period})`)
        .join(", ");
    }
    return (val as string[]).join(", ");
  }
  return null;
}

function FieldRow({
  label,
  value,
  ariaSuffix = "",
}: {
  label: string;
  value: string | null;
  ariaSuffix?: string;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label text-fg-muted uppercase tracking-wider text-[11px]">
        {label}
      </span>
      {value !== null ? (
        <p className="font-serif text-[14px] leading-[20px] text-fg">{value}</p>
      ) : (
        <div
          className="h-7 w-full border border-dashed border-hairline bg-transparent"
          aria-label={`${label} ${ariaSuffix}`.trim()}
        />
      )}
    </div>
  );
}

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
    <div className="border-t-2 border-decision pt-4 flex flex-col gap-5 text-left">
      {/* Label and Count */}
      <div className="flex flex-col gap-1">
        <span className="text-label-strong uppercase text-fg-muted tracking-wider text-[11px]">
          Campaign Brief
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-sans text-[20px] font-semibold text-fg tracking-tight">
            {capturedCount}
          </span>
          <span className="font-sans text-caption text-fg-muted">
            of 6 required captured
          </span>
        </div>
      </div>

      {/* 6 Required Fields */}
      <div className="flex flex-col gap-3.5">
        {REQUIRED_FIELDS.map(({ key, label }) => (
          <FieldRow
            key={key}
            label={label}
            value={formatFieldValue(key, captured)}
            ariaSuffix="not yet captured"
          />
        ))}
      </div>

      {/* 2 Optional Fields */}
      <div className="border-t border-hairline pt-3 flex flex-col gap-3.5">
        <span className="text-caption text-fg-muted text-[11px] italic">
          Optional — &quot;none&quot; is a valid answer for both.
        </span>
        {OPTIONAL_FIELDS.map(({ key, label }) => (
          <FieldRow
            key={key}
            label={label}
            value={formatFieldValue(key, captured)}
            ariaSuffix="optional"
          />
        ))}
      </div>

      {/* Actions */}
      <div className="border-t border-hairline pt-3 flex flex-col gap-3">
        {showHandoff ? (
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              disabled={!canStart || handoffInFlight}
              onClick={onStartCampaignFromConversation}
              className="cursor-pointer font-sans text-ui-strong font-semibold text-decision hover:underline disabled:pointer-events-none disabled:opacity-40 text-left"
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
            {!canStart && handoffDisabledCaption !== null ? (
              <span className="font-sans text-[12px] leading-snug text-fg-muted">
                {handoffDisabledCaption}
              </span>
            ) : null}
          </div>
        ) : null}

        {showLink ? (
          <div>
            <CampaignHandoffLink
              onClick={onGoToCampaign}
              disabled={handoffInFlight}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
