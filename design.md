# Design

Why Preflight looks and behaves the way it does.

[What the product does →](product.md) · [Run locally →](README.md)

## The product is a record, not a dashboard

Preflight's output is not an approval. It is a document that someone who was not in the room will read months later — an auditor, a regulator, a successor — looking for a reason to disbelieve it. They do not care that the interface was pleasant. They care whether the record can be taken apart and still hold.

Every visual and interaction decision is downstream of that reader.

## The register — calm outside, precise inside

When a compliance reviewer opens Preflight, the feeling should be:

> "I can trust what I'm looking at."

Not:

> "Wow, this AI product looks cool."

That distinction is the whole register. Preflight is a proof-of-compliance product, not a content-generation product. The ledger is the centre, and machine findings are kept visually separate from human decisions. The interface carries that weight from the first screen.

The visual character sits closer to a legal record, a financial statement, or a court exhibit than to a chat application or a SaaS dashboard. Energy belongs to the content — the campaign assets, the headlines, the client's brand. Restraint belongs to the instrument.

> Preflight should feel less like software that wants to impress you, and more like an instrument you trust when the consequences matter.

## Six principles

These are not preferences. They form one coherent design system, and every visual rule in the product implements one of them.

| Principle | What it does | Why it matters |
|---|---|---|
| **Clarity over cleverness** | Every state answers *what happened, why, and what can I do now* without interpretation. Literal labels, consistent placement, no emphasis without meaning. | Preflight is used when users are already dealing with regulatory complexity. The interface should reduce cognitive load, not add another layer. |
| **Stability over motion** | Navigation and information placement are predictable. Nothing silently reorders. The same action produces the same outcome. | The product's core output is a record. Excessive motion communicates that information is transient — the opposite of what a record should feel like. |
| **Evidence over decoration** | The chain `rule → evidence → finding → human decision → final status` is visible for every finding. Nothing decorative competes with it. | A "Failed" badge alone tells a reviewer nothing. The evidence chain is the product's actual differentiator — it makes the machine's conclusion verifiable. |
| **Explanation over unexplained verdicts** | Every machine verdict shows the rule, what was found, and the evidence that triggered it. No bare "Failed." | A verdict without reasoning forces the user to trust the system blindly. Reviewers need to evaluate the finding, not merely accept it. |
| **Human decisions separated from machine findings** | The machine checks. The human decides. The interface never lets those look like the same kind of authority. | If the UI collapses both into one "approved" state, it hides who actually made the decision and why. Overrides become silent corrections instead of meaningful evidence. |
| **Historical records that stay stable** | Frozen wording, preserved findings, permanent exceptions, drift instead of rewriting. A new rule never silently rewrites an old decision. | A compliance record has value precisely because it can be trusted after the original decision is no longer fresh. |

## Visual identity

Four choices carry the design. Each one has a reason.

### Squared corners

There is no `border-radius` in the product — not on buttons, inputs, cards, modals, or badges. A rounded corner is the visual signature of consumer software: something designed to feel friendly and disposable. A ledger, a court exhibit, a bank statement — none of them soften their boundaries, because every boundary is load-bearing. Squared corners are not an aesthetic preference. They are a claim about the kind of artefact Preflight produces.

### Three typefaces, three attributions

| Face | Carries | Rule |
|---|---|---|
| **Serif** (Source Serif 4) | Page titles, asset copy, rule wording, human reasons | The thing being judged, and the words people wrote |
| **Sans** (Inter) | Navigation, buttons, table cells, labels, helper text | The apparatus talking about itself |
| **Mono** (system monospace) | Rule IDs, hashes, status labels, ages, the quoted failing span | Machine-produced strings, matchable byte-for-byte against the export |

This is not decoration. It is attribution. If a string's typeface does not match its origin, the interface is misattributing it. Serif for human content, sans for chrome, mono for machine output — the same convention every printed record uses.

### Near-zero motion

The product contains no transitions, no box shadows, no easing. Verdicts snap. Filters snap. Rows snap open. The only animation is a loading spinner — the one honest case where the system is currently working and has not finished.

A record does not animate, because animation implies that what you are looking at is in flux.

### Rationed colour

Roughly ninety percent of any given page is drawn in five neutrals. Red appears only where a rule failed. Slate blue appears only where a person acted or is being asked to act. Green appears exactly once — as a small checkmark stroke on a passing rule.

A ledger of nine passing rules is achromatic. That is precisely why a single failure is unmissable. Colour is evidence, not decoration.

## The authority model

The interface enforces a three-layer authority model that is never collapsed:

```
Machine checks  →  Human decides  →  Record preserves
```

**Machine findings** are deterministic code checks and isolated LLM readings. They surface what was found, but they never clear or block an asset on their own.

**Human decisions** are one of three actions, each with distinct meaning:

| Action | Meaning | Result |
|---|---|---|
| **Confirm** | The machine is right. Do not ship. Fix the copy. | Stays blocked or needs regen |
| **Override** | The machine misread. This is not a violation. | Clears without exception |
| **Waive** | The machine is right, but ship anyway. | Clears with permanent exception |

Override and waive are not the same button. Override says the machine was wrong. Waive says the machine was right and the organisation chose to ship over a known failure. Both readings stay visible forever. The disagreement itself becomes part of the record.

**The record** preserves what was checked, what the machine found, what the human decided, and why — frozen at the moment of the decision, not rewritten later.

## What the interface exposes honestly

Preflight is willing to show uncomfortable states rather than making everything look successful:

| State | What it means | Why it is shown |
|---|---|---|
| `Blocked` | A deterministic rule failed. Cannot ship without waiver or fix. | Consequential — and the interface makes it feel that way. |
| `Review` | A judgement rule flagged something. A human must decide. | The system explicitly says it cannot resolve this alone. |
| `Exception` | A human waived a real failure. Shippable, permanently marked. | The waiver is evidence, not a quiet override. It never becomes `Clear`. |
| `Unavailable` | A judgement call failed or timed out. Deterministic results unaffected. | Never a silent pass. The asset cannot resolve until the gap is addressed. |

A passing asset does not celebrate. `Clear` is rendered in muted type at normal weight — the quietest status in the system. The interface does not reward success; it draws attention to what needs a decision.

## Read next

- [README](README.md) — run locally
- [Product](product.md) — what the product does and the five key decisions
- [Walkthrough](https://www.loom.com/share/2e1dccfde6b740f1a604ed5cb3e4b906)
