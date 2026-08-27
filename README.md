<div align="center">

<img src="apps/preflight-web/public/favicon.svg" width="56" alt="Preflight" />

# Preflight

A checklist before a marketing asset ships — same procedure, a record.

`TypeScript` · `React` · `Vite` · `Express` · `PostgreSQL` · `Prisma` · `GitAgent` · `OpenAI`

[How the product works →](product.md)

</div>

## Problem

- Regulated teams cannot ship until each asset is *proved* conformant.
- Proof today is a person rereading the brand book and playbook from memory.
- That happens per asset, two or three times.
- Writing copy is not the bottleneck. Proof is.

## Solution

I took pre-submit compliance and brand, plus brief intake — not a copywriter.

- Constraints are declared before any copy is generated.
- A homepage agent turns intent into a structured brief.
- Compile freezes the rules that apply. Generate runs under that freeze.
- Every asset arrives with a rule-by-rule ledger: id, pass or fail, span, wording.
- Review is spot-checking that ledger, not rebuilding the evidence.
- The ledger sits in a record: who generated, who decided, which wording — exportable.

```mermaid
flowchart LR
  Workbench --> Brief
  Brief --> Freeze
  Freeze --> Generate
  Generate --> Ledger
```

## Demo

[Watch the walkthrough](https://www.loom.com/share/2e1dccfde6b740f1a604ed5cb3e4b906) — cold start to ledger, in one pass.

Workbench → campaign → generate → ledger. Seeded assets show the review states.

Why this shape, and what we cut: [product.md](product.md).

## Where to look

Four places carry the claims. Each one is checkable in a minute.

| Path | What it shows |
| ---- | ------------- |
| `apps/preflight-backend/agents/defs/` | The four agents — SOUL, RULES, and the skill files a channel is made of |
| `packages/rules/` | The deterministic engine. Zero dependencies, 52 tests |
| `packages/schemas/src/fold-status.ts` | Status is computed here, and nowhere else |
| Any seeded asset under **Assets** | The ledger — rule id, verdict, span, frozen wording |

## Run locally

Need **Node 18+** and **Postgres**. Nothing else.

Stay in the **repo root**. Turbo starts the web app and the API together.

```bash
git clone https://github.com/sahil-ladhania/preflight.git
cd preflight
npm install
cp .env.example .env
```

Put `DATABASE_URL` and `OPENAI_API_KEY` in `.env`.

One-time database setup (still from root):

```bash
npm exec --workspace=preflight-backend -- prisma migrate dev
npm exec --workspace=preflight-backend -- prisma db seed
```

Then:

```bash
npm run dev
```

Do not `cd` into `apps/` to start servers. Open [http://localhost:5173](http://localhost:5173). `/api` proxies to the backend.
