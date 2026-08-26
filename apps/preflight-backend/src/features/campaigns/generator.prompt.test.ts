/**
 * generator.prompt.test — channel hints and binding skills in per-call prompt.
 * Why: doc 19 §14 G3+G4 constrained generation fence.
 */
import assert from "node:assert/strict";
import test from "node:test";

import type { Channel, StructuredBriefInput } from "@preflight/schemas";

import { buildGeneratorPrompt } from "../../../agents/generator.prompt.js";
import { loadBrandKit } from "../../lib/brand-kit.js";

const SAMPLE_BRIEF: StructuredBriefInput = {
  objective: "Drive awareness.",
  schemeName: "Bluepeak Flexi Cap Fund",
  schemeCategory: "Flexi Cap",
  audience: "Retail investors",
  channels: ["email"],
  market: "India",
  performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
  claims: ["Market-leading flexibility"],
};

const EMAIL_SKILL_PATHS = [
  "skills/brand-voice/SKILL.md",
  "skills/sebi-copy-constraints/SKILL.md",
  "skills/channel-email/SKILL.md",
];

const CHANNEL_HEADLINE_CAPS: Record<Channel, number> = {
  email: 80,
  linkedin: 120,
  display: 60,
  whatsapp: 40,
  landing: 70,
};

for (const [channel, maxHeadlineChars] of Object.entries(CHANNEL_HEADLINE_CAPS)) {
  test(`buildGeneratorPrompt includes maxHeadlineChars for ${channel}`, () => {
    const prompt = buildGeneratorPrompt({
      channel: channel as Channel,
      brief: { ...SAMPLE_BRIEF, channels: [channel as Channel] },
      brandKit: loadBrandKit(),
      rules: [{ ruleId: "SEBI-01", kind: "deterministic", wording: "Include disclaimer." }],
      detHintLines: [],
      inScopeSkillPaths: EMAIL_SKILL_PATHS,
    });

    assert.match(prompt, new RegExp(`maxHeadlineChars: ${maxHeadlineChars}`));
    assert.match(prompt, /layoutNotes:/);
  });
}

test("buildGeneratorPrompt uses binding skills language not optional read", () => {
  const prompt = buildGeneratorPrompt({
    channel: "email",
    brief: SAMPLE_BRIEF,
    brandKit: loadBrandKit(),
    rules: [],
    detHintLines: [],
    inScopeSkillPaths: EMAIL_SKILL_PATHS,
  });

  assert.match(prompt, /Read their SKILL.md files via the read tool before JSON/);
  assert.match(prompt, /skills\/brand-voice\/SKILL.md/);
  assert.doesNotMatch(prompt, /when helpful/i);
  assert.doesNotMatch(prompt, /Channel tone:/);
});

test("buildGeneratorPrompt keeps full kit JSON and required disclaimer", () => {
  const brandKit = loadBrandKit();
  const prompt = buildGeneratorPrompt({
    channel: "email",
    brief: SAMPLE_BRIEF,
    brandKit,
    rules: [],
    detHintLines: [],
    inScopeSkillPaths: EMAIL_SKILL_PATHS,
  });

  assert.match(prompt, /"kitId": "bluepeak-v1"/);
  assert.ok(prompt.includes(brandKit.requiredDisclaimer));
});
