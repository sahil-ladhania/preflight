/**
 * agent-skills.test — yaml skill list and suffix loading.
 * Why: doc 19 §7 reviewer contract; channel-tiktok scale-by-file.
 */
import assert from "node:assert/strict";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  buildSkillPromptSuffix,
  loadSkillBodiesForSuffix,
  readAgentSkillNames,
  resolveGeneratorSkillNames,
} from "./agent-skills.js";

const libDir = fileURLToPath(new URL(".", import.meta.url));
const generatorDir = join(libDir, "../../agents/defs/generator");
const judgeDir = join(libDir, "../../agents/defs/judge");

const GENERATOR_SKILLS = [
  "brand-voice",
  "channel-email",
  "channel-linkedin",
  "channel-display",
  "channel-shortform",
  "sebi-copy-constraints",
  "channel-tiktok",
] as const;

test("readAgentSkillNames lists generator skills including channel-tiktok", async () => {
  const names = await readAgentSkillNames(generatorDir);

  for (const expected of GENERATOR_SKILLS) {
    assert.ok(names.includes(expected), `missing skill: ${expected}`);
  }

  assert.equal(names.length, GENERATOR_SKILLS.length);
});

test("readAgentSkillNames returns empty for judge", async () => {
  const names = await readAgentSkillNames(judgeDir);
  assert.deepEqual(names, []);
});

test("loadSkillBodiesForSuffix includes channel-tiktok on generator dir", async () => {
  const suffix = await loadSkillBodiesForSuffix(generatorDir, [...GENERATOR_SKILLS]);

  assert.match(suffix, /Skill: channel-tiktok/);
  assert.match(suffix, /TikTok channel format/);
});

test("buildSkillPromptSuffix loads real generator skills without throw", async () => {
  const suffix = await buildSkillPromptSuffix(generatorDir);

  assert.match(suffix, /Available skills/);
  assert.match(suffix, /Skill: brand-voice/);
  assert.match(suffix, /Skill: channel-tiktok/);
});

test("resolveGeneratorSkillNames maps channel to base + channel skill", () => {
  assert.deepEqual(resolveGeneratorSkillNames("email"), [
    "brand-voice",
    "sebi-copy-constraints",
    "channel-email",
  ]);
  assert.deepEqual(resolveGeneratorSkillNames("linkedin"), [
    "brand-voice",
    "sebi-copy-constraints",
    "channel-linkedin",
  ]);
  assert.deepEqual(resolveGeneratorSkillNames("whatsapp"), [
    "brand-voice",
    "sebi-copy-constraints",
    "channel-shortform",
  ]);
  assert.deepEqual(resolveGeneratorSkillNames("landing"), [
    "brand-voice",
    "sebi-copy-constraints",
    "channel-shortform",
  ]);
});

test("loadSkillBodiesForSuffix binding header when binding option set", async () => {
  const suffix = await loadSkillBodiesForSuffix(generatorDir, ["brand-voice"], {
    binding: true,
  });

  assert.match(suffix, /Binding skills for this call/);
  assert.doesNotMatch(suffix, /also loadable via read tool/);
});

test("channel-filtered suffix loads active channel skill only", async () => {
  const suffix = await loadSkillBodiesForSuffix(
    generatorDir,
    resolveGeneratorSkillNames("email"),
    { binding: true },
  );

  assert.match(suffix, /Skill: channel-email/);
  assert.doesNotMatch(suffix, /Skill: channel-tiktok/);
  assert.doesNotMatch(suffix, /Skill: channel-linkedin/);
});
