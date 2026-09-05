/**
 * StateLine — operation-wide summary counts in PageHeader supporting slot.
 * Why: register stat line pattern at whole-operation scale (08 §8.1).
 */

import type { ReactElement, ReactNode } from "react";
import { Inbox, Layers, Scale, Stamp } from "lucide-react";

import type { OverviewStateCounts } from "@/features/overview/lib";
import {
  stateLineCampaignsInProgress,
  stateLineNeedHumanForPersona,
  stateLineShippedException,
} from "@/features/overview/overview-copy";
import type { PersonaId } from "@/features/shell/types";

function StatCount({
  value,
  label,
  href,
  icon,
}: {
  value: number;
  label: string;
  href?: string;
  icon: ReactNode;
}): ReactElement {
  const inner = (
    <>
      <span className="shrink-0 text-fg-muted" aria-hidden>
        {icon}
      </span>
      <span className="font-serif text-subject-title font-semibold text-fg">
        {value}
      </span>{" "}
      <span className="font-sans text-xs text-fg-muted">{label}</span>
    </>
  );

  if (href === undefined) {
    return <span className="inline-flex items-center gap-1.5">{inner}</span>;
  }

  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 no-underline hover:opacity-80"
    >
      {inner}
    </a>
  );
}

function stateLineNeedHumanIcon(personaId: PersonaId): ReactElement {
  return personaId === "meera" ? (
    <Scale className="size-3.5" />
  ) : (
    <Inbox className="size-3.5" />
  );
}

export function StateLine({
  counts,
  personaId,
}: {
  counts: OverviewStateCounts;
  personaId: PersonaId;
}): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <StatCount
        value={counts.needHuman}
        label={stateLineNeedHumanForPersona(counts.needHuman, personaId)}
        href="#needs-you"
        icon={stateLineNeedHumanIcon(personaId)}
      />
      <span className="text-xs text-fg-muted">·</span>
      <StatCount
        value={counts.withException}
        label={stateLineShippedException(counts.withException)}
        href="#exceptions"
        icon={<Stamp className="size-3.5" />}
      />
      <span className="text-xs text-fg-muted">·</span>
      <StatCount
        value={counts.campaignsInProgress}
        label={stateLineCampaignsInProgress(counts.campaignsInProgress)}
        icon={<Layers className="size-3.5" />}
      />
    </div>
  );
}
