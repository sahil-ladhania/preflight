/**
 * ShortformPreview — whatsapp and landing compact layouts.
 * Why: doc 19 §8.4 shortform channels share one component.
 */

import type { ReactElement } from "react";

import type { ChannelPreviewContentProps } from "@/features/assets/previews/preview-types";
import {
  clientInitials,
  logoMarkStyle,
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
      className="channel-preview-frame rounded-none border p-5 shadow-none"
      style={styles.frame}
    >
      {isLanding ? (
        <div className="mb-3 flex items-center gap-2.5">
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-none text-[10px] font-bold"
            style={logoMarkStyle(brandKit)}
          >
            {clientInitials(brandKit.clientName)}
          </div>
          <p
            className="font-mono text-xs font-semibold uppercase tracking-wider"
            style={{ color: brandKit.colors.secondary }}
          >
            {brandKit.clientName}
          </p>
        </div>
      ) : (
        <div className="mb-2.5 flex items-center justify-between border-b border-hairline/60 pb-2">
          <span className="font-mono text-[11px] font-medium" style={{ color: brandKit.colors.secondary }}>
            {brandKit.clientName}
          </span>
          <span className="font-mono text-[10px]" style={{ color: "var(--color-preview-ink-faint)" }}>
            WhatsApp Broadcast
          </span>
        </div>
      )}
      <h3
        className={isLanding ? "mb-2.5 font-serif text-lg font-bold leading-snug" : "mb-2 font-serif text-sm font-semibold"}
        style={styles.heading}
      >
        {displayHeadline}
      </h3>
      <p className="mb-3.5 text-sm leading-relaxed" style={styles.body}>
        {body}
      </p>
      <div className="mb-3.5 border-t border-hairline/60 pt-2.5">
        <p className="text-xs leading-normal" style={styles.disclaimer}>
          {disclaimer}
        </p>
      </div>
      <div>
        <span
          className="inline-block rounded-none px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider shadow-none"
          style={styles.cta}
        >
          {cta}
        </span>
      </div>
    </div>
  );
}
