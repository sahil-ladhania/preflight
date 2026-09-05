# Thinking

Who Preflight is for, who uses it, how the journey should run, and what the interface should be.

[What the product does →](product.md) · [Design philosophy →](design.md) · [Run locally →](README.md)

---

## 1. Who are we building for?

### Answer

We are building Preflight for SEBI-registered Asset Management Companies (AMCs), specifically those ranked roughly 12–40 by AUM.

These are AMCs large enough to run frequent, multi-channel marketing campaigns across email, WhatsApp, LinkedIn, landing pages, etc., but not large enough to justify heavyweight enterprise compliance platforms or large dedicated compliance-operations teams. Compliance here is typically one to three people who also carry every other compliance function.

Their fundamental problem is not content creation. It is that the regulatory burden is significant, while the process of proving compliance is fragmented across marketing teams, compliance reviewers, emails, documents, and spreadsheets.

Preflight gives this segment a structured way to declare applicable constraints before creation and preserve evidence of compliance after approval.

---



## 2. Who will use the product, and why will they use it?



### Answer

Preflight is used by three different roles, each entering the product for a different responsibility:

#### Meera — Campaign Owner

She uses Preflight to reduce compliance-related launch delays.

Her key question is:

> *"What will constrain this campaign before I start creating it?"*

Preflight gives her visibility into applicable rules before generation and lets her move assets through compliance without relying on scattered review threads.

#### Arjun — Compliance Reviewer

He uses Preflight to make and defend compliance decisions.

His key question is:

> *"Can I explain why this asset was allowed to ship?"*

The ledger, frozen rule wording, findings, and human decisions create a persistent record of what was checked and why the final decision was made.

#### Priya — Rulebook Owner

She uses Preflight to govern policy as regulations change.

She has no separate surface in the product — she is Arjun wearing a second hat, working in the Rulebook.

Her key question is:

> *"Can I update the rules without rewriting the history of what was previously approved?"*

Rule changes create drift, while historical campaigns remain tied to their original frozen rule snapshot.

---



## 3. What should the ideal journey look like?



### Answer

Preflight should have one core product lifecycle, expressed through three user journeys.

The lifecycle is:

**Brief → Freeze → Generate → Review → Human Decision → Ship → Rule Change → Audit**

But each user enters at a different point.

**Meera:**
Brief → Freeze → Generate → Submit

Her journey should make compliance visible before it becomes a bottleneck.

**Arjun:**
Review → Investigate → Confirm / Override / Waive → Clear → Audit

His journey should make every decision defensible, not merely fast.

**Priya:**
Update Rulebook → Detect Drift → Govern Future Campaigns

Her journey should change future compliance without rewriting historical records.

And critically, the journey does not end at `clear`. It ends when the organization can later produce the evidence behind that decision. Today that final step is a JSON download, which is the weakest point in the product's own thesis.

---



## 4. What should the ideal interface be?



### Answer

The interface should feel like a trusted record, not an AI marketing workspace.

The core design philosophy should be:

**Make the truth easy to inspect.**

That means the interface should prioritize:

- Clarity over cleverness
- Stability over motion
- Evidence over decoration
- Explanation over unexplained verdicts
- Human decisions clearly separated from machine findings
- Historical records that remain stable and readable

A compliance finding should show not only what the system concluded, but which rule produced that conclusion and what evidence supports it.

The visual character should therefore feel closer to a legal record, financial statement, or court exhibit than a chat application or generic SaaS dashboard.

Preflight should also be willing to expose uncomfortable states — `blocked`, `needs_human`, `unavailable`, `waived` — rather than optimizing the interface to always look successful.

---

## Read next

- [Product](product.md) — what the product does and the five key decisions
- [Design philosophy](design.md) — why the product looks and behaves the way it does
- [README](README.md) — run locally