# campaign

One page, three steps: describe the brief, freeze the rules, generate copy. **Build it** runs extract → save → freeze → generate in one client-side chain; per-step buttons remain as escape hatches.

Empty campaigns show the describe box first — **Build it** and structured fields unlock once there is text or extracted content. Extract and Save live behind **Edit fields manually**.

| Item | What it is |
|---|---|
| `BriefArrayFields.tsx` | Channels, performance figures, and claims controls. |
| `BriefForm.tsx` | Free-text and structured brief fields; missing-field highlight on stop. |
| `BriefPhase.tsx` | Progressive disclosure + BuildPanel placement (not in Campaign.tsx). |
| `BuildPanel.tsx` | **Build it** button, phase line, `needs_input` / `needs_ack` gates. |
| `Campaign.tsx` | Screen 3 three-step orchestrator in a single active pane. |
| `CampaignPageShell.tsx` | Two-column layout with phase rail and wider main pane. |
| `CampaignStates.tsx` | Loading, error, and not-found shells. |
| `CampaignStep.tsx` | Phase subtitle + agent narration via `CommentSheet`. |
| `CampaignStepRail.tsx` | Vertical Brief → Freeze → Generate rail; agent provenance after runs only. |
| `ConstraintCards.tsx` | Frozen constraint cards, zero-rules banner, and checkbox. |
| `GenerateBlock.tsx` | Generate action block and status captions. |
| `narration.ts` | Pure narration builders (extract, save, freeze, generate, gates). |
| `campaign.service.ts` | Campaign CRUD and extract/freeze/generate HTTP. |
| `lib.ts` | Brief defaults, dirty check, step reachability, and generate gate captions. |
| `types.ts` | Feature props and local view shapes. |
| `useCampaign.ts` | Load + mutations + build hook wiring. |
| `runCampaignBuildChain.ts` | Plain async extract → save → compile → generate chain. |
| `useCampaignBuild.ts` | Build hook state + abort; delegates chain to runCampaignBuildChain. |
| `useCampaignFixture.ts` | Local state for design-proof Campaign demos. |
| `useCampaignLoad.ts` | GET /campaigns/:id fetch and hydrate. |
| `useCampaignMutations.ts` | Extract, save, compile, and generate handlers (escape hatch). |
| `useCreateCampaign.ts` | POST /campaigns and navigate to blank brief. |
