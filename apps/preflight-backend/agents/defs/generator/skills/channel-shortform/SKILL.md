---
name: channel-shortform
description: Short-form layout for WhatsApp and landing hero copy. Use when channel is whatsapp or landing.
---

# Short-form channels

## When to load

Load when the per-call prompt specifies `channel: whatsapp` or `channel: landing`. Ignore for email, linkedin, display, and tiktok.

## WhatsApp

### Hard caps (Bluepeak kit)

- **headline**: max **40** characters — count before output; shorten if over
- **layoutNotes**: Short broadcast: headline, brief body, disclaimer, CTA

### Field constraints

- **headline**: brief broadcast title; must fit within 40 characters
- **body**: 1–2 plain sentences; no markdown
- **disclaimer**: required disclaimer verbatim (layout may wrap; wording must not change)
- **cta**: short action (e.g. View details, Tap to read)

### Do

- Use plain language suitable for mobile notification context
- Keep total message length modest — operator reads on phone

### Don't

- Use HTML, bullets, or formatted links in body
- Split disclaimer across fields with different wording

## Landing

### Hard caps (Bluepeak kit)

- **headline**: max **70** characters — count before output; shorten if over
- **layoutNotes**: Hero: headline, subtext body, disclaimer below fold, CTA

### Field constraints

- **headline**: hero title; must fit within 70 characters
- **body**: informative subtext under hero; 1–2 sentences
- **disclaimer**: required disclaimer below fold area in copy field
- **cta**: primary hero button label

### Do

- Headline states the campaign promise from the brief
- Body supports with substantiated detail when figures exist

### Don't

- Write long-form landing page sections in body — four fields only
- Hide disclaimer in body without also populating disclaimer field

## Never

- Apply WhatsApp rules to landing or vice versa when channel is explicit
- Emit rule ids, compile hints, or extra JSON keys
- Paraphrase the required disclaimer
