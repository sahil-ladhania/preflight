# prisma

Database schema, migrations, and seed. Campaigns, frozen rule snapshots, judgement rules, assets, and findings. Status is never stored; it is computed on read.

| Item | What it is |
|---|---|
| `migrations/` | Generated Prisma migration history. |
| `schema.prisma` | Campaign, ConstraintSet, ConstraintSnapshot, JudgementRule, Asset, Finding models. |
| `seed/` | Walkthrough seed modules split by asset letter. |
| `seed.ts` | Seed entrypoint: wipe DB in FK order, run modules, disconnect. |
