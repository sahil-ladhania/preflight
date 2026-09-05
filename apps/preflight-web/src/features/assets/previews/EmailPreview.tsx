/**
 * EmailPreview — newsletter-style channel frame.
 * Why: doc 19 §8.4 email layout shell.
 */

import type { ReactElement } from "react";

import type { ChannelPreviewContentProps } from "@/features/assets/previews/preview-types";
import {
  clientInitials,
  logoMarkStyle,
  previewFrameStyle,
  truncateText,
} from "@/features/assets/previews/preview-styles";

export function EmailPreview({
  headline,
  body,
  disclaimer,
  cta,
  brandKit,
}: ChannelPreviewContentProps): ReactElement {
  const styles = previewFrameStyle(brandKit);
  const hint = brandKit.channelHints.email;
  const displayHeadline = truncateText(headline, hint?.maxHeadlineChars);

  return (
    <div
      className="channel-preview-frame rounded-none border p-5 shadow-none"
      style={styles.frame}
    >
      <div className="mb-4 flex items-center gap-2.5 border-b border-hairline/60 pb-3.5">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-none text-xs font-bold"
          style={logoMarkStyle(brandKit)}
        >
          {clientInitials(brandKit.clientName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" style={styles.heading}>
            {brandKit.clientName}
          </p>
          <p className="font-mono text-[11px]" style={{ color: "var(--color-preview-ink-faint)" }}>
            marketing@{brandKit.clientName.toLowerCase().replace(/\s+/g, "")}.com
          </p>
        </div>
      </div>
      <h3 className="mb-3 font-serif text-base font-semibold leading-snug" style={styles.heading}>
        {displayHeadline}
      </h3>
      <p className="mb-4 text-sm leading-relaxed" style={styles.body}>
        {body}
      </p>
      <div className="mb-4 border-t border-hairline/60 pt-3">
        <p className="text-xs leading-normal" style={styles.disclaimer}>
          {disclaimer}
        </p>
      </div>
      <div>
        <span
          className="inline-block rounded-none px-4 py-2 text-xs font-semibold uppercase tracking-wider shadow-none"
          style={styles.cta}
        >
          {cta}
        </span>
      </div>
    </div>
  );
}
