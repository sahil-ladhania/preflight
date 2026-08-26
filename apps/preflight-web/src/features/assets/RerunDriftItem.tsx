/**
 * RerunDriftItem — one rulebook drift row in the rerun strip.
 * Why: extracted from RerunStrip to stay under file size limit.
 */

import type { ReactElement } from "react";

import type { DriftItemDTO } from "@preflight/schemas";

import {
  driftChangeLabel,
  driftKindLabel,
  formatRuleIdDisplay,
  isCatalogRuleId,
} from "@/features/assets/rerun-lib";

export function DriftColumnHeaders(): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-2 px-1">
      <p className="text-caption font-medium text-fg-muted">At freeze</p>
      <p className="text-caption font-medium text-fg-muted">Live catalog now</p>
    </div>
  );
}

export function RerunDriftItem({ item }: { item: DriftItemDTO }): ReactElement {
  const ruleLabel = formatRuleIdDisplay(item.ruleId);
  const showJdgBadge = !isCatalogRuleId(item.ruleId);

  if (item.kind === "definition_changed") {
    return (
      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-mono text-fg">{ruleLabel}</p>
          {showJdgBadge ? (
            <span className="rounded-md border border-border px-1.5 py-0 text-kind text-fg-muted">
              jdg
            </span>
          ) : null}
          <span className="rounded-md border border-border px-2 py-0.5 text-caption text-fg-muted">
            {driftKindLabel(item.kind)}
          </span>
          {item.changes.map((change) => (
            <span
              key={change}
              className="rounded-md border border-border px-2 py-0.5 text-caption text-fg-muted"
            >
              {driftChangeLabel(change)}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border bg-canvas p-3 text-body text-fg">
            {item.frozenWording}
          </div>
          <div className="rounded-md border border-border bg-canvas p-3 text-body text-fg">
            {item.liveWording}
          </div>
        </div>
      </div>
    );
  }

  if (item.kind === "rules_added_outside_freeze") {
    return (
      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-mono text-fg">{ruleLabel}</p>
          {showJdgBadge ? (
            <span className="rounded-md border border-border px-1.5 py-0 text-kind text-fg-muted">
              jdg
            </span>
          ) : null}
          <span className="rounded-md border border-border px-2 py-0.5 text-caption text-fg-muted">
            {driftKindLabel(item.kind)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <p className="text-caption text-fg-muted">
            This asset was not checked against this rule at generate time.
          </p>
          <div className="rounded-md border border-border bg-canvas p-3 text-body text-fg">
            {item.liveWording}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-mono text-fg">{ruleLabel}</p>
        <span className="rounded-md border border-border px-2 py-0.5 text-caption text-fg-muted">
          {driftKindLabel(item.kind)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-border bg-canvas p-3 text-body text-fg">
          {item.frozenWording}
        </div>
        <p className="text-caption text-fg-muted">No longer in live catalog.</p>
      </div>
    </div>
  );
}
