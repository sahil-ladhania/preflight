# golden

Fixed snippets and expected verdicts. det.json must pass 100% or the suite fails. judgement.json is a three-run agreement report, not a seed gate.

| Item | What it is |
|---|---|
| `det.json` | Deterministic golden cases; 100% pass is mandatory. |
| `golden-report.md` | Generated summary of det golden case outcomes. |
| `golden.test.ts` | Vitest runner for det and judgement golden files. |
| `judgement.json` | Judgement golden cases for live three-run agreement checks. |
