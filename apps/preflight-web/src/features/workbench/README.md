# workbench

Turn a campaign brief into copy you can defend. Ask about rules or describe a campaign; Preflight captures fields as you chat and gates handoff until the brief is complete.

| Item | What it is |
|---|---|
| `BriefReadiness.tsx` | Campaign brief rail with captured fields and handoff actions. |
| `CommentSheet.tsx` | Flat record turn wrapper in the thread. |
| `Composer.tsx` | Textarea and Ask → send control. |
| `EmptyStage.tsx` | Headline, mode line, composer, and prompt pills. |
| `RuleCards.tsx` | Catalog cards for ruleIds cited in an answer. |
| `Thread.tsx` | Flat hairline-separated turns; typewriter reveal on new answers. |
| `ThreadStage.tsx` | Thread column with heading, scroll dock, and optional brief rail. |
| `WorkbenchStageHeader.tsx` | Shared R1 heading + R1a mode line. |
| `Workbench.tsx` | Screen 5 layout on ledger-grid texture. |
| `lib.ts` | Handoff gating, mode line copy, catalog filter, message ids. |
| `types.ts` | Feature props and local view shapes. |
| `useBriefReadiness.ts` | Accumulate draft briefs from assistant turns. |
| `useWorkbench.ts` | POST /workbench/chat with capturedBrief ledger; prefetches rules. |
| `useWorkbenchHandoff.ts` | Extract from the conversation, then navigate to `/campaign/:id`. |
| `handoff.service.ts` | Campaign id resolution and the extract call behind the handoff. |
| `useWorkbenchFixture.ts` | Local chat state for design-proof Workbench demos. |
| `workbench.service.ts` | Workbench chat HTTP via the shared api client. |

Handoff enables only when the accumulated brief passes completeness checks — not on campaign keywords alone. Save, Freeze, and Generate live on Campaign; the handoff passes extract proposal in router state.
