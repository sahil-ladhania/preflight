/**
 * RulebookPageHeader — R1 title and add control.
 * Why: post-save caption lives under header.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { POST_SAVE_CAPTION } from "@/features/rulebook/lib";
import type { RulebookPageHeaderProps } from "@/features/rulebook/types";

export function RulebookPageHeader({
  onAdd,
  postSaveCaption,
}: RulebookPageHeaderProps): ReactElement {
  return (
    <div className="flex flex-col gap-2 border-b border-border bg-canvas px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-title text-fg">Rulebook</h1>
        <Button type="button" className="h-8 rounded-md px-4" onClick={onAdd}>
          Add judgement rule
        </Button>
      </div>
      {postSaveCaption ? (
        <p className="text-caption text-fg-muted">{POST_SAVE_CAPTION}</p>
      ) : null}
    </div>
  );
}
