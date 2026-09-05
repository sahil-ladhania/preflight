/**
 * RulebookShell — Screen 4 register column, header, and page end-line.
 * Why: centered 1280px column per 09 R1; no PageStage card.
 */

import { Plus } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { PrimaryButton } from "@/components/ui/primary-button";
import { POST_SAVE_CAPTION } from "@/features/rulebook/lib";

export interface RulebookShellProps {
  children: ReactNode;
  postSaveCaption: boolean;
  search?: ReactNode;
  onAdd: () => void;
  bindingCount?: number;
  advisoryCount?: number;
  totalCount?: number;
  showEndLine?: boolean;
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
            <PrimaryButton
              icon={<Plus className="size-4 shrink-0" aria-hidden="true" />}
              onClick={onAdd}
            >
              Add judgement rule
            </PrimaryButton>
          }
        />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
