/**
 * rerun-strips — fixture rerun responses keyed by asset id.
 * Why: R6 strip snaps in from Re-run click without POST.
 */

import type { RerunStripDTO } from "@preflight/schemas";
import { ASSET_ID_D, ASSET_ID_E } from "@/fixtures/assets-list";

import { FROZEN_WORDING, RULESET_HASH, RUN_HASH } from "./shared";

const LIVE_RULESET_HASH = "c".repeat(64);

export const RERUN_STRIPS: Partial<Record<string, RerunStripDTO>> = {
  [ASSET_ID_E]: {
    runHash: RUN_HASH,
    rerunHash: RUN_HASH,
    hashesMatch: true,
    rulesetHash: RULESET_HASH,
    liveRulesetHash: RULESET_HASH,
    driftItems: [],
  },
  [ASSET_ID_D]: {
    runHash: RUN_HASH,
    rerunHash: RUN_HASH,
    hashesMatch: true,
    rulesetHash: RULESET_HASH,
    liveRulesetHash: LIVE_RULESET_HASH,
    driftItems: [
      {
        kind: "definition_changed",
        ruleId: "SEBI-05",
        frozenWording: FROZEN_WORDING["SEBI-05"],
        liveWording:
          "Performance figures require substantiation and period disclosure.",
        changes: ["wording"],
      },
      {
        kind: "rules_added_outside_freeze",
        ruleId: "SEBI-06",
        liveWording: FROZEN_WORDING["SEBI-06"],
      },
    ],
  },
};

export const RERUN_STRIP_ENGINE_MISMATCH: RerunStripDTO = {
  runHash: RUN_HASH,
  rerunHash: "d".repeat(64),
  hashesMatch: false,
  rulesetHash: RULESET_HASH,
  liveRulesetHash: LIVE_RULESET_HASH,
  driftItems: [],
};
