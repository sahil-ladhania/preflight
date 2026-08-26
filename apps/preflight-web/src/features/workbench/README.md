# workbench

Ask a question about the rules. The reply is a comment thread, not chat bubbles, with cards for any rules the answer cites.

| Item | What it is |
|---|---|
| `CommentSheet.tsx` | One bordered comment sheet in the thread. |
| `Composer.tsx` | Textarea and Send control; Enter sends, Shift+Enter newline. |
| `RuleCards.tsx` | Catalog cards for ruleIds cited in an answer. |
| `SearchFallback.tsx` | Empty or no-match state when catalog filter finds nothing. |
| `Thread.tsx` | Bordered comment sheets in GitHub conversation style. |
| `Workbench.tsx` | Screen 5 thread layout on canvas-subtle background. |
| `lib.ts` | Catalog filter and message id generation helpers. |
| `types.ts` | Feature props and local view shapes. |
| `useWorkbench.ts` | POST /workbench/chat; prefetches GET /rules for cards. |
| `JourneyActions.tsx` | In-thread Save, Freeze, Generate using campaign HTTP. |
| `ExtractResultCard.tsx` | Dashed extract field summary after handoff. |
| `FreezeResultCard.tsx` | Frozen rule count, applicability, short hash. |
| `GenerateResultCard.tsx` | Asset links plus generator `skillsRead` or `no skill read`. |
| `useWorkbenchJourney.ts` | Stay-on-Workbench extract → save → freeze → generate. |
| `journey.ts` | Journey captions and campaign hydrate helpers. |
| `useWorkbenchFixture.ts` | Local chat state for design-proof Workbench demos. |
| `workbench.service.ts` | Workbench chat HTTP via the shared api client. |
