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
      className="channel-preview-frame rounded-md border-2 p-4"
      style={styles.frame}
    >
      <div className="mb-3 flex items-center gap-2 border-b pb-3">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold"
          style={logoMarkStyle(brandKit)}
        >
          {clientInitials(brandKit.clientName)}
        </div>
        <div>
          <p className="text-sm font-semibold" style={styles.heading}>
            {brandKit.clientName}
          </p>
          <p className="text-xs" style={{ color: "var(--color-preview-ink-faint)" }}>
            marketing@{brandKit.clientName.toLowerCase().replace(/\s+/g, "")}.com
          </p>
        </div>
      </div>
      <h3 className="mb-3 text-lg font-semibold leading-snug" style={styles.heading}>
        {displayHeadline}
      </h3>
      <p className="mb-4 text-sm leading-relaxed" style={styles.body}>
        {body}
      </p>
      <p className="mb-4 border-t pt-3" style={styles.disclaimer}>
        {disclaimer}
      </p>
      <span
        className="inline-block rounded-md px-4 py-2 text-sm font-semibold shadow-sm"
        style={styles.cta}
      >
        {cta}
      </span>
    </div>
  );
}
