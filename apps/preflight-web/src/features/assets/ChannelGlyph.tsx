/**
 * ChannelGlyph — monochrome icon for asset channel.
 * Why: recognition support in 08 §5.18 icon language without third-party marks.
 */

import type { ReactElement } from "react";
import {
  Globe,
  Mail,
  MessageCircle,
  Monitor,
  Share2,
} from "lucide-react";

import type { Channel } from "@preflight/schemas";
import { cn } from "@/lib/utils";

export interface ChannelGlyphProps {
  channel: Channel;
  className?: string;
}

export function ChannelGlyph({
  channel,
  className,
}: ChannelGlyphProps): ReactElement {
  const commonClasses = cn(
    "size-3.5 shrink-0 text-fg-muted",
    className,
  );

  switch (channel) {
    case "email":
      return <Mail className={commonClasses} aria-hidden="true" />;
    case "linkedin":
      return <Share2 className={commonClasses} aria-hidden="true" />;
    case "whatsapp":
      return <MessageCircle className={commonClasses} aria-hidden="true" />;
    case "display":
      return <Monitor className={commonClasses} aria-hidden="true" />;
    case "landing":
      return <Globe className={commonClasses} aria-hidden="true" />;
    default: {
      const _exhaustive: never = channel;
      return _exhaustive;
    }
  }
}
