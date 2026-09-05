/**
 * StatusChip — five-state status badge.
 * Why: single filled square badge treatment across register, detail, and campaign (08 §13 Amendment 22).
 */

import type { ReactElement } from "react";

import type { AssetStatus } from "@preflight/schemas";

import type { StatusChipProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

interface MarkerLabels {
  register: string;
  detail: string;
}

const STATUS_BADGE_CLASS: Record<AssetStatus, string> = {
  blocked: "status-badge-blocked",
  needs_human: "status-badge-review",
  needs_regen: "status-badge-regen",
  cleared_with_exception: "status-badge-exception",
  clear: "status-badge-clear",
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
  className,
}: StatusChipProps): ReactElement {
  const label =
    surface === "register" ? LABELS[status].register : LABELS[status].detail;

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center justify-center justify-self-start rounded-none px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider leading-none border-0",
        STATUS_BADGE_CLASS[status],
        className,
      )}
    >
      {label}
    </span>
  );
}
