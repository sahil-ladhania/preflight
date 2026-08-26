/**
 * agent-runs.service.test — recordAgentRun persistence shape.
 * Why: G-01 append-only governance trail.
 */
import assert from "node:assert/strict";
import test from "node:test";

import type { AgentRunMeta } from "../../lib/gitagent.js";
import { buildAgentRunRowData } from "./agent-runs.service.js";

const PREVIEW_MAX = 500;

function buildMeta(overrides: Partial<AgentRunMeta> = {}): AgentRunMeta {
  return {
    agentName: "generator",
    agentDefVersion: "1.0.0",
    model: "openai:gpt-4o-mini",
    prompt: "Write copy",
    output: '{"headline":"Hi"}',
    promptHash: "abc",
    outputHash: "def",
    inputTokens: 100,
    outputTokens: 50,
    totalTokens: 150,
    costUsd: 0.0001,
    latencyMs: 1200,
    skillsRead: ["skills/brand-voice/SKILL.md"],
    ok: true,
    errorKind: null,
    ...overrides,
  };
}

test("buildAgentRunRowData truncates previews to 500 characters", () => {
  const meta = buildMeta({
    prompt: "x".repeat(600),
    output: "y".repeat(600),
  });
  const row = buildAgentRunRowData(meta, { kind: "asset", id: null }, "run-1");

  assert.equal(row.promptPreview.length, PREVIEW_MAX);
  assert.equal(row.outputPreview.length, PREVIEW_MAX);
  assert.equal(row.linkageKind, "asset");
  assert.equal(row.linkageId, null);
});

test("buildAgentRunRowData maps meta fields", () => {
  const meta = buildMeta({ ok: false, errorKind: "parse_failed" });
  const row = buildAgentRunRowData(meta, { kind: "finding", id: "f-1" }, "run-2");

  assert.equal(row.agentName, "generator");
  assert.equal(row.agentDefVersion, "1.0.0");
  assert.equal(row.ok, false);
  assert.equal(row.errorKind, "parse_failed");
  assert.equal(row.linkageKind, "finding");
  assert.equal(row.linkageId, "f-1");
  assert.deepEqual(row.injectionSignals, { signals: [], severity: "low" });
  assert.deepEqual(row.chatFlags, []);
});

test("buildMeta defaults ok true", () => {
  const meta = buildMeta();
  assert.equal(meta.ok, true);
  assert.equal(meta.errorKind, null);
});
