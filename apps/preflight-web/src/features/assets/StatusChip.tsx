/**
 * StatusChip — five-state status marker.
 * Why: shared by list and detail header.
 */

import type { ReactElement } from "react";

import type { AssetStatus } from "@preflight/schemas";

import type { StatusChipProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

interface MarkerLabels {
  register: string;
  detail: string;
}

const STATUS_CLASS: Record<AssetStatus, string> = {
  blocked: "status-blocked",
  needs_human: "status-review",
  needs_regen: "status-regen",
  cleared_with_exception: "status-exception",
  clear: "status-clear",
};

const LABELS: Record<AssetStatus, MarkerLabels> = {
  blocked: { register: "Blocked", detail: "Blocked" },
  needs_human: { register: "Review", detail: "Needs review" },
  needs_regen: { register: "Regen", detail: "Needs regen" },
  cleared_with_exception: { register: "Exception", detail: "Exception" },
  clear: { register: "Clear", detail: "Clear" },
};

export function StatusChip({
  status,
  surface = "register",
}: StatusChipProps): ReactElement {
  const label =
    surface === "detail" ? LABELS[status].detail : LABELS[status].register;

  return (
    <span className={cn("status-marker shrink-0", STATUS_CLASS[status])}>
      {label}
    </span>
  );
}
