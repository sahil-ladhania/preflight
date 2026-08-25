/**
 * preview-types — shared props for channel preview components.
 * Why: four fields only; no span layout.
 */

import type { BrandKitDTO, Channel } from "@preflight/schemas";

export interface ChannelPreviewContentProps {
  headline: string;
  body: string;
  disclaimer: string;
  cta: string;
  brandKit: BrandKitDTO;
  channel: Channel;
}
