/**
 * agent-tools.test — sandboxed read path guards.
 * Why: doc 19 §7.4 read must not escape agent dir.
 */
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";

import { isAllowedReadPath, readSandboxedFile } from "./agent-tools.js";

test("isAllowedReadPath allows skills path", () => {
  const agentDir = "/tmp/agent";
  assert.equal(
    isAllowedReadPath(agentDir, "skills/brand-voice/SKILL.md"),
    true,
  );
});

test("isAllowedReadPath rejects parent traversal", () => {
  const agentDir = "/tmp/agent";
  assert.equal(isAllowedReadPath(agentDir, "../secrets.txt"), false);
});

test("isAllowedReadPath rejects paths outside skills root", () => {
  const agentDir = "/tmp/agent";
  assert.equal(isAllowedReadPath(agentDir, "memory/SECRET.md"), false);
});

test("readSandboxedFile reads allowed skill file", async () => {
  const agentDir = await mkdtemp(join(tmpdir(), "preflight-agent-"));
  const skillDir = join(agentDir, "skills", "demo");
  await mkdir(skillDir, { recursive: true });
  await writeFile(join(skillDir, "SKILL.md"), "demo skill body", "utf8");

  const content = await readSandboxedFile(agentDir, "skills/demo/SKILL.md");
  assert.equal(content, "demo skill body");
});

test("readSandboxedFile rejects disallowed path", async () => {
  const agentDir = await mkdtemp(join(tmpdir(), "preflight-agent-"));

  await assert.rejects(
    () => readSandboxedFile(agentDir, "../../etc/passwd"),
    /Read path not allowed/,
  );
});
