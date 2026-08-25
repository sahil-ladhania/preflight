# shell

Chrome around every screen: top bar, toasts, crash fallback, and the unknown-URL page. Also resolves which campaign the nav should open.

| Item | What it is |
|---|---|
| `ErrorBoundary.tsx` | Render crash fallback below the top bar. |
| `NotFound.tsx` | Unknown URL page. |
| `ToastHost.tsx` | Global toast stack (max 3, 5s auto-dismiss). |
| `TopBar.tsx` | Logo and four nav links with active route weight. |
| `campaign-nav.service.ts` | Fresh campaign create and Workbench latest-campaign handoff. |
| `types.ts` | Toast and error-boundary client shapes. |
| `useCampaignNavTarget.ts` | TopBar Campaign link always starts a fresh campaign. |
| `useDelayedLoading.ts` | Defers loading spinner to avoid flicker on fast fetches. |
