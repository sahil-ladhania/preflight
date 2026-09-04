/**
 * StatusChip — five-state status marker.
 * Why: shared by list and detail header.
 */

import type { ReactElement } from "react";

import type { AssetStatus } from "@preflight/schemas";

import { Badge } from "@/components/ui/badge";
import type { StatusChipProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

interface MarkerConfig {
  badgeClass: string;
  registerLabel: string;
  detailLabel: string;
}

const MARKER_CONFIG: Record<AssetStatus, MarkerConfig> = {
  blocked: {
    badgeClass: "border-fail bg-fail-wash text-fail font-bold",
    registerLabel: "Blocked",
    detailLabel: "Blocked",
  },
  needs_human: {
    badgeClass: "border-attention bg-attention/15 text-attention font-bold",
    registerLabel: "Review",
    detailLabel: "Needs review",
  },
  needs_regen: {
    badgeClass: "border-decision bg-decision-wash text-decision font-semibold",
    registerLabel: "Regen",
    detailLabel: "Needs regen",
  },
  cleared_with_exception: {
    badgeClass: "border-decision/70 bg-surface text-decision font-medium",
    registerLabel: "Exception",
    detailLabel: "Exception",
  },
  clear: {
    badgeClass: "border-border/80 bg-ground text-fg-muted font-normal",
    registerLabel: "Clear",
    detailLabel: "Clear",
  },
};

export function StatusChip({
  status,
  surface = "register",
}: StatusChipProps): ReactElement {
  const config = MARKER_CONFIG[status];
  const label =
    surface === "detail" ? config.detailLabel : config.registerLabel;

  return (
    <Badge
      variant="outline"
      className={cn(
        "status-marker shrink-0 rounded-none border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider shadow-none",
        config.badgeClass,
      )}
    >
      {label}
    </Badge>
  );
}
