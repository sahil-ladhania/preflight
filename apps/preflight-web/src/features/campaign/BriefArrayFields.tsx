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
    <div className="flex flex-col gap-2">
      <p className="text-caption text-fg-muted">
        Channels
        <span className="text-fail" aria-hidden="true">
          {" "}
          *
        </span>
      </p>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-md border px-4 py-3",
          missing
            ? "border-fail"
            : proposed
              ? "border-dashed border-primary"
              : channels.length > 0
                ? "border-border bg-ground"
                : "border-dashed border-border bg-surface",
        )}
      >
        {CHANNEL_OPTIONS.map((channel) => (
          <label
            key={channel}
            className="flex cursor-pointer items-center gap-2 text-body text-fg"
          >
            <Checkbox
              checked={channels.includes(channel)}
              onCheckedChange={() => toggle(channel)}
            />
            {channel}
          </label>
        ))}
      </div>
      {missing ? (
        <p className="text-caption text-fail">Required — select at least one channel.</p>
      ) : null}
      {proposed && !missing ? (
        <p className="text-caption text-fg-muted">Proposed by extract</p>
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
    <div className="flex flex-col gap-2">
      <p className="text-caption text-fg-muted">Performance figures</p>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-md border border-border p-3",
          proposed && "border-dashed",
        )}
      >
        {figures.map((row, index) => (
          <div key={index} className="grid grid-cols-2 gap-2">
            <Input
              value={row.value}
              placeholder="e.g. 16.8%"
              onChange={(event) => updateRow(index, "value", event.target.value)}
              className={CAMPAIGN_INPUT_CLASS}
            />
            <Input
              value={row.period}
              placeholder="e.g. 5-year CAGR"
              onChange={(event) => updateRow(index, "period", event.target.value)}
              className={CAMPAIGN_INPUT_CLASS}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canAddFigure}
          onClick={() => onChange([...figures, { value: "", period: "" }])}
        >
          Add figure
        </Button>
      </div>
      {proposed ? (
        <p className="text-caption text-fg-muted">Proposed by extract</p>
      ) : null}
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
    <div className="flex flex-col gap-2">
      <p className="text-caption text-fg-muted">Claims</p>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-md border border-border p-3",
          proposed && "border-dashed",
        )}
      >
        {claims.map((claim, index) => (
          <Input
            key={index}
            value={claim}
            placeholder="e.g. Market-leading research process"
            onChange={(event) => updateClaim(index, event.target.value)}
            className={CAMPAIGN_INPUT_CLASS}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canAddClaim}
          onClick={() => onChange([...claims, ""])}
        >
          Add claim
        </Button>
      </div>
      {proposed ? (
        <p className="text-caption text-fg-muted">Proposed by extract</p>
      ) : null}
    </div>
  );
}
