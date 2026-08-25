# campaign

One page, three steps: write the brief, review the frozen rules, generate copy. Extract, compile, and generate are called from here.

| Item | What it is |
|---|---|
| `BriefArrayFields.tsx` | Channels, performance figures, and claims controls. |
| `BriefForm.tsx` | Free-text and structured brief fields with extract borders. |
| `Campaign.tsx` | Screen 3 three-step orchestrator on one scroll page. |
| `CampaignPageHeader.tsx` | Full-bleed title row matching other screen headers. |
| `CampaignPageShell.tsx` | Full-bleed chrome with 720px content column. |
| `CampaignStates.tsx` | Loading, error, and not-found shells. |
| `CampaignStep.tsx` | Gated step section with dimming until prior step completes. |
| `CampaignStepNav.tsx` | Sticky Brief · Constraint set · Generate scroll rail. |
| `ConstraintCards.tsx` | Frozen constraint cards, zero-rules banner, and checkbox. |
| `GenerateBlock.tsx` | Generate action block and status captions. |
| `campaign.service.ts` | Campaign CRUD and extract/compile/generate HTTP. |
| `lib.ts` | Brief defaults, dirty check, and generate gate captions. |
| `types.ts` | Feature props and local view shapes. |
| `useCampaign.ts` | GET/PUT brief, extract, compile, generate orchestration. |
| `useCampaignFixture.ts` | Local state for design-proof Campaign demos. |
| `useCampaignLoad.ts` | GET /campaigns/:id fetch and hydrate. |
| `useCampaignMutations.ts` | Extract, save, compile, and generate handlers. |
| `useCreateCampaign.ts` | POST /campaigns and navigate to blank brief. |
