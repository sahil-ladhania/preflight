/**
 * AssetDetailSkeleton — Screen 1 three-column loading placeholder.
 * Why: context, artefact, and ledger regions during fetch (09 Screen 1, 08 §13.4 #34).
 */

import type { ReactElement } from "react";

import { SkeletonBlock } from "@/features/shell/StageSkeleton";

function ContextColumnSkeleton(): ReactElement {
  return (
    <div
      className="flex h-full min-h-0 w-[20%] shrink-0 flex-col border-r border-fg bg-surface px-5 pt-4 pb-5"
      aria-hidden="true"
    >
      <SkeletonBlock className="mb-6 h-3 w-20" />
      <div className="flex flex-col gap-5">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="h-16 w-full" />
      </div>
    </div>
  );
}

function ArtefactColumnSkeleton(): ReactElement {
  return (
    <div
      className="flex h-full min-h-0 w-[46%] shrink-0 flex-col border-r border-fg bg-surface px-6 pt-4 pb-5"
      aria-hidden="true"
    >
      <div className="mb-4 flex items-center justify-between">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-7 w-32" />
      </div>
      <div className="flex flex-col gap-6">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-6 w-full max-w-md" />
        <SkeletonBlock className="h-4 w-20" />
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-8 w-40" />
      </div>
    </div>
  );
}

function LedgerColumnSkeleton(): ReactElement {
  return (
    <div
      className="flex h-full min-h-0 w-[34%] shrink-0 flex-col bg-surface"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-3 border-b border-hairline px-5 py-4">
        <SkeletonBlock className="h-4 w-40" />
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="h-7 w-full" />
      </div>
      <div className="flex flex-col">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 border-b border-hairline px-3.5 py-2.5"
          >
            <SkeletonBlock className="size-3 shrink-0" />
            <SkeletonBlock className="h-3.5 w-16 shrink-0" />
            <SkeletonBlock className="h-3.5 flex-1" />
            <SkeletonBlock className="h-3.5 w-10 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AssetDetailSkeleton(): ReactElement {
  return (
    <div
      className="flex min-h-0 flex-1 overflow-hidden"
      aria-busy="true"
      aria-label="Loading asset"
    >
      <ContextColumnSkeleton />
      <ArtefactColumnSkeleton />
      <LedgerColumnSkeleton />
    </div>
  );
}
