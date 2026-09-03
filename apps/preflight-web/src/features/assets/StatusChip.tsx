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
  label: string;
}

const MARKER_CONFIG: Record<AssetStatus, MarkerConfig> = {
  blocked: {
    className: "status-blocked",
    label: "Blocked",
  },
  needs_human: {
    className: "status-review",
    label: "Review",
  },
  needs_regen: {
    className: "status-regen",
    label: "Regen",
  },
  cleared_with_exception: {
    className: "status-exception",
    label: "Exception",
  },
  clear: {
    className: "status-clear",
    label: "Clear",
  },
};

export function StatusChip({ status }: StatusChipProps): ReactElement {
  const config = MARKER_CONFIG[status];

  return (
    <span className={cn("status-marker", config.className)}>
      {config.label}
    </span>
  );
}
