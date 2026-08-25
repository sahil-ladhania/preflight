---
name: channel-email
description: Email newsletter block layout for Bluepeak copy. Use when channel is email.
---

# Email channel format

## When to load

Load when the per-call prompt specifies `channel: email`. Ignore for other channels.

## Hard caps (Bluepeak kit)

- **headline**: max **80** characters — count before output; shorten if over
- **layoutNotes**: Newsletter block: headline, body, disclaimer footer, CTA button

## Field constraints

- **headline**: subject-line style; informative; must fit within 80 characters
- **body**: 2–4 sentences; one idea per paragraph; performance claims need period label in same or prior sentence
- **disclaimer**: full required disclaimer verbatim; may follow body as footer block
- **cta**: single action phrase (e.g. Learn more, View fund details, Read offer document)

## Layout mental model

```
[Headline — subject style]
[Body — 2–4 sentences]
[Disclaimer footer — verbatim]
[CTA button label]
```

## Do

- Lead with the campaign objective from the brief
- Keep body scannable; avoid walls of text
- Mirror Bluepeak professional tone from brand-voice skill

## Don't

- Use ALL CAPS headline unless brief requires it
- Split disclaimer across body and disclaimer field with different wording
- Add secondary CTAs or multiple links in the cta field

## Never

- Apply email layout to LinkedIn, display, or shortform channels
- Emit rule ids or extra JSON keys
- Paraphrase the required disclaimer
