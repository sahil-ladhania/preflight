# shell

Chrome around every screen: top bar, toasts, crash fallback, and the unknown-URL page. Also resolves which campaign the nav should open.

| Item | What it is |
|---|---|
| `ErrorBoundary.tsx` | Render crash fallback below the top bar. |
| `NotFound.tsx` | Unknown URL page. |
| `ToastHost.tsx` | Global toast stack (max 3, 5s auto-dismiss). |
| `TopBar.tsx` | Serif wordmark, four nav links, and persona control (08 §5.1). |
| `PersonaControl.tsx` | Signed-in trigger and accountability menu. |
| `PersonaProvider.tsx` | Client session actor from Screen 0 login. |
| `persona.ts` | Demo persona catalog and sessionStorage helpers. |
| `lib.ts` | Nav link classes and queue count. |
| `campaign-nav.service.ts` | Fresh campaign create and Workbench latest-campaign handoff. |
| `types.ts` | Toast, error-boundary, and shell client shapes. |
| `useCampaignNavTarget.ts` | TopBar Campaign link always starts a fresh campaign. |
| `useDelayedLoading.ts` | Defers loading spinner to avoid flicker on fast fetches. |
| `useQueueCount.ts` | Mono bracket count on Assets nav from GET /assets. |
