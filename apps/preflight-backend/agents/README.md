# agents

Registration and prompt strings for four language-model jobs: parse a brief, write copy, evaluate one rule, answer a question. defs/ is the per-agent model config and instruction files.

| Item | What it is |
|---|---|
| `defs/` | Per-agent agent.yaml, SOUL.md, and RULES.md OpenGAP folders. |
| `explainer.prompt.ts` | Builds the explainer prompt from question and catalog lines. |
| `explainer.ts` | Agent name constant for the explainer registration. |
| `extractor.prompt.ts` | Builds the extractor prompt from free-text brief input. |
| `extractor.ts` | Agent name constant for the extractor registration. |
| `generator.prompt.ts` | Builds the generator prompt from brief and frozen snapshot wordings. |
| `generator.ts` | Agent name constant for the generator registration. |
| `judge.prompt.ts` | Builds the judge prompt from snapshot wording and canonical text. |
| `judge.ts` | Agent name constant for the judge registration. |
