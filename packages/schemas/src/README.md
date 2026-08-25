# src

One resource per file, re-exported from index.ts. Wire DTOs for campaigns, assets, findings, and rules; parsers for agent JSON; foldStatus; the API envelope.

| Item | What it is |
|---|---|
| `api-response.ts` | ApiResponse envelope and parse helpers. |
| `asset.ts` | Asset list, detail, lineage, and exceptions DTOs. |
| `brief.ts` | StructuredBrief Zod for PUT body and Prisma Json column. |
| `campaign.ts` | Campaign entity and compile/generate route shapes. |
| `decide.ts` | POST /findings/:id/decide request body. |
| `enums.ts` | Shared string enums re-exported across resources. |
| `explainer-output.ts` | Zod parse schema for explainer agent JSON. |
| `extractor-output.ts` | Zod parse schema for extractor agent JSON. |
| `finding.ts` | Finding row, spans, and verdict enums. |
| `fold-status.test.ts` | Five-state fold order contract tests. |
| `fold-status.ts` | foldStatus(findings) derives asset status on read. |
| `generator-output.ts` | Zod parse schema for generator agent JSON. |
| `index.ts` | Public re-exports for the package. |
| `judge-output.ts` | Zod parse schema for judge agent JSON. |
| `primitives.ts` | Shared scalars: Span, Hash, PredicateSpec, input limits. |
| `rerun-strip.ts` | Re-run strip and drift item DTOs. |
| `rule.ts` | Rule catalog row and Rulebook write bodies. |
| `waive.ts` | POST /findings/:id/waive request body. |
| `workbench.ts` | POST /workbench/chat request and response. |
