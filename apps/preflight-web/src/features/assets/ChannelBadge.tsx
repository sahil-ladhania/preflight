/**
 * ChannelBadge — channel icon + label for asset surfaces.
 * Why: five locked channels share one visual vocabulary (doc 19 §8.4).
 */

import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Linkedin,
  Mail,
  MessageCircle,
  Monitor,
} from "lucide-react";
import type { ReactElement } from "react";

import type { Channel } from "@preflight/schemas";

import { channelLabel } from "@/features/assets/lib";
import { cn } from "@/lib/utils";

const CHANNEL_ICONS: Record<Channel, LucideIcon> = {
  email: Mail,
  linkedin: Linkedin,
  display: Monitor,
  whatsapp: MessageCircle,
  landing: AppWindow,
};

export function channelIcon(channel: Channel): LucideIcon {
  return CHANNEL_ICONS[channel];
}

export function ChannelBadge({
  channel,
  showLabel = true,
  className,
}: {
  channel: Channel;
  showLabel?: boolean;
  className?: string;
}): ReactElement {
  const Icon = CHANNEL_ICONS[channel];
  const label = channelLabel(channel);

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-caption text-fg-muted", className)}
      aria-label={`Channel: ${label}`}
    >
      <Icon className="size-3.5 shrink-0 text-fg" aria-hidden />
      {showLabel ? <span>{label}</span> : null}
    </span>
  );
}
