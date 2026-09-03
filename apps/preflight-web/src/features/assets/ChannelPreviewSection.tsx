/**
 * ChannelPreviewSection — R3c collapsible preview containment.
 * Why: brand colours stay inside a hairline box; evidence copy stays below (08 §3.6).
 */

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, type ReactElement } from "react";

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
    <div className="border border-hairline">
      <button
        type="button"
        className="flex w-full items-center gap-2 border-b border-hairline bg-ground px-4 py-2 text-left hover:bg-hover"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="size-2.5 shrink-0 text-fg-muted" aria-hidden />
        ) : (
          <ChevronRight className="size-2.5 shrink-0 text-fg-muted" aria-hidden />
        )}
        <span className="text-label-strong uppercase text-fg-muted">
          Channel preview
        </span>
      </button>
      {open ? (
        <div className="max-h-[360px] overflow-y-auto bg-preview-stage p-6 hover:bg-hover">
          <div className="mx-auto max-w-[340px] bg-preview-card p-4">
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
