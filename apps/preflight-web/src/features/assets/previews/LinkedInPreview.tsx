/**
 * LinkedInPreview — card-style social post frame.
 * Why: doc 19 §8.4 linkedin layout shell.
 */

import type { ReactElement } from "react";

import type { ChannelPreviewContentProps } from "@/features/assets/previews/preview-types";
import {
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
          className="size-8 rounded-full"
          style={{ backgroundColor: brandKit.colors.primary }}
        />
        <div>
          <p className="text-sm font-semibold" style={styles.heading}>
            {brandKit.clientName}
          </p>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Sponsored
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
      <p className="text-sm font-medium" style={{ color: brandKit.colors.secondary }}>
        {cta} →
      </p>
    </div>
  );
}
