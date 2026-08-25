# schemas

Zod shapes the web and backend share. Request and response bodies, agent JSON parse schemas, the API envelope, and foldStatus — the function that derives asset status from findings.

| Item | What it is |
|---|---|
| `eslint.config.js` | ESLint config for this package. |
| `package.json` | Package manifest; depends on zod only at runtime. |
| `src/` | One resource file per wire shape, plus foldStatus. |
| `tsconfig.json` | TypeScript config for this package. |
| `vitest.config.ts` | Vitest config; fold-order tests live in src. |
