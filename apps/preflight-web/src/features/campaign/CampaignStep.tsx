/**
 * CampaignStep — gated step section with dimming.
 * Why: S2/S3 dim until brief saved / compile done.
 */

import type { ReactElement } from "react";

import type { CampaignStepProps } from "@/features/campaign/types";
import { cn } from "@/lib/utils";

export function CampaignStep({
  title,
  subtitle,
  dimmed = false,
  children,
}: CampaignStepProps): ReactElement {
  return (
    <section
      className={cn(
        "flex flex-col gap-6",
        dimmed && "pointer-events-none opacity-40",
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-title text-fg">{title}</h2>
        {subtitle !== undefined ? (
          <p className="text-caption text-fg-muted">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
