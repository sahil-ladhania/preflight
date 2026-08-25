# rulebook

The full rule list. Code-defined checks appear locked. Judgement rules can be added, edited, or deleted from a side sheet.

| Item | What it is |
|---|---|
| `DeleteRuleModal.tsx` | Confirm dialog before deleting a judgement rule. |
| `JudgementSheet.tsx` | Add/edit judgement rule form in a side sheet. |
| `Rulebook.tsx` | Screen 4 merged table orchestrator. |
| `RulebookShell.tsx` | Outer heading, subtitle, Add button, and frosted stage wrapper. |
| `RulebookRow.tsx` | One table row for a catalog rule. |
| `RulebookTable.tsx` | Merged deterministic and judgement rules table. |
| `SheetShell.tsx` | Shared sheet chrome for add and edit flows. |
| `lib.ts` | Rulebook-only formatting and filter helpers. |
| `rulebook.service.ts` | GET /rules and judgement POST/PATCH/DELETE HTTP. |
| `types.ts` | Feature props and local view shapes. |
| `useRulebook.ts` | Catalog fetch and judgement write orchestration. |
