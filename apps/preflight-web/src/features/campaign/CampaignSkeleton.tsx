/**
 * CampaignSkeleton — Screen 3 loading placeholder.
 * Why: step rail and brief region during fetch (09 Screen 3, 08 §13.4 #34).
 */

import type { ReactElement } from "react";

import { SkeletonBlock } from "@/features/shell/StageSkeleton";

function StepRailSkeleton(): ReactElement {
  return (
    <>
      <aside className="hidden w-[180px] shrink-0 md:block" aria-hidden="true">
        <div className="relative flex flex-col gap-5 pl-4">
          <div
            className="pointer-events-none absolute left-0 top-2 bottom-2 w-px bg-hairline"
            aria-hidden="true"
          />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-1 py-1.5">
              <SkeletonBlock className="h-3.5 w-28" />
              <SkeletonBlock className="h-3 w-36" />
            </div>
          ))}
        </div>
      </aside>
      <div className="flex gap-2 overflow-x-auto border-b border-hairline pb-1 md:hidden" aria-hidden="true">
        <SkeletonBlock className="h-8 w-24 shrink-0" />
        <SkeletonBlock className="h-8 w-24 shrink-0" />
        <SkeletonBlock className="h-8 w-24 shrink-0" />
      </div>
    </>
  );
}

function BriefRegionSkeleton(): ReactElement {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <div className="flex items-baseline justify-between">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-3 w-12" />
      </div>
      <SkeletonBlock className="h-40 w-full max-w-2xl" />
      <SkeletonBlock className="h-9 w-28" />
      <div className="flex flex-col gap-3">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-3 w-full max-w-md" />
        <SkeletonBlock className="h-3 w-full max-w-sm" />
      </div>
    </div>
  );
}

export function CampaignSkeleton(): ReactElement {
  return (
    <div
      className="flex min-h-below-topbar flex-col bg-ground px-8 pt-8 pb-16"
      aria-busy="true"
      aria-label="Loading campaign"
    >
      <div className="mx-auto flex w-full max-w-campaign flex-1 flex-col">
        <div className="mb-12 flex items-start justify-between gap-4">
          <SkeletonBlock className="h-8 w-56" aria-hidden="true" />
          <SkeletonBlock className="h-8 w-36 shrink-0" aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:gap-6">
          <StepRailSkeleton />
          <main className="flex min-w-0 flex-1 flex-col">
            <BriefRegionSkeleton />
          </main>
        </div>
      </div>
    </div>
  );
}
