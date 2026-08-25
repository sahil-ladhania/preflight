/**
 * ChannelPreview — route asset.channel to preview shell.
 * Why: doc 19 §8.4 single entry for R3 preview frame.
 */

import type { ReactElement } from "react";

import { DisplayPreview } from "@/features/assets/previews/DisplayPreview";
import { EmailPreview } from "@/features/assets/previews/EmailPreview";
import { LinkedInPreview } from "@/features/assets/previews/LinkedInPreview";
import { ShortformPreview } from "@/features/assets/previews/ShortformPreview";
import type { ChannelPreviewContentProps } from "@/features/assets/previews/preview-types";

export function ChannelPreview(
  props: ChannelPreviewContentProps,
): ReactElement {
  switch (props.channel) {
    case "email":
      return <EmailPreview {...props} />;
    case "linkedin":
      return <LinkedInPreview {...props} />;
    case "display":
      return <DisplayPreview {...props} />;
    case "whatsapp":
    case "landing":
      return <ShortformPreview {...props} />;
    default: {
      const _exhaustive: never = props.channel;
      return _exhaustive;
    }
  }
}
