# Deterministic golden report

Generated: 2026-08-25T13:29:11.636Z

| Rule | Expected | Actual | Result | Why |
|---|---|---|---|---|
| SEBI-01 | pass | pass | pass | required disclaimer phrase present in copy |
| SEBI-01 | pass | pass | pass | disclaimer tolerates extra whitespace and mixed case |
| SEBI-01 | fail | fail | pass | seed asset C — disclaimer absent |
| SEBI-01 | fail | fail | pass | near-miss reworded disclaimer |
| SEBI-01 | fail | fail | pass | disclaimer present but reworded — not the locked phrase |
| SEBI-01 | pass | pass | pass | disclaimer after body still satisfies SEBI-01 |
| SEBI-02 | pass | pass | pass | seed asset E — scheme name on first mention |
| SEBI-02 | pass | pass | pass | scheme name appears before generic fund reference |
| SEBI-02 | pass | pass | pass | scheme name split across line break |
| SEBI-02 | fail | fail | pass | first mention is generic with no scheme name |
| SEBI-02 | fail | fail | pass | category language only — no registered scheme name on first mention |
| SEBI-03 | pass | pass | pass | no percentage or CAGR claim in copy |
| SEBI-03 | pass | pass | pass | percentage cites named period in same window |
| SEBI-03 | fail | fail | pass | percentage without named period |
| SEBI-03 | pass | pass | pass | CAGR label in previous sentence covers later percentage |
| SEBI-03 | fail | fail | pass | percentage with no period label anywhere |
| SEBI-03 | pass | pass | pass | CAGR claim includes explicit year count |
| SEBI-04 | pass | pass | pass | no banned promotional phrases |
| SEBI-04 | fail | fail | pass | hyphenated banned phrase market-beating |
| SEBI-04 | fail | fail | pass | banned phrase with spaces instead of hyphen |
| SEBI-04 | fail | fail | pass | banned phrase inside quoted objection |
| SEBI-04 | fail | fail | pass | banned phrase with en-dash variant |
| SEBI-04 | fail | fail | pass | best fund banned phrase |
| SEBI-04 | fail | fail | pass | assured returns banned phrase |
| SEBI-05 | pass | pass | pass | no performance figure requiring substantiation |
| SEBI-05 | fail | fail | pass | seed asset D — past performance without substantiation markers |
| SEBI-05 | pass | pass | pass | substantiation marker not indicative present |
| SEBI-05 | fail | fail | pass | bare percentage without substantiation |
| SEBI-05 | pass | pass | pass | substantiation via verified and audited markers |
| SEBI-05 | pass | pass | pass | seed asset E disclaimer — scheme related documents marker without performance claim |

**Summary:** 30/30 (100%)