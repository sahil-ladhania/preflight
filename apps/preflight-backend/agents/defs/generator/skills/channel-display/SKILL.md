---
name: channel-display
description: Display banner layout for Bluepeak copy. Use when channel is display.
---

# Display channel format

## When to load

Load when the per-call prompt specifies `channel: display`. Ignore for other channels.

## Hard caps (Bluepeak kit)

- **headline**: max **60** characters — count before output; shorten if over
- **layoutNotes**: Banner: short headline, one-line body, disclaimer strip, CTA

## Field constraints

- **headline**: short banner hook; must fit within 60 characters
- **body**: one restrained supporting line under the headline — single line only
- **disclaimer**: compact strip with required disclaimer verbatim
- **cta**: short button label (max ~20 chars)

## Layout mental model

```
[Headline — banner hook]
[Body — single subline]
[Disclaimer strip]
[CTA button]
```

## Do

- Make headline carry the primary message alone (body is backup)
- Keep body subordinate — display units have limited attention
- Use CTA as imperative verb + object (e.g. Learn more, View details)

## Don't

- Pack multiple claims into headline and body
- Use long disclaimer paraphrases — verbatim only
- Write paragraph-length body copy

## Never

- Apply display banner rules to email or LinkedIn formats
- Emit rule ids or extra JSON keys
- Invent performance claims not in the brief
