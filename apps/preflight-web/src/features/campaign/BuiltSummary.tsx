/**
 * BuiltSummary — S4 return-visit campaign summary with asset rows.
 * Why: only screen that answers whether the campaign set is ready to ship.
 */

import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import type { AssetListItemDTO, CompileResponseDTO, StructuredBriefInput } from "@preflight/schemas";

import { StatusChip } from "@/features/assets/StatusChip";
import {
  campaignProgressLine,
  formatBriefSummary,
} from "@/features/campaign/campaign-pane";
import { shortHash } from "@/features/campaign/lib";

export interface BuiltSummaryProps {
  brief: StructuredBriefInput;
  compileResult: CompileResponseDTO | null;
  assets: AssetListItemDTO[];
  onEditBrief: () => void;
  onViewFreeze: () => void;
}

function TertiaryLink({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      className="cursor-pointer text-caption text-fg-muted underline underline-offset-4"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function BuiltSummary({
  brief,
  compileResult,
  assets,
  onEditBrief,
  onViewFreeze,
}: BuiltSummaryProps): ReactElement {
  const navigate = useNavigate();
  const ruleCount = compileResult?.ruleIds.length ?? 0;
  const hash = compileResult?.rulesetHash ?? "";
  const progress = campaignProgressLine(assets);

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-label-strong text-fg-muted">Brief summary</h2>
          <TertiaryLink onClick={onEditBrief}>Edit brief</TertiaryLink>
        </div>
        <p className="font-serif text-copy text-fg">{formatBriefSummary(brief)}</p>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-label-strong text-fg-muted">
            Frozen rules ({ruleCount}) · {hash.length > 0 ? shortHash(hash) : "—"}
          </h2>
          <TertiaryLink onClick={onViewFreeze}>View</TertiaryLink>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-label-strong text-fg-muted">Assets in this campaign</h2>
        <div className="flex flex-col gap-2">
          {assets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              className="grid cursor-pointer grid-cols-[110px_minmax(0,1fr)_minmax(0,1.6fr)] items-start gap-3 border-b border-hairline py-2 text-left hover:bg-hover"
              onClick={() => {
                void navigate(`/assets/${asset.id}`);
              }}
            >
              <StatusChip status={asset.status} />
              <span className="font-serif text-serif-row text-fg">{asset.headline}</span>
              <span className="text-ui text-fg-muted">{asset.statusDetail}</span>
            </button>
          ))}
        </div>
        {progress.length > 0 ? (
          <p className="text-caption text-fg-muted">{progress}</p>
        ) : null}
      </section>
    </div>
  );
}
