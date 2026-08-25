/**
 * DisplayPreview — banner-style display ad frame.
 * Why: doc 19 §8.4 display layout shell.
 */

import type { ReactElement } from "react";

import type { ChannelPreviewContentProps } from "@/features/assets/previews/preview-types";
import {
  previewFrameStyle,
  truncateText,
} from "@/features/assets/previews/preview-styles";

export function DisplayPreview({
  headline,
  body,
  disclaimer,
  cta,
  brandKit,
}: ChannelPreviewContentProps): ReactElement {
  const styles = previewFrameStyle(brandKit);
  const hint = brandKit.channelHints.display;
  const displayHeadline = truncateText(headline, hint?.maxHeadlineChars);

  return (
    <div
      className="channel-preview-frame overflow-hidden rounded-md border-2"
      style={styles.frame}
    >
      <div className="px-4 py-3">
        <p className="mb-1 text-caption" style={{ color: brandKit.colors.secondary }}>
          {brandKit.clientName}
        </p>
        <h3 className="text-base font-bold leading-tight" style={styles.heading}>
          {displayHeadline}
        </h3>
        <p className="mt-1 text-sm" style={styles.body}>
          {body}
        </p>
        <span
          className="mt-3 inline-block rounded px-3 py-1 text-xs font-semibold"
          style={styles.cta}
        >
          {cta}
        </span>
      </div>
      <p className="px-4 py-1 text-[10px] leading-snug" style={styles.disclaimer}>
        {disclaimer}
      </p>
    </div>
  );
}
