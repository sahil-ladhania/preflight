# preflight-backend

HTTP API for the workbench. Campaigns, assets, findings, rules, and chat. Talks to the database and to four language-model agents. Does not serve pages.

| Item | What it is |
|---|---|
| `agents/` | Agent registration, prompt builders, and OpenGAP def folders. |
| `eslint.config.js` | ESLint config for this app. |
| `package.json` | App manifest and workspace dependencies. |
| `prisma/` | Database schema, migrations, and seed. |
| `scripts/` | One-off judgement golden runner and GitAgent spike. |
| `src/` | Express entry, features, config, lib, and middleware. |
| `tsconfig.json` | TypeScript config for this app. |
