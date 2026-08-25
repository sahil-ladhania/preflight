# campaigns

Create and load a campaign, save the brief, extract fields from free text, compile a frozen rule set, and generate assets under that freeze.

| Item | What it is |
|---|---|
| `brief-adapter.test.ts` | Tests Zod brief Json → StructuredBrief adapter drift. |
| `brief-adapter.ts` | Maps saved brief Json to StructuredBrief for @preflight/rules. |
| `campaigns.controller.ts` | HTTP handlers; try/catch → ApiResponse envelope. |
| `campaigns.route.ts` | POST/GET campaign, PUT brief, POST extract/compile/generate. |
| `campaigns.service.ts` | Campaign reads; delegates compile, extract, and generate. |
| `compile.service.ts` | Applies predicates on saved brief → ConstraintSet and snapshots. |
| `extract.service.ts` | Extractor agent call; returns proposal; persists freeText only. |
| `generate-agent.ts` | Calls generator agent and parses four-field copy output. |
| `generate-canonical.test.ts` | Tests canonical text assembly from generator fields. |
| `generate-canonical.ts` | Concatenates headline, body, disclaimer, and CTA into canonical text. |
| `generate.service.ts` | Generator → canonicalText → runDeterministic → asset txn → judge fan-out. |
