# workbench

One endpoint: send a question, get prose plus related rule ids. Calls the explainer agent. Does not write to the database.

| Item | What it is |
|---|---|
| `workbench.controller.ts` | HTTP handler for POST /workbench/chat. |
| `workbench.route.ts` | Mounts the workbench chat route under /api. |
| `workbench.service.ts` | Explainer agent call; returns prose and ruleIds; no mutations. |
