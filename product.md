# Product

Preflight is a checklist before a marketing asset ships — same procedure every time, producing a record.

This note is the product story. Locks live in `[documentation/](documentation/)`. Run steps live in the [README](README.md).

## Opening we took

Enterprise marketing in a regulated category stalls on **proof**, not on writing copy.


| Took                                   | Cut                                              |
| -------------------------------------- | ------------------------------------------------ |
| Pre-submit compliance and brand review | Localization fan-out                             |
| Brief → structured intake              | Stakeholder inbox / idle-wait routing            |
| Record around the ledger               | Certification theatre — SOC 2, SSO, legal filing |


A homepage agent starts the campaign. Compile and the ledger stay code. That is **agentic UX, non-agentic proof**.

## Journey

Default route is **Workbench**. Then:

```mermaid
flowchart LR
  Workbench --> Brief
  Brief --> Freeze
  Freeze --> Generate
  Generate --> Ledger
```




| Step      | What happens                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| Workbench | GitAgent interviews for a structured brief; handoff runs extract only when every required field is captured. |
| Brief     | Operator reviews the brief; **Build it** runs save → freeze → generate in one chain, or step-by-step.        |
| Freeze    | Code compiles which rules apply. Wording is snapshotted.                                                     |
| Generate  | GitAgent writes copy under that freeze and a Bluepeak brand kit.                                             |
| Ledger    | Every asset has rule id, pass or fail, span, frozen wording.                                                 |


Channel **previews** are the same four fields in a kit frame. Proof is still `canonicalText`. On asset detail, **Verify deterministic checks** re-runs frozen rules read-only and surfaces rulebook drift since freeze — pass/fail on the asset does not change. **Ready for compliance desk** names the next human. It is not multiplayer review.

## Split


| GitAgent                                                    | Code                                   |
| ----------------------------------------------------------- | -------------------------------------- |
| Explainer, extractor, generator — skills + sandboxed `read` | Compile, matchers, hashes, status fold |
| Judge — one call per soft rule, no tools                    | Confirm, override, waive               |


Models never pick compile `ruleIds`. Deterministic matchers never sit on the agent bus.

## Three decisions


| Decision                                                                     | Trade-off                                                                         |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| The product is the conformance ledger, not a copywriter.                     | Generation stays constrained. We prove the asset; we do not wow with a writer OS. |
| Hard rules are hashed TypeScript. Soft rules are one isolated LLM call each. | More moving parts. The model alone cannot clear or block an asset.                |
| Skills on talk and generate. Engine and judge stay code.                     | Not a skill-only agent OS. Workflows stay so proof does not leak across assets.   |




## What can a reviewer do when a rule fails?

- **Confirm** — the machine is right. Do not ship. Fix the copy.
- **Override** — the machine misread. Not an exception. Forbidden on deterministic fails.
- **Waive** — the machine is right, ship anyway. Both readings stay. Chip is Exception, never Clear.

## What audit trail sits around the ledger?

The ledger is the proof. These are the records that sit around it:

- Every AI call is logged — which agent, which model, how long, how many tokens. The asset shows who generated the copy.
- Judge runs are locked for consistency; evals check the system still passes known cases.
- Confirm, override, and waive each leave a history — who decided, when, and why, not just the latest chip.
- Rulebook edits require a reason; old wording stays on record.
- If a brief tries to override instructions, it is flagged and logged — nothing is silently fixed.
- Export a compliance report as JSON — freeze, findings, exceptions, and run details in one file.

## What did we leave out — and why?

- Auth, tenants, or a compliance department.
- Jasper's full surface (blogs, SEO, 40 templates).
- Legal filing. Human `clear` is the audit *shape*.
- SOC 2, a model-risk programme, or PII redaction. Shape of a trail, not a certification.
- N locales as one feature. Each locale is another asset.

## Read next

- [README](README.md) — run locally
- [Walkthrough](https://www.loom.com/share/2e1dccfde6b740f1a604ed5cb3e4b906)
