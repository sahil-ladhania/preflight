# seed

Walkthrough data: one campaign, frozen snapshots, judgement rows, and assets A–H with their findings. story.ts orchestrates; story-a through story-h are the per-asset rows.

| Item | What it is |
|---|---|
| `judgement-rules.ts` | JudgementRule rows seeded from package specs, not package wording. |
| `story-a.ts` | Seed asset A (needs_regen, SEBI-06 confirmed). |
| `story-b.ts` | Seed asset B (regenerated from A, open SEBI-06). |
| `story-c.ts` | Seed asset C (blocked, SEBI-01 fail). |
| `story-d.ts` | Seed asset D (cleared_with_exception, SEBI-05 waived). |
| `story-e.ts` | Seed asset E (all pass, clear). |
| `story-f.ts` | StoryHelpers factory and asset F (SEBI-06 unavailable). |
| `story-findings.ts` | Engine-backed det rows and hand-written judgement findings. |
| `story-g.ts` | Compile snapshot helpers and asset G. |
| `story-h.ts` | Shared seed types, canonical builder, and finding id helper. |
| `story.ts` | Orchestrator: campaign, compile freeze, assets, and findings graph. |
| `verify-seed-findings.ts` | Compares seeded det rows to live runDeterministic output. |
