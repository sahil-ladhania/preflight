import { useState, type ReactElement } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import type { AgentRunSummaryDTO } from "@preflight/schemas";
import { formatGeneratedAt } from "@/features/assets/lib";

export interface AgentRunBadgeProps {
  run: AgentRunSummaryDTO | null;
  generatedAt?: string;
}

function formatModel(model: string): string {
  const parts = model.split(":");
  return parts.length > 1 ? (parts[1] ?? model) : model;
}

function formatLatency(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTokens(run: AgentRunSummaryDTO): string | null {
  if (run.totalTokens !== null) {
    return `${run.totalTokens.toLocaleString()} tokens`;
  }

  if (run.inputTokens !== null && run.outputTokens !== null) {
    return `${(run.inputTokens + run.outputTokens).toLocaleString()} tokens`;
  }

  return null;
}

function formatCost(costUsd: number | null): string | null {
  if (costUsd === null || costUsd <= 0) {
    return null;
  }

  return `$${costUsd.toFixed(4)}`;
}

function RunMetricsDisclosure({
  run,
}: {
  run: AgentRunSummaryDTO;
}): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const latency = formatLatency(run.latencyMs);
  const tokens = formatTokens(run);
  const cost = formatCost(run.costUsd);

  return (
    <div className="flex flex-col gap-1.5 pt-1">
      <button
        type="button"
        className="inline-flex w-fit cursor-pointer items-center gap-1 font-sans text-caption text-fg-muted underline underline-offset-4"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <ChevronDown className="size-3.5 shrink-0" aria-hidden />
        ) : (
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
        )}
        Show run metrics
      </button>
      {open ? (
        <div className="flex flex-col gap-0.5 font-mono text-mono-faint text-fg-muted pl-4">
          <p>Latency: {latency}</p>
          {tokens !== null ? <p>Volume: {tokens}</p> : null}
          {cost !== null ? <p>Cost: {cost}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export function AgentRunBadge({
  run,
  generatedAt,
}: AgentRunBadgeProps): ReactElement {
  if (run === null) {
    return (
      <div className="flex flex-col gap-1">
        <p className="font-mono text-mono-meta text-fg-muted">
          Seeded — no live generator run
        </p>
        {generatedAt ? (
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-[10px] uppercase tracking-wider text-fg-faint">
              Generated
            </span>
            <p className="font-mono text-mono-meta text-fg-muted">
              {formatGeneratedAt(generatedAt)}
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  const timestamp = run.occurredAt ?? generatedAt;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-0.5">
        <span className="font-sans text-[10px] uppercase tracking-wider text-fg-faint">
          Generator
        </span>
        <p className="font-mono text-mono-meta text-fg">
          {formatModel(run.model)} v{run.agentDefVersion}
        </p>
      </div>

      {timestamp ? (
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-[10px] uppercase tracking-wider text-fg-faint">
            Generated
          </span>
          <p className="font-mono text-mono-meta text-fg-muted">
            {formatGeneratedAt(timestamp)}
          </p>
        </div>
      ) : null}

      {!run.ok ? (
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-[10px] uppercase tracking-wider text-fail">
            Status
          </span>
          <p className="font-mono text-mono-meta font-medium text-fail">
            Run failed{run.errorKind ? ` (${run.errorKind})` : ""}
          </p>
        </div>
      ) : null}

      <RunMetricsDisclosure run={run} />
    </div>
  );
}
