/**
 * StatusChip — five-state status marker.
 * Why: shared by list and detail header.
 */

import type { ReactElement } from "react";

import type { AssetStatus } from "@preflight/schemas";

import type { StatusChipProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

interface MarkerConfig {
  className: string;
  registerLabel: string;
  detailLabel: string;
}

const MARKER_CONFIG: Record<AssetStatus, MarkerConfig> = {
  blocked: {
    className: "status-blocked",
    registerLabel: "Blocked",
    detailLabel: "Blocked",
  },
  needs_human: {
    className: "status-review",
    registerLabel: "Review",
    detailLabel: "Needs review",
  },
  needs_regen: {
    className: "status-regen",
    registerLabel: "Regen",
    detailLabel: "Needs regen",
  },
  cleared_with_exception: {
    className: "status-exception",
    registerLabel: "Exception",
    detailLabel: "Exception",
  },
  clear: {
    className: "status-clear",
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
    <span className={cn("status-marker", config.className)}>{label}</span>
  );
}
