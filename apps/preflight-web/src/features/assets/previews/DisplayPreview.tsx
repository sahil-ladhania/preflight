/**
 * DisplayPreview — banner-style display ad frame.
 * Why: doc 19 §8.4 display layout shell.
 */

import type { ReactElement } from "react";

import type { ChannelPreviewContentProps } from "@/features/assets/previews/preview-types";
import {
  clientInitials,
  logoMarkStyle,
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
      className="channel-preview-frame overflow-hidden rounded-none border shadow-none"
      style={styles.frame}
    >
      <div
        className="flex aspect-[728/90] items-center justify-center px-4"
        style={{ backgroundColor: `${brandKit.colors.primary}18` }}
      >
        <div
          className="mr-3 flex size-10 shrink-0 items-center justify-center rounded-none text-sm font-bold"
          style={logoMarkStyle(brandKit)}
        >
          {clientInitials(brandKit.clientName)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-serif text-sm font-bold leading-tight" style={styles.heading}>
            {displayHeadline}
          </h3>
          <p className="truncate text-xs" style={styles.body}>
            {body}
          </p>
        </div>
        <span
          className="ml-3 shrink-0 rounded-none px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
          style={styles.cta}
        >
          {cta}
        </span>
      </div>
      <div className="border-t border-hairline/60 px-4 py-3">
        <p className="mb-1 font-mono text-[11px] font-medium" style={{ color: brandKit.colors.secondary }}>
          {brandKit.clientName}
        </p>
        <p className="text-[11px] leading-snug" style={styles.disclaimer}>
          {disclaimer}
        </p>
      </div>
    </div>
  );
}
