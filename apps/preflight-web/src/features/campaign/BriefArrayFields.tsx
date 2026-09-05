/**
 * BriefArrayFields — channels, performance figures, claims controls.
 * Why: extracted from BriefForm to stay under file size limit.
 */
// size: three channel/figure/claim field components share FieldSectionHeader

import type { ReactElement, ReactNode } from "react";
import { Quote, Radio, TrendingUp } from "lucide-react";

import type { Channel } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChannelGlyph } from "@/features/assets/ChannelGlyph";
import { channelLabel } from "@/features/assets/lib";
import { CHANNEL_OPTIONS, CAMPAIGN_INPUT_CLASS } from "@/features/campaign/lib";
import { cn } from "@/lib/utils";

function FieldSectionHeader({
  label,
  icon,
  trailing,
}: {
  label: string;
  icon: ReactNode;
  trailing?: ReactNode;
}): ReactElement {
  return (
    <div className="flex items-center justify-between">
      <p className="inline-flex items-center gap-1.5 font-sans text-label font-medium uppercase tracking-wider text-fg-muted">
        <span className="shrink-0 text-fg-muted" aria-hidden>
          {icon}
        </span>
        {label}
      </p>
      {trailing}
    </div>
  );
}

export function ChannelsField({
  channels,
  proposed,
  missing = false,
  onChange,
}: {
  channels: Channel[];
  proposed: boolean;
  missing?: boolean;
  onChange: (channels: Channel[]) => void;
}): ReactElement {
  const toggle = (channel: Channel): void => {
    const next = channels.includes(channel)
      ? channels.filter((item) => item !== channel)
      : [...channels, channel];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <FieldSectionHeader
        label="Channels"
        icon={<Radio className="size-3.5" />}
        trailing={
          missing ? (
            <span className="font-sans text-[11px] text-fg-muted">Required</span>
          ) : proposed ? (
            <span className="text-[11px] text-fg-muted">Proposed by extract</span>
          ) : null
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {CHANNEL_OPTIONS.map((channel) => {
          const isChecked = channels.includes(channel);
          return (
            <label
              key={channel}
              className={cn(
                "flex cursor-pointer items-center gap-2 border px-3 py-2 text-xs font-sans transition-colors",
                missing && "border-fail",
                !missing && isChecked
                  ? "border-fg bg-surface text-fg font-medium shadow-xs"
                  : "border-border bg-ground/40 text-fg-muted hover:bg-hover hover:text-fg"
              )}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggle(channel)}
                className="rounded-none cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <ChannelGlyph channel={channel} className={isChecked ? "text-fg" : "text-fg-muted"} />
                <span>{channelLabel(channel)}</span>
              </span>
            </label>
          );
        })}
      </div>
      {missing ? (
        <p className="text-caption text-fg-muted">Required — select at least one channel.</p>
      ) : null}
    </div>
  );
}

export function PerformanceFiguresField({
  figures,
  proposed,
  onChange,
}: {
  figures: Array<{ value: string; period: string }>;
  proposed: boolean;
  onChange: (figures: Array<{ value: string; period: string }>) => void;
}): ReactElement {
  const lastFig = figures[figures.length - 1];
  const canAddFigure = figures.length === 0 ||
    ((lastFig?.value.trim().length ?? 0) > 0 && (lastFig?.period.trim().length ?? 0) > 0);

  const updateRow = (index: number, key: "value" | "period", val: string): void => {
    onChange(figures.map((row, i) => (i === index ? { ...row, [key]: val } : row)));
  };

  const addBtn = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={!canAddFigure}
      className="w-fit cursor-pointer rounded-none border-border bg-surface text-xs text-fg hover:bg-hover shadow-none"
      onClick={() => onChange([...figures, { value: "", period: "" }])}
    >
      + Add figure
    </Button>
  );

  return (
    <div className="flex flex-col gap-1.5">
      <FieldSectionHeader
        label="Performance figures"
        icon={<TrendingUp className="size-3.5" />}
        trailing={
          proposed ? (
            <span className="text-[11px] text-fg-muted">Proposed by extract</span>
          ) : null
        }
      />
      {figures.length === 0 ? (
        <div className="flex flex-col gap-2">
          <p className="font-sans text-caption text-fg-muted">None recorded.</p>
          {addBtn}
        </div>
      ) : (
        <div className={cn("flex flex-col gap-2 border border-border bg-ground/30 p-3", proposed && "border-dashed")}>
          {figures.map((row, index) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <Input
                value={row.value}
                placeholder="e.g. 16.8%"
                onChange={(e) => updateRow(index, "value", e.target.value)}
                className={cn(CAMPAIGN_INPUT_CLASS, "rounded-none bg-surface")}
              />
              <Input
                value={row.period}
                placeholder="e.g. 5-year CAGR"
                onChange={(e) => updateRow(index, "period", e.target.value)}
                className={cn(CAMPAIGN_INPUT_CLASS, "rounded-none bg-surface")}
              />
            </div>
          ))}
          {addBtn}
        </div>
      )}
    </div>
  );
}

export function ClaimsField({
  claims,
  proposed,
  onChange,
}: {
  claims: string[];
  proposed: boolean;
  onChange: (claims: string[]) => void;
}): ReactElement {
  const canAddClaim = claims.length === 0 || (claims[claims.length - 1]?.trim().length ?? 0) > 0;

  const updateClaim = (index: number, value: string): void => {
    onChange(claims.map((c, i) => (i === index ? value : c)));
  };

  const addBtn = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={!canAddClaim}
      className="w-fit cursor-pointer rounded-none border-border bg-surface text-xs text-fg hover:bg-hover shadow-none"
      onClick={() => onChange([...claims, ""])}
    >
      + Add claim
    </Button>
  );

  return (
    <div className="flex flex-col gap-1.5">
      <FieldSectionHeader
        label="Claims"
        icon={<Quote className="size-3.5" />}
        trailing={
          proposed ? (
            <span className="text-[11px] text-fg-muted">Proposed by extract</span>
          ) : null
        }
      />
      {claims.length === 0 ? (
        <div className="flex flex-col gap-2">
          <p className="font-sans text-caption text-fg-muted">None recorded.</p>
          {addBtn}
        </div>
      ) : (
        <div className={cn("flex flex-col gap-2 border border-border bg-ground/30 p-3", proposed && "border-dashed")}>
          {claims.map((claim, index) => (
            <Input
              key={index}
              value={claim}
              placeholder="e.g. Market-leading research process"
              onChange={(e) => updateClaim(index, e.target.value)}
              className={cn(CAMPAIGN_INPUT_CLASS, "rounded-none bg-surface")}
            />
          ))}
          {addBtn}
        </div>
      )}
    </div>
  );
}
