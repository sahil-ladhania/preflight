/**
 * ChannelPreviewSection — R3c collapsible preview containment.
 * Why: brand colours stay inside a hairline box; evidence copy stays below (08 §3.6).
 */

import { ChevronDown, ChevronRight, Eye } from "lucide-react";
import { useState, type ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { ChannelPreview } from "@/features/assets/previews/ChannelPreview";
import type { ChannelPreviewSectionProps } from "@/features/assets/types";

export function ChannelPreviewSection({
  channel,
  headline,
  body,
  disclaimer,
  cta,
  brandKit,
}: ChannelPreviewSectionProps): ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="border border-border bg-surface shadow-none">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between bg-ground/50 px-4 py-2.5 text-left transition-colors hover:bg-hover"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
          ) : (
            <ChevronRight className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
          )}
          <Eye className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-fg">
            Channel preview
          </span>
        </div>
        <Badge
          variant="outline"
          className="rounded-none border-primary/30 bg-primary-wash px-1.5 py-0 font-mono text-[10px] font-medium uppercase text-primary"
        >
          {channel}
        </Badge>
      </button>
      {open ? (
        <div className="max-h-[360px] overflow-y-auto border-t border-border bg-preview-stage p-6">
          <div className="mx-auto max-w-[340px] bg-preview-card p-4 shadow-sm">
            <ChannelPreview
              channel={channel}
              headline={headline}
              body={body}
              disclaimer={disclaimer}
              cta={cta}
              brandKit={brandKit}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
