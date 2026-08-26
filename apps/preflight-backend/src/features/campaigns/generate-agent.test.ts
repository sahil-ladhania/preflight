/**
 * generate-agent.test — skillsRead union across channels.
 * Why: GenerateResponse.skillsRead is server-attached, not model JSON.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { unionSkillsRead } from "./generate-agent.js";

test("unionSkillsRead dedupes paths in first-seen order", () => {
  assert.deepEqual(
    unionSkillsRead([
      ["skills/brand-voice/SKILL.md", "skills/channel-email/SKILL.md"],
      ["skills/brand-voice/SKILL.md", "skills/channel-linkedin/SKILL.md"],
      [],
    ]),
    [
      "skills/brand-voice/SKILL.md",
      "skills/channel-email/SKILL.md",
      "skills/channel-linkedin/SKILL.md",
    ],
  );
});

test("unionSkillsRead returns empty when no reads", () => {
  assert.deepEqual(unionSkillsRead([[], []]), []);
});
