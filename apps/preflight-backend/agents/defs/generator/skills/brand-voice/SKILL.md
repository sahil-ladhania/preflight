---
name: brand-voice
description: Bluepeak verbal brand voice for marketing copy. Use when writing any client-facing headline, body, disclaimer, or CTA for any channel.
---

# Bluepeak brand voice

## When to load

Load for every generate call. This skill applies across all channels before channel-specific layout skills.

## Tone

Professional, credible, no hype. Write like a regulated asset manager addressing informed investors — not a consumer flash sale.

## Do

- Use scheme name and category accurately
- Substantiate performance claims with period labels
- Keep copy informative and restrained
- Place the required disclaimer verbatim in the **disclaimer** field

## Don't

- Guarantee returns or promise fixed outcomes
- Use superlatives like only, best, or guaranteed
- Create urgency or fear-based pressure
- Hide the disclaimer inside body only — disclaimer field must carry the verbatim string

## Forbidden claims (never invent)

- guaranteed returns
- fixed returns
- risk-free
- assured profit

## Never

- Emit rule ids or compile hints in output JSON
- Override frozen rule wordings from the prompt
- Invoke tools other than read for skill loading
