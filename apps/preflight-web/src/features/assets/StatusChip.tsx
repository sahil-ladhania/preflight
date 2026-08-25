/**
 * StatusChip — five-state status chip.
 * Why: shared by list and detail header.
 */

import type { ReactElement } from "react";
import { Ban, Check, Diamond, MessageSquare, RefreshCw } from "lucide-react";

import type { AssetStatus } from "@preflight/schemas";

import type { StatusChipProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

interface ChipConfig {
  className: string;
  icon: ReactElement;
  label: string;
}

const CHIP_CONFIG: Record<AssetStatus, ChipConfig> = {
  blocked: {
    className: "chip-blocked",
    icon: <Ban className="size-3 shrink-0" aria-hidden />,
    label: "Blocked",
  },
  needs_human: {
    className: "chip-needs-human",
    icon: <MessageSquare className="size-3 shrink-0" aria-hidden />,
    label: "Needs review",
  },
  needs_regen: {
    className: "chip-needs-regen",
    icon: <RefreshCw className="size-3 shrink-0" aria-hidden />,
    label: "Needs regen",
  },
  cleared_with_exception: {
    className: "chip-exception",
    icon: <Diamond className="size-3 shrink-0" aria-hidden />,
    label: "Exception",
  },
  clear: {
    className: "chip-clear",
    icon: <Check className="size-3 shrink-0" aria-hidden />,
    label: "Clear",
  },
};

export function StatusChip({ status }: StatusChipProps): ReactElement {
  const config = CHIP_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded-full border border-solid px-2 text-chip",
        config.className,
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
