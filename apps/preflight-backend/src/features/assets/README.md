# assets

List and detail for generated assets. Derives lineage, exceptions, and status from findings. Re-run compares the frozen rule set to the live catalog without writing.

| Item | What it is |
|---|---|
| `assets-derive.ts` | Derives statusDetail, exceptions summary, and lineage fields. |
| `assets.controller.ts` | HTTP handlers for list, detail, and rerun routes. |
| `assets.route.ts` | GET /assets, GET /assets/:id, POST /assets/:id/rerun. |
| `assets.service.ts` | List and detail DTOs with foldStatus on every read. |
| `rerun.service.ts` | Read-only re-run strip; diffRulesets; no database writes. |
