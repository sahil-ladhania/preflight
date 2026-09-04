/**
 * ExceptionsSummary — R2 waived rules block.
 * Why: exceptions visible even under blocked status.
 */

import type { ReactElement } from "react";

import type { ExceptionsSummaryProps } from "@/features/assets/types";
import { formatGeneratedAt } from "@/features/assets/lib";
import { usePersona } from "@/features/shell/PersonaProvider";

export function ExceptionsSummary({
  exceptions,
}: ExceptionsSummaryProps): ReactElement {
  const { actor } = usePersona();

  return (
    <div className="flex flex-col gap-3">
      {exceptions.map((item) => {
        const actorName =
          item.humanActor === "Demo Operator" || !item.humanActor
            ? (actor?.name ?? "Arjun Legha")
            : item.humanActor;

        return (
          <div
            key={item.findingId}
            className="flex flex-col gap-2 border border-decision bg-decision-wash px-3.5 py-2.5"
          >
            <p className="text-micro uppercase text-decision">
              Waived by human decision{" "}
              <span className="font-mono text-mono-meta normal-case tracking-normal">
                {item.ruleId}
              </span>{" "}
              <span className="font-sans text-caption font-normal normal-case tracking-normal text-fg">
                {actorName} · {formatGeneratedAt(item.humanAt)}
              </span>
            </p>
            <p className="font-serif text-copy italic text-fg">
              &ldquo;{item.humanReason}&rdquo;
            </p>
          </div>
        );
      })}
    </div>
  );
}
