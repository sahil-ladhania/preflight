/**
 * preview-styles — kit chromatic tokens inside preview frame only.
 * Why: doc 19 §8.5 design system exception for channel previews.
 */

import type { BrandKitDTO } from "@preflight/schemas";

import type { CSSProperties } from "react";

export interface PreviewFrameStyle {
  frame: CSSProperties;
  heading: CSSProperties;
  body: CSSProperties;
  disclaimer: CSSProperties;
  cta: CSSProperties;
}

export function previewFrameStyle(brandKit: BrandKitDTO): PreviewFrameStyle {
  return {
    frame: {
      backgroundColor: brandKit.colors.background,
      borderColor: brandKit.colors.primary,
    },
    heading: {
      fontFamily: brandKit.typography.headingRole,
      color: brandKit.colors.primary,
    },
    body: {
      fontFamily: brandKit.typography.bodyRole,
      color: "#1a1a1a",
    },
    disclaimer: {
      fontFamily: brandKit.typography.bodyRole,
      color: "#4a5568",
      fontSize: "0.75rem",
    },
    cta: {
      fontFamily: brandKit.typography.bodyRole,
      backgroundColor: brandKit.colors.secondary,
      color: "#ffffff",
    },
  };
}

export function truncateText(text: string, maxChars: number | undefined): string {
  if (maxChars === undefined || text.length <= maxChars) {
    return text;
  }
  return `${text.slice(0, maxChars - 1).trimEnd()}…`;
}
