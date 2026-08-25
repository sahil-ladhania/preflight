# assets

Assets ledger. List of generated pieces, detail with highlighted spans, the rule-by-rule check list, and confirm override or waive.

| Item | What it is |
|---|---|
| `AssetDetail.tsx` | Screen 1 orchestrator; regions live in sibling files. |
| `AssetDetailShell.tsx` | Outer pad, back link, headline, and channel subtitle for detail. |
| `AssetDetailRoute.tsx` | Wired Screen 1 route entry. |
| `AssetDetailStates.tsx` | Loading, error, and not-found shells for detail. |
| `AssetListRow.tsx` | One row in the assets list table. |
| `AssetPane.tsx` | Left copy pane with span highlight segments. |
| `AssetsList.tsx` | Screen 2 list page body inside PageStage shell. |
| `AssetsListShell.tsx` | Outer heading, subtitle, New campaign, stage wrapper. |
| `ExceptionsSummary.tsx` | Waived-rules block on asset detail. |
| `LedgerExpanded.tsx` | Open finding row with snippet, wording, and actions. |
| `LedgerPane.tsx` | Right ledger header and collapsed checks list. |
| `LedgerRow.tsx` | One grid-aligned ledger check row. |
| `LineageBanner.tsx` | Parent asset link and context rule ids. |
| `PendingRing.tsx` | Spinner while findings are still evaluating. |
| `ReasonModal.tsx` | Required-reason textarea for override and waive. |
| `RerunStrip.tsx` | Re-run button and hash/drift comparison strip. |
| `StatusChip.tsx` | Five-state status chip shared by list and detail. |
| `assets.service.ts` | GET /assets, detail, finding mutations, and rerun HTTP. |
| `lib.ts` | shortId and other assets-only helpers. |
| `span-highlight.test.ts` | Tests for span-to-paint-segment mapping. |
| `span-highlight.ts` | Maps field offsets and selection to paint segments. |
| `types.ts` | Feature props and local view shapes. |
| `useAssetDetail.ts` | GET /assets/:id, selection state, and poll wiring. |
| `useAssetDetailMutations.ts` | Waive, decide, and rerun write actions. |
| `useAssetsList.ts` | GET /assets with poll when any pendingCount > 0. |
| `usePendingPoll.ts` | Shared 1000ms poll helper for list and detail. |
