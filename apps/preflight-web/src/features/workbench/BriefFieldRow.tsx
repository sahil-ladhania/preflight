/**
 * BriefFieldRow — label/value row in the campaign brief rail.
 * Why: context-column structure; empty slots are not input silhouettes (B1).
 */

import type { ReactElement } from "react";
import {
  Globe,
  Landmark,
  Quote,
  Radio,
  Tags,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

const BRIEF_FIELD_ICONS: Record<string, LucideIcon> = {
  objective: Target,
  schemeName: Landmark,
  schemeCategory: Tags,
  audience: Users,
  market: Globe,
  channels: Radio,
  performanceFigures: TrendingUp,
  claims: Quote,
};

export interface BriefFieldRowProps {
  fieldKey: string;
  label: string;
  value: string | null;
  optional?: boolean;
  requiredComplete?: boolean;
  ariaSuffix?: string;
}

export function BriefFieldRow({
  fieldKey,
  label,
  value,
  optional = false,
  requiredComplete = false,
  ariaSuffix = "",
}: BriefFieldRowProps): ReactElement {
  const showEmptyOptional =
    optional && requiredComplete && (value === null || value.trim().length === 0);
  const Icon = BRIEF_FIELD_ICONS[fieldKey];

  return (
    <div className="flex flex-col gap-0.5">
      <span className="inline-flex items-center gap-1.5 font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
        {Icon !== undefined ? (
          <Icon className="size-3.5 shrink-0" aria-hidden />
        ) : null}
        {label}
      </span>
      {value !== null && value.trim().length > 0 ? (
        <p className="font-serif text-serif-row text-fg">{value}</p>
      ) : showEmptyOptional ? (
        <p className="font-sans text-caption text-fg-faint">none</p>
      ) : (
        <span
          className="font-serif text-copy text-fg-faint"
          aria-label={`${label} ${ariaSuffix}`.trim()}
        >
          —
        </span>
      )}
    </div>
  );
}
