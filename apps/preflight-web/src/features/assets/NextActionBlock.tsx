/**
 * NextActionBlock — Screen 1 pinned terminal action block.
 * Why: single driven next step for Arjun across every state (09 Screen 1 R3a/R4).
 */

import type { ReactElement, ReactNode } from "react";
import { Clock, RefreshCw, ShieldCheck } from "lucide-react";

import type { AssetStatus, FindingDTO } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
import { openFindings } from "@/features/assets/ledger-lib";

function ActionTitle({
  label,
  icon,
  tone = "muted",
}: {
  label: string;
  icon: ReactNode;
  tone?: "muted" | "decision";
}): ReactElement {
  return (
    <p
      className={
        tone === "decision"
          ? "inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-decision"
          : "inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-fg-muted"
      }
    >
      <span className="shrink-0" aria-hidden>
        {icon}
      </span>
      {label}
    </p>
  );
}

export interface NextActionBlockProps {
  status: AssetStatus;
  findings: FindingDTO[];
  onAccept: () => void;
  onRegenerate: () => void;
  regenerateInFlight?: boolean;
}

export function NextActionBlock({
  status,
  findings,
  onAccept,
  onRegenerate,
  regenerateInFlight = false,
}: NextActionBlockProps): ReactElement | null {
  // When findings are open, render persistent guidance naming what happens once resolved
  // eliminating the 550px beige void (A1 + open item 14).
  const open = openFindings(findings);
  if (open.length > 0) {
    const count = open.length;
    return (
      <div className="m-3 flex flex-col gap-1.5 border border-hairline bg-surface p-3">
        <ActionTitle
          label="Review in progress"
          icon={<Clock className="size-3.5" />}
        />
        <p className="font-sans text-caption text-fg-muted">
          {count === 1
            ? "1 open finding requires a recorded human decision before this asset can ship."
            : `${count} open findings require recorded human decisions before this asset can ship.`}
        </p>
        <p className="font-sans text-caption text-fg-faint">
          Resolving all findings enables Ready for compliance desk. Preflight does not publish.
        </p>
      </div>
    );
  }

  if (status === "needs_regen") {
    const confirmed = findings.find((f) => f.humanVerdict === "confirmed");
    const ruleId = confirmed?.ruleId ?? "a rule";

    return (
      <div className="m-3 flex flex-col gap-2.5 border border-hairline bg-surface p-3">
        <ActionTitle
          label="Regenerate to ship"
          icon={<RefreshCw className="size-3.5" />}
          tone="decision"
        />
        <p className="font-sans text-caption text-fg-muted">
          You confirmed {ruleId} as a real failure. This copy cannot ship —
          generate a new version.
        </p>
        <div className="pt-0.5">
          <Button
            type="button"
            variant="outline"
            className="flex h-8 items-center gap-2 rounded-none border border-fg bg-surface px-4 font-sans text-xs font-medium text-fg hover:bg-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={regenerateInFlight}
            onClick={onRegenerate}
          >
            {regenerateInFlight ? (
              <>
                <span className="pending-ring" aria-hidden="true" />
                <span>Regenerating…</span>
              </>
            ) : (
              "Regenerate copy"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (status === "clear" || status === "cleared_with_exception") {
    return (
      <div className="m-3 flex flex-col gap-2.5 border border-hairline bg-surface p-3">
        <ActionTitle
          label="Ready for the compliance desk"
          icon={<ShieldCheck className="size-3.5" />}
          tone="decision"
        />
        <p className="font-sans text-caption text-fg-muted">
          Every pinned rule has been evaluated or carries a recorded human
          decision. Preflight does not publish.
        </p>
        <div className="pt-0.5">
          <Button
            type="button"
            className="h-8 rounded-none border border-fg bg-fg px-4 font-sans text-xs font-medium text-surface hover:opacity-90 cursor-pointer"
            onClick={onAccept}
          >
            Ready for compliance desk
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
