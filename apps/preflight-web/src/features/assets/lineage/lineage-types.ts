/**
 * lineage-types — data types for multi-hop asset lineage graph.
 * Why: strict typing for React Flow nodes and causal chain edges.
 */

import type { AssetStatus, Channel } from "@preflight/schemas";

export interface CausalDecision {
  ruleId: string;
  verdict: string;
  actor: string;
  timestamp: string;
  summary: string;
}

export interface LineageChainNode extends Record<string, unknown> {
  assetId: string;
  generationIndex: number;
  versionLabel: string;
  shortId: string;
  headline: string;
  channel: Channel;
  status: AssetStatus;
  generatedAt: string;
  isCurrent: boolean;
  causalDecision?: CausalDecision;
}

export interface LineageChainEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  causalDecision: CausalDecision;
}

export interface LineageChainData {
  nodes: LineageChainNode[];
  edges: LineageChainEdge[];
  currentAssetId: string;
  campaignHeadline: string;
}
