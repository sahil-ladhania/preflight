# src

Server entry, Express app, and the four folders the API is built from: env config, HTTP features, shared helpers, and the error handler.

| Item | What it is |
|---|---|
| `app.ts` | Express app; mounts feature routers and GET /health. |
| `config/` | Validated environment variables (env.ts). |
| `cors.d.ts` | Type declaration for CORS middleware. |
| `features/` | One folder per HTTP resource: campaigns, assets, findings, rules, workbench. |
| `import-meta-vitest.d.ts` | Vitest import.meta types for backend tests. |
| `index.ts` | Creates the server and listens on env.PORT. |
| `lib/` | Prisma singleton, GitAgent gateway, catalog merge, HTTP errors. |
| `middleware/` | Central error handler mapping throws to ApiResponse. |
