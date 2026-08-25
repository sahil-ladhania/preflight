/**
 * EmailPreview — newsletter-style channel frame.
 * Why: doc 19 §8.4 email layout shell.
 */

import type { ReactElement } from "react";

import type { ChannelPreviewContentProps } from "@/features/assets/previews/preview-types";
import {
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
      <p className="mb-1 text-caption" style={{ color: brandKit.colors.secondary }}>
        {brandKit.clientName}
      </p>
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
        className="inline-block rounded-md px-4 py-2 text-sm font-medium"
        style={styles.cta}
      >
        {cta}
      </span>
    </div>
  );
}
