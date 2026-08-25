/**
 * ShortformPreview — whatsapp and landing compact layouts.
 * Why: doc 19 §8.4 shortform channels share one component.
 */

import type { ReactElement } from "react";

import type { ChannelPreviewContentProps } from "@/features/assets/previews/preview-types";
import {
  previewFrameStyle,
  truncateText,
} from "@/features/assets/previews/preview-styles";

export function ShortformPreview({
  headline,
  body,
  disclaimer,
  cta,
  brandKit,
  channel,
}: ChannelPreviewContentProps): ReactElement {
  const styles = previewFrameStyle(brandKit);
  const hint = brandKit.channelHints[channel];
  const displayHeadline = truncateText(headline, hint?.maxHeadlineChars);
  const isLanding = channel === "landing";

  return (
    <div
      className="channel-preview-frame rounded-md border-2 p-4"
      style={styles.frame}
    >
      {isLanding ? (
        <p
          className="mb-2 text-xs font-medium uppercase tracking-wide"
          style={{ color: brandKit.colors.secondary }}
        >
          {brandKit.clientName}
        </p>
      ) : null}
      <h3
        className={isLanding ? "mb-2 text-xl font-bold" : "mb-2 text-sm font-semibold"}
        style={styles.heading}
      >
        {displayHeadline}
      </h3>
      <p className="mb-3 text-sm leading-snug" style={styles.body}>
        {body}
      </p>
      <p className="mb-2 text-xs" style={styles.disclaimer}>
        {disclaimer}
      </p>
      <span
        className="inline-block rounded-md px-3 py-1.5 text-xs font-medium"
        style={styles.cta}
      >
        {cta}
      </span>
    </div>
  );
}
