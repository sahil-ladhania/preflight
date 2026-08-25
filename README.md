**Preflight**

Preflight is a checklist run before the thing moves — the same procedure every time, producing a record. That is what this product does to a marketing asset before anyone ships it.

**Every generated asset arrives with a rule-by-rule conformance ledger.**

## The problem

Enterprise marketing in a regulated category cannot ship until every asset is *proved* conformant. Today that proof is a person reading a brand book and a compliance playbook from memory, per asset, two or three times. Generation was never the bottleneck. Proof was.

- Assets average 2.9 review rounds; about 74% require multiple stakeholder approvals. (WriteBros 2026 roundup — aggregator, corroborated across vendors. Directional.)
- Financial services: 2–3 business days for standard content, 5–10 business days for high-risk promotional material, 2–4 weeks per piece without systems in place. (Multiple fintech compliance guides. Ranges, not point estimates.)
- 95% of organisations have brand guidelines; 25% consistently enforce them; 81% still produce off-brand content. Marketing leaders report about 20% of their time correcting off-brand material. (Lucidpress/Marq State of Brand Consistency — self-reported, direction only.)

Much of this timing data is vendor-sourced and corroborated across vendors rather than independently audited. Treat it as directional.

## The solution

The operator declares constraints before anything is generated: a structured brief is compiled into a frozen rule set, then copy is produced under that freeze. Every asset lands on the Assets ledger carrying a rule-by-rule verdict — the rule id, pass or fail, the offending span in the frozen text, and the rule's own wording. Review collapses from authoring that evidence to spot-checking it: confirm, override, or waive on the row.

## The core idea — two substrates

I split the ruleset because the two kinds of rule are not the same claim. Deterministic rules run as pure TypeScript in `packages/rules`: no model, no I/O, same canonical text to the same verdict. I can prove that by re-running the engine and comparing `runHash`. Judgement rules run through an LLM evaluator, one call per rule, always advisory — they can hold an asset at `needs_human`, but they cannot, by themselves, produce `clear` or `blocked`. Mixing both in one model pass would make the byte-identical half unprovable. The split is the difference between claiming determinism and demonstrating it.

Boxes and arrows live in [documentation/02-high-level-design.md](documentation/02-high-level-design.md).

## Waive vs override

A reviewer who overrides is saying the machine misread. The finding is a rejected reading; it does not become an exception. A reviewer who waives is saying the machine was right and they are shipping anyway. Both readings stay on the ledger, and the asset can only resolve to `cleared_with_exception`, never `clear`. Conflating them would make the ledger useless to an auditor: you could no longer tell a bad evaluator from a known break. Override is forbidden on deterministic fails — string match is not a matter of opinion.

## Status model

Status is folded from findings on every read. It is never a column.


| State                    | Meaning                                                        | Operator next                                                          |
| ------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `blocked`                | A deterministic fail is still open                             | Read the det fails. Waive with a reason, or regenerate                 |
| `needs_human`            | A judgement row is pending, unavailable, or an unreviewed fail | Wait or retry unavailable; confirm, override, or waive completed fails |
| `needs_regen`            | A judgement fail was confirmed — the machine was right         | Regenerate. Further verdicts will not ship this asset                  |
| `cleared_with_exception` | Shippable; at least one waiver is on the ledger                | Ship. Exceptions stay in the face                                      |
| `clear`                  | Every hold closed by a human; zero waivers                     | Ship                                                                   |




## Demo

Coming.



The walkthrough will run Campaign through generate onto Assets, then walk the seeded ledgers across the five states. It covers waive versus override, lineage on regenerate, and the deterministic re-run strip.

## Running it locally

Prerequisites: Node 18+ and a Postgres connection string. Nothing else.

```bash
git clone <repo-url>
cd preflight
npm install
cp .env.example .env
```

Fill `.env` (repo root):

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/preflight
OPENAI_API_KEY=sk-...
DEMO_OPERATOR_NAME=Demo reviewer
```

- `DATABASE_URL` — Postgres. Prisma and the API read this.
- `OPENAI_API_KEY` — GitAgent extract, generate, and judge. Unused by the seeded ledger; required once those agents are live.
- `DEMO_OPERATOR_NAME` — copied onto a finding at waive / decide. Changing it later does not rewrite old rows. Default `Demo reviewer`.

```bash
cd apps/preflight-backend
npx prisma migrate dev
npx prisma db seed
cd ../..
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` to the backend. `GET /api/health` on the backend is the liveness check.

## Repo map

- `apps/preflight-web` — four screens. Imports `@preflight/schemas` only. Never runs matchers.
- `apps/preflight-backend` — HTTP, Prisma, GitAgent. Calls the engine; does not own matchers.
- `apps/preflight-backend/agents` — four GitAgent defs. No product state.
- `packages/rules` — the determinism claim. Catalog, predicates, matchers, `runDeterministic`, hashes. **Zero runtime dependencies.** Open this folder.
- `packages/schemas` — Zod DTOs and `foldStatus`.
- `documentation/` — locked product decisions, 01–10.



## What I deliberately did not build

- **Auth.** One operator, a demo constant. Tenants would be a different product.
- **Approval routing.** This is a workbench, not a compliance department. Multiplayer review is a surface a reviewer never opens here.
- **Localization fan-out.** The proof primitive is a character span on one text asset. N locales is N assets, not a feature.
- **Ingesting external assets.** That is proof-of-arbitrary-creative, not a constrained generation loop. The ledger is cheap because the constraints were declared first.
- **Override on deterministic fails.** The matcher is byte-identical. Calling a fail a misread would launder it into a clean pass. Waive is the only honest ship-anyway.



## Golden-set results *(pending)*

Det matcher score on the frozen golden cases, and judgement 3× agreement — or `not run`. No number until it is measured.

