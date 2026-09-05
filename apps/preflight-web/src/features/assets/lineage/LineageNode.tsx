/**
 * LineageNode — custom React Flow node card for lineage causal chain.
 * Why: paper-toned square card with causal human decision details (Pass 7).
 */

import type { ReactElement } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

import { StatusChip } from "@/features/assets/StatusChip";
import type { LineageChainNode } from "./lineage-types";

export type LineageNodeType = Node<
  LineageChainNode & {
    onSelect?: (assetId: string) => void;
  },
  "lineage"
>;

export function LineageNode({
  data,
}: NodeProps<LineageNodeType>): ReactElement {
  const {
    assetId,
    versionLabel,
    shortId,
    headline,
    status,
    generatedAt,
    isCurrent,
    causalDecision,
    onSelect,
  } = data;

  const handleClick = (): void => {
    onSelect?.(assetId);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className="relative flex w-[290px] cursor-pointer flex-col gap-4 rounded-none bg-surface p-5 text-fg shadow-none transition-none hover:outline hover:outline-1 hover:outline-fg/40"
      style={{ borderRadius: 0, boxShadow: "none" }}
    >
      {/* Navigational orientation: quiet label above card, external to compliance record */}
      {isCurrent ? (
        <div className="pointer-events-none absolute -top-5 left-0 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-chrome-fg-muted">
          <span className="inline-block size-1.5 bg-chrome-fg-muted" />
          You are here
        </div>
      ) : null}

      <Handle
        type="target"
        position={Position.Left}
        className="!size-2 !rounded-none !border-none !bg-fg"
        style={{ borderRadius: 0 }}
      />

      {/* GROUP 1: What this version IS */}
      <div className="flex flex-col gap-2">
        {/* Row 1: Version + shortId + Status Badge (exactly one badge in card) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-mono-meta font-bold text-fg">
              {versionLabel}
            </span>
            <span className="font-mono text-caption text-fg-muted">
              {shortId}
            </span>
          </div>
          <StatusChip status={status} surface="chrome" />
        </div>

        {/* Row 2: Headline */}
        <p
          className="line-clamp-2 font-serif text-sm font-semibold leading-snug text-fg"
          title={headline}
        >
          {headline}
        </p>

        {/* Row 3: Generated timestamp */}
        <span className="font-mono text-[11px] text-fg-muted">
          Generated {generatedAt}
        </span>
      </div>

      {/* GROUP 2: What ENDED it (separated by clear spacing and hairline divider) */}
      {causalDecision ? (
        <div className="flex flex-col gap-1.5 border-t border-hairline/60 pt-3">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-fg-muted">
            Triggered Next Regen
          </span>
          <p className="font-mono text-xs font-semibold leading-snug text-decision">
            {causalDecision.ruleId} {causalDecision.verdict}
          </p>
          <div className="flex items-center justify-between font-mono text-[11px] text-fg-muted">
            <span>{causalDecision.actor?.trim() || "Unrecorded actor"}</span>
            <span>{causalDecision.timestamp}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 border-t border-hairline/60 pt-3">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-fg-muted">
            Terminal Generation
          </span>
          <p className="font-mono text-xs text-fg-muted">
            No further regen
          </p>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!size-2 !rounded-none !border-none !bg-fg"
        style={{ borderRadius: 0 }}
      />
    </div>
  );
}
