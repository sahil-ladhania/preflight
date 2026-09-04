/**
 * RulebookShell — Screen 4 register column, header, and page end-line.
 * Why: centered 1280px column per 09 R1; no PageStage card.
 */

import type { ReactElement, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { POST_SAVE_CAPTION } from "@/features/rulebook/lib";

export interface RulebookShellProps {
  children: ReactNode;
  postSaveCaption: boolean;
  bindingCount?: number;
  advisoryCount?: number;
  totalCount?: number;
  showEndLine?: boolean;
  onAdd: () => void;
}

function catalogSummary(
  bindingCount: number | undefined,
  advisoryCount: number | undefined,
): string | null {
  if (bindingCount === undefined || advisoryCount === undefined) {
    return null;
  }
  return `${bindingCount} binding · ${advisoryCount} advisory`;
}

export function RulebookShell({
  children,
  postSaveCaption,
  bindingCount,
  advisoryCount,
  totalCount,
  showEndLine = false,
  onAdd,
}: RulebookShellProps): ReactElement {
  const summary = catalogSummary(bindingCount, advisoryCount);

  return (
    <div className="flex min-h-below-topbar flex-col bg-ground px-12 pt-8 pb-12 lg:px-20 xl:px-32">
      <div className="mx-auto flex w-full max-w-register flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-page-title text-fg">Rulebook</h1>
            {summary !== null ? (
              <p className="font-serif text-subject-title text-fg">{summary}</p>
            ) : null}
            {postSaveCaption ? (
              <p className="text-caption text-fg-muted">{POST_SAVE_CAPTION}</p>
            ) : null}
          </div>
          <Button
            type="button"
            className="h-8 shrink-0 rounded-none border border-primary bg-primary px-4 font-sans text-button font-medium text-primary-foreground shadow-xs hover:bg-primary-hover"
            onClick={onAdd}
          >
            + Add judgement rule
          </Button>
        </div>
        <div className="mt-6 flex flex-1 flex-col">{children}</div>
        {showEndLine && totalCount !== undefined ? (
          <div className="mt-auto pt-8">
            <Separator className="bg-fg" />
            <div className="pt-3">
              <p className="text-center text-label-strong uppercase text-fg-muted">
                End of rulebook — {totalCount} rules total
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
