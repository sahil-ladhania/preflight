---
name: channel-tiktok
description: Short-form vertical video on-screen copy for Bluepeak. Use only when the generate prompt channel is tiktok; ignore for email, linkedin, display, whatsapp, landing.
---

# TikTok channel format

## When to load

Load this skill **only** when the per-call prompt says `channel: tiktok`. For all other channels, ignore this file entirely — do not apply TikTok layout to email, LinkedIn, display, WhatsApp, or landing copy.

## Output field mapping

- **headline**: on-screen hook / title card (max ~40 chars; readable in 2 seconds)
- **body**: 1–2 short sentences for voiceover or caption overlay; plain language
- **disclaimer**: required disclaimer verbatim; may appear as end card or caption line — wording must not change
- **cta**: single action phrase (e.g. View fund details, Learn more)

## Layout mental model

Vertical frame: hook text → supporting line → disclaimer strip → CTA. No urgency tricks, no trend slang, no meme framing.

## Do

- Keep tone professional and credible (Bluepeak brand voice)
- Put performance claims in body with period labels when the brief includes figures
- Use the exact required disclaimer string in the disclaimer field

## Don't

- Use superlatives, guaranteed returns, or fear/urgency hooks
- Invent performance data not in the structured brief
- Shorten or paraphrase the required disclaimer

## Never

- Emit rule ids, compile hints, or extra JSON keys
- Apply this skill when channel is not tiktok
