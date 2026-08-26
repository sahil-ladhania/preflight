# workbench

Turn a campaign brief into copy you can defend. Ask about rules or describe a campaign; Preflight captures fields as you chat and gates handoff until the brief is complete.

| Item | What it is |
|---|---|
| `BriefReadiness.tsx` | Captured vs still-needed line above the composer. |
| `CommentSheet.tsx` | One bordered comment sheet in the thread. |
| `Composer.tsx` | Textarea, Send, and always-visible handoff button with disabled reason. |
| `EmptyStage.tsx` | Outcome-first headline, subline, and prompt chips. |
| `RuleCards.tsx` | Catalog cards for ruleIds cited in an answer. |
| `SearchFallback.tsx` | Empty or no-match state when catalog filter finds nothing. |
| `Thread.tsx` | Bordered comment sheets; bounded typewriter reveal. |
| `Workbench.tsx` | Screen 5 thread layout on canvas-subtle background. |
| `lib.ts` | Handoff gating on brief completeness, catalog filter, message ids. |
| `types.ts` | Feature props and local view shapes. |
| `useBriefReadiness.ts` | Accumulate draft briefs from assistant turns. |
| `useWorkbench.ts` | POST /workbench/chat with capturedBrief ledger; prefetches rules. |
| `useWorkbenchHandoff.ts` | Extract from the conversation, then navigate to `/campaign/:id`. |
| `handoff.service.ts` | Campaign id resolution and the extract call behind the handoff. |
| `useWorkbenchFixture.ts` | Local chat state for design-proof Workbench demos. |
| `workbench.service.ts` | Workbench chat HTTP via the shared api client. |

Handoff enables only when the accumulated brief passes completeness checks — not on campaign keywords alone. Save, Freeze, and Generate live on Campaign; the handoff passes extract proposal in router state.
