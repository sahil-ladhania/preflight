/**
 * BriefArrayFields — channels, performance figures, claims controls.
 * Why: extracted from BriefForm to stay under file size limit.
 */

import type { ReactElement } from "react";

import type { Channel } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CHANNEL_OPTIONS, CAMPAIGN_INPUT_CLASS } from "@/features/campaign/lib";
import { cn } from "@/lib/utils";

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
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-fg-muted">
          Channels
          <span className="text-fail" aria-hidden="true">
            {" "}
            *
          </span>
        </p>
        {proposed && !missing ? (
          <span className="text-[11px] text-fg-muted">Proposed by extract</span>
        ) : null}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {CHANNEL_OPTIONS.map((channel) => {
          const isChecked = channels.includes(channel);
          return (
            <label
              key={channel}
              className={cn(
                "flex cursor-pointer items-center gap-2 border px-3 py-2 text-xs font-mono transition-colors",
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
              <span className="capitalize">{channel}</span>
            </label>
          );
        })}
      </div>
      {missing ? (
        <p className="text-caption text-fail">Required — select at least one channel.</p>
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
  const canAddFigure =
    figures.length === 0 ||
    ((figures[figures.length - 1]?.value.trim().length ?? 0) > 0 &&
      (figures[figures.length - 1]?.period.trim().length ?? 0) > 0);

  const updateRow = (
    index: number,
    key: "value" | "period",
    value: string,
  ): void => {
    const next = figures.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [key]: value } : row,
    );
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-fg-muted">
          Performance figures
        </p>
        {proposed ? (
          <span className="text-[11px] text-fg-muted">Proposed by extract</span>
        ) : null}
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 border border-border bg-ground/30 p-3",
          proposed && "border-dashed",
        )}
      >
        {figures.map((row, index) => (
          <div key={index} className="grid grid-cols-2 gap-2">
            <Input
              value={row.value}
              placeholder="e.g. 16.8%"
              onChange={(event) => updateRow(index, "value", event.target.value)}
              className={cn(CAMPAIGN_INPUT_CLASS, "rounded-none bg-surface")}
            />
            <Input
              value={row.period}
              placeholder="e.g. 5-year CAGR"
              onChange={(event) => updateRow(index, "period", event.target.value)}
              className={cn(CAMPAIGN_INPUT_CLASS, "rounded-none bg-surface")}
            />
          </div>
        ))}
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
      </div>
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
  const canAddClaim =
    claims.length === 0 ||
    (claims[claims.length - 1]?.trim().length ?? 0) > 0;

  const updateClaim = (index: number, value: string): void => {
    const next = claims.map((claim, claimIndex) =>
      claimIndex === index ? value : claim,
    );
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-fg-muted">Claims</p>
        {proposed ? (
          <span className="text-[11px] text-fg-muted">Proposed by extract</span>
        ) : null}
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 border border-border bg-ground/30 p-3",
          proposed && "border-dashed",
        )}
      >
        {claims.map((claim, index) => (
          <Input
            key={index}
            value={claim}
            placeholder="e.g. Market-leading research process"
            onChange={(event) => updateClaim(index, event.target.value)}
            className={cn(CAMPAIGN_INPUT_CLASS, "rounded-none bg-surface")}
          />
        ))}
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
      </div>
    </div>
  );
}
