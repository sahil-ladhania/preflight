/**
 * RulebookShell — Screen 4 register column and header.
 * Why: centered 1280px column per 09 R1; no PageStage card.
 */

import { Plus } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { POST_SAVE_CAPTION } from "@/features/rulebook/lib";

export interface RulebookShellProps {
  children: ReactNode;
  postSaveCaption: boolean;
  search?: ReactNode;
  onAdd: () => void;
}

export function RulebookShell({
  children,
  postSaveCaption,
  search,
  onAdd,
}: RulebookShellProps): ReactElement {
  return (
    <div className="flex min-h-below-topbar flex-col bg-ground px-8 pt-8 pb-16">
      <div className="mx-auto flex w-full max-w-register flex-1 flex-col">
        <PageHeader
          title="What campaigns are checked against"
          supportingLine={
            postSaveCaption ? (
              <p className="text-caption text-fg-muted">{POST_SAVE_CAPTION}</p>
            ) : null
          }
          search={search}
          action={
            <button
              type="button"
              className="flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-none border border-fg bg-transparent px-4 font-sans text-button font-medium text-fg select-none cursor-pointer shadow-none transition-colors hover:bg-fg hover:text-surface"
              onClick={onAdd}
            >
              <Plus className="size-3.5 shrink-0" aria-hidden="true" />
              Add judgement rule
            </button>
          }
        />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
