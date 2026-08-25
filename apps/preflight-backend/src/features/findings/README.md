# findings

Human verdicts on a finding row: confirm, override, or waive. Judge runs the language-model evaluator for one rule and writes the span. Retry re-enters that path.

| Item | What it is |
|---|---|
| `finding-dto.ts` | Prisma finding row → wire DTO and refold helpers. |
| `findings.controller.ts` | HTTP handlers for waive, decide, and retry routes. |
| `findings.route.ts` | POST /findings/:id/waive, decide, and retry. |
| `findings.service.ts` | Human verdict writes with 400 gates from data model. |
| `judge.service.ts` | One judge query, indexOf span locate, persist; retry re-entry. |
