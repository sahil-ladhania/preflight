/**
 * LinkedInPreview — card-style social post frame.
 * Why: doc 19 §8.4 linkedin layout shell.
 */

import type { ReactElement } from "react";

import type { ChannelPreviewContentProps } from "@/features/assets/previews/preview-types";
import {
  clientInitials,
  logoMarkStyle,
  previewFrameStyle,
  truncateText,
} from "@/features/assets/previews/preview-styles";

export function LinkedInPreview({
  headline,
  body,
  disclaimer,
  cta,
  brandKit,
}: ChannelPreviewContentProps): ReactElement {
  const styles = previewFrameStyle(brandKit);
  const hint = brandKit.channelHints.linkedin;
  const displayHeadline = truncateText(headline, hint?.maxHeadlineChars);

  return (
    <div
      className="channel-preview-frame rounded-none border p-5 shadow-none"
      style={styles.frame}
    >
      <div className="mb-3.5 flex items-center gap-2.5">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-none text-xs font-bold"
          style={logoMarkStyle(brandKit)}
        >
          {clientInitials(brandKit.clientName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" style={styles.heading}>
            {brandKit.clientName}
          </p>
          <p className="text-[11px]" style={{ color: "var(--color-preview-ink-faint)" }}>
            Sponsored · Financial services
          </p>
        </div>
      </div>
      <h3 className="mb-2.5 font-serif text-base font-semibold leading-snug" style={styles.heading}>
        {displayHeadline}
      </h3>
      <p className="mb-3.5 text-sm leading-relaxed" style={styles.body}>
        {body}
      </p>
      <div className="mb-3.5 border-t border-hairline/60 pt-2">
        <p className="text-xs leading-normal" style={styles.disclaimer}>
          {disclaimer}
        </p>
      </div>
      <div className="mb-3">
        <span
          className="inline-block rounded-none px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider"
          style={styles.cta}
        >
          {cta}
        </span>
      </div>
      <div
        className="flex gap-4 border-t border-hairline/60 pt-2.5 text-[11px] font-medium"
        style={{ color: "var(--color-preview-ink-faint)" }}
      >
        <span>Like</span>
        <span>Comment</span>
        <span>Repost</span>
        <span>Send</span>
      </div>
    </div>
  );
}
