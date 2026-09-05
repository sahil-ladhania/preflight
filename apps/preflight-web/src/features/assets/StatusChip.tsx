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

const STATUS_CHROME_CLASS: Record<AssetStatus, string> = {
  blocked: "status-chrome-blocked",
  needs_human: "status-chrome-review",
  needs_regen: "status-chrome-regen",
  cleared_with_exception: "status-chrome-exception",
  clear: "status-chrome-clear",
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
  const isChrome = surface === "chrome";
  const label =
    surface === "register" ? LABELS[status].register : LABELS[status].detail;

  if (isChrome) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-none px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider leading-none",
          STATUS_CHROME_CLASS[status],
          className,
        )}
      >
        {label}
      </span>
    );
  }

  const isDetail = surface === "detail";

  return (
    <span
      className={cn(
        "status-marker shrink-0",
        STATUS_CLASS[status],
        isDetail && "text-xs font-mono tracking-wider pl-2 py-0.5 border-l-[3px]",
        status === "clear" ? "font-normal" : "font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}
