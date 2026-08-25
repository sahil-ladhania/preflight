# rules

The engine you can re-run and get the same bytes. Deterministic rule definitions, matchers, predicates, hashes, and golden tests live here. Judgement wording does not — that is in the database.

| Item | What it is |
|---|---|
| `eslint.config.js` | ESLint config for this package. |
| `golden/` | Fixed snippet cases and the det gate test. |
| `package.json` | Package manifest; runtime dependencies stay empty. |
| `scripts/` | One-off report generator for det golden output. |
| `src/` | Engine source, public API, and tests. |
| `tsconfig.json` | TypeScript config for this package. |
| `vitest.config.ts` | Vitest config for unit and golden tests. |
