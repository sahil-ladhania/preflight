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
      className="channel-preview-frame rounded-md border-2 p-4"
      style={styles.frame}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={logoMarkStyle(brandKit)}
        >
          {clientInitials(brandKit.clientName)}
        </div>
        <div>
          <p className="text-sm font-semibold" style={styles.heading}>
            {brandKit.clientName}
          </p>
          <p className="text-xs" style={{ color: "var(--color-preview-ink-faint)" }}>
            Sponsored · Financial services
          </p>
        </div>
      </div>
      <h3 className="mb-2 text-base font-semibold" style={styles.heading}>
        {displayHeadline}
      </h3>
      <p className="mb-3 text-sm leading-relaxed" style={styles.body}>
        {body}
      </p>
      <p className="mb-2 text-xs" style={styles.disclaimer}>
        {disclaimer}
      </p>
      <span
        className="inline-block rounded-md px-3 py-1.5 text-sm font-semibold"
        style={styles.cta}
      >
        {cta}
      </span>
      <div
        className="mt-3 flex gap-4 border-t pt-2 text-xs"
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
