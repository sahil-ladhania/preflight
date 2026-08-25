# src

React source for the four screens plus chrome. App.tsx mounts the router. features/ is one folder per screen. fixtures/ is static payload data used to paint the UI without the API.

| Item | What it is |
|---|---|
| `App.tsx` | BrowserRouter, shell layout, and route table. |
| `components/` | Shared UI; shadcn primitives live under ui/. |
| `design-proof/` | Temporary state galleries for pixel review before wiring. |
| `features/` | One folder per screen: assets, campaign, rulebook, shell, workbench. |
| `fixtures/` | Static API-shaped payloads for fixture hooks and galleries. |
| `index.css` | Tailwind directives and design token CSS variables. |
| `lib/` | axios client and cn() class-merge helper. |
| `main.tsx` | React root mount. |
| `vite-env.d.ts` | Vite client type references. |
