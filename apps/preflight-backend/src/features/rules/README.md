# rules

The rule list the UI shows. Code-defined checks plus database judgement rules. You can add, edit, or delete judgement rows here; the code-defined ones are locked.

| Item | What it is |
|---|---|
| `rules.controller.ts` | HTTP handlers for catalog read and judgement CRUD. |
| `rules.route.ts` | GET /rules; POST/PATCH/DELETE judgement only. |
| `rules.service.ts` | Live catalog merge for read; judgement CRUD; det id → 400. |
