/**
 * RulebookShell — outer heading + frosted stage for Screen 4 table.
 * Why: matches Assets inset pattern; table lives inside PageStage (09 R2).
 */

import type { ReactElement, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  POST_SAVE_CAPTION,
  RULEBOOK_SUBTITLE,
} from "@/features/rulebook/lib";
import { PageStage } from "@/features/shell/PageStage";

export interface RulebookShellProps {
  children: ReactNode;
  postSaveCaption: boolean;
  onAdd: () => void;
}

export function RulebookShell({
  children,
  postSaveCaption,
  onAdd,
}: RulebookShellProps): ReactElement {
  return (
    <div className="min-h-below-topbar bg-ground p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-title text-fg">Rulebook</h1>
          <p className="text-caption text-fg-muted">{RULEBOOK_SUBTITLE}</p>
          {postSaveCaption ? (
            <p className="text-caption text-fg-muted">{POST_SAVE_CAPTION}</p>
          ) : null}
        </div>
        <Button
          type="button"
          className="h-8 shrink-0 rounded-md px-4"
          onClick={onAdd}
        >
          Add judgement rule
        </Button>
      </div>
      <PageStage fullHeight={false} className="mt-4 overflow-hidden">
        {children}
      </PageStage>
    </div>
  );
}
