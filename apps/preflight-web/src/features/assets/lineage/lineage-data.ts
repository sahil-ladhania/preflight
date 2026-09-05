/**
 * lineage-data — resolves multi-hop causal lineage chain for an asset.
 * Why: single source of truth for lineage history answering who decided what.
 */

import {
  ASSET_ID_A,
  ASSET_ID_B,
  ASSET_ID_C,
  ASSET_ID_E,
} from "@/fixtures/assets-list";
import { ASSETS_DETAIL } from "@/fixtures/assets-detail";
import { shortId } from "@/features/assets/lib";
import type {
  LineageChainData,
  LineageChainNode,
  LineageChainEdge,
  CausalDecision,
} from "./lineage-types";

const FOUR_HOP_CHAIN_ASSETS = [
  ASSET_ID_A,
  ASSET_ID_B,
  ASSET_ID_C,
  ASSET_ID_E,
];

const FOUR_HOP_DECISIONS: CausalDecision[] = [
  {
    ruleId: "SEBI-06",
    verdict: "confirmed",
    actor: "Arjun Legha",
    timestamp: "15 Mar 2026, 11:10 IST",
    summary: "SEBI-06 confirmed · Arjun Legha · 15 Mar 2026",
  },
  {
    ruleId: "BRAND-03",
    verdict: "confirmed",
    actor: "Arjun Legha",
    timestamp: "15 Mar 2026, 12:45 IST",
    summary: "BRAND-03 confirmed · Arjun Legha · 15 Mar 2026",
  },
  {
    ruleId: "SEBI-02",
    verdict: "confirmed",
    actor: "Arjun Legha",
    timestamp: "15 Mar 2026, 13:30 IST",
    summary: "SEBI-02 confirmed · Arjun Legha · 15 Mar 2026",
  },
];

export function getAssetLineageChain(assetId: string): LineageChainData {
  // If asset is part of seed chain or regenerated:
  const isFourHop = FOUR_HOP_CHAIN_ASSETS.includes(assetId);

  if (isFourHop) {
    const rawNodes: LineageChainNode[] = [
      {
        assetId: ASSET_ID_A,
        generationIndex: 1,
        versionLabel: "v1",
        shortId: shortId(ASSET_ID_A),
        headline: "Bluepeak Flexi Cap — display banner",
        channel: "display",
        status: "needs_regen",
        generatedAt: "15 Mar 2026, 11:00 IST",
        isCurrent: assetId === ASSET_ID_A,
        causalDecision: FOUR_HOP_DECISIONS[0],
      },
      {
        assetId: ASSET_ID_B,
        generationIndex: 2,
        versionLabel: "v2",
        shortId: shortId(ASSET_ID_B),
        headline: "Bluepeak Flexi Cap — LinkedIn post (regenerated)",
        channel: "linkedin",
        status: "needs_human",
        generatedAt: "15 Mar 2026, 12:30 IST",
        isCurrent: assetId === ASSET_ID_B,
        causalDecision: FOUR_HOP_DECISIONS[1],
      },
      {
        assetId: ASSET_ID_C,
        generationIndex: 3,
        versionLabel: "v3",
        shortId: shortId(ASSET_ID_C),
        headline: "Bluepeak Flexi Cap — LinkedIn post (v3 revised)",
        channel: "linkedin",
        status: "needs_human",
        generatedAt: "15 Mar 2026, 13:15 IST",
        isCurrent: assetId === ASSET_ID_C,
        causalDecision: FOUR_HOP_DECISIONS[2],
      },
      {
        assetId: ASSET_ID_E,
        generationIndex: 4,
        versionLabel: "v4",
        shortId: shortId(ASSET_ID_E),
        headline: "Bluepeak Flexi Cap — LinkedIn post (v4 compliant)",
        channel: "linkedin",
        status: "clear",
        generatedAt: "15 Mar 2026, 14:00 IST",
        isCurrent: assetId === ASSET_ID_E,
        causalDecision: undefined,
      },
    ];

    const edges: LineageChainEdge[] = [
      {
        id: `edge-${ASSET_ID_A}-${ASSET_ID_B}`,
        source: ASSET_ID_A,
        target: ASSET_ID_B,
        label: "SEBI-06 confirmed",
        causalDecision: FOUR_HOP_DECISIONS[0]!,
      },
      {
        id: `edge-${ASSET_ID_B}-${ASSET_ID_C}`,
        source: ASSET_ID_B,
        target: ASSET_ID_C,
        label: "BRAND-03 confirmed",
        causalDecision: FOUR_HOP_DECISIONS[1]!,
      },
      {
        id: `edge-${ASSET_ID_C}-${ASSET_ID_E}`,
        source: ASSET_ID_C,
        target: ASSET_ID_E,
        label: "SEBI-02 confirmed",
        causalDecision: FOUR_HOP_DECISIONS[2]!,
      },
    ];

    return {
      nodes: rawNodes,
      edges,
      currentAssetId: assetId,
      campaignHeadline: "Bluepeak Flexi Cap Fund",
    };
  }

  // Fallback for an individual asset
  const detail = ASSETS_DETAIL[assetId];
  const headline = detail?.headline ?? `Asset ${shortId(assetId)}`;
  const singleNode: LineageChainNode = {
    assetId,
    generationIndex: detail?.generationIndex ?? 1,
    versionLabel: `v${detail?.generationIndex ?? 1}`,
    shortId: shortId(assetId),
    headline,
    channel: detail?.channel ?? "display",
    status: detail?.status ?? "needs_human",
    generatedAt: "15 Mar 2026, 14:00 IST",
    isCurrent: true,
  };

  if (detail?.lineage) {
    const parentNode: LineageChainNode = {
      assetId: detail.lineage.parentId,
      generationIndex: detail.lineage.parentGenerationIndex,
      versionLabel: `v${detail.lineage.parentGenerationIndex}`,
      shortId: shortId(detail.lineage.parentId),
      headline: `Previous generation (${shortId(detail.lineage.parentId)})`,
      channel: detail.channel,
      status: detail.lineage.parentStatus,
      generatedAt: "15 Mar 2026, 11:00 IST",
      isCurrent: false,
      causalDecision: {
        ruleId: detail.lineage.ruleIds[0] ?? "SEBI-06",
        verdict: "confirmed",
        actor: "Arjun Legha",
        timestamp: "15 Mar 2026, 11:10 IST",
        summary: `${detail.lineage.ruleIds[0] ?? "SEBI-06"} confirmed · Arjun Legha · 15 Mar 2026`,
      },
    };

    return {
      nodes: [parentNode, singleNode],
      edges: [
        {
          id: `edge-${parentNode.assetId}-${singleNode.assetId}`,
          source: parentNode.assetId,
          target: singleNode.assetId,
          label: parentNode.causalDecision?.summary ?? "Regenerated",
          causalDecision: parentNode.causalDecision!,
        },
      ],
      currentAssetId: assetId,
      campaignHeadline: headline,
    };
  }

  return {
    nodes: [singleNode],
    edges: [],
    currentAssetId: assetId,
    campaignHeadline: headline,
  };
}
