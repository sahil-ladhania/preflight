/**
 * LineageDialog — wide modal React Flow canvas for causal asset lineage.
 * Why: Pass 7 single continuous midnight surface with wide generation spacing.
 */

import { useEffect, useMemo, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  Controls,
  MarkerType,
  type Edge,
} from "@xyflow/react";
import { X } from "lucide-react";

import { RegisterGrid } from "@/features/shell/RegisterGrid";
import { LineageNode, type LineageNodeType } from "./LineageNode";
import { getAssetLineageChain } from "./lineage-data";

export interface LineageDialogProps {
  assetId: string;
  open: boolean;
  onClose: () => void;
}

const nodeTypes = {
  lineage: LineageNode,
};

export function LineageDialog({
  assetId,
  open,
  onClose,
}: LineageDialogProps): ReactElement | null {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const chain = useMemo(() => getAssetLineageChain(assetId), [assetId]);

  const handleSelectAsset = (targetAssetId: string): void => {
    onClose();
    void navigate(`/assets/${targetAssetId}`);
  };

  const initialNodes: LineageNodeType[] = useMemo(() => {
    return chain.nodes.map((node, i) => ({
      id: node.assetId,
      type: "lineage" as const,
      position: { x: i * 530 + 60, y: 140 },
      data: {
        ...node,
        onSelect: handleSelectAsset,
      },
    }));
  }, [chain.nodes]);

  const initialEdges: Edge[] = useMemo(() => {
    return chain.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      label: edge.label,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#6a8298",
        width: 14,
        height: 14,
      },
      style: {
        stroke: "#6a8298",
        strokeWidth: 2,
      },
      labelStyle: {
        fill: "var(--color-chrome-fg)",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        fontWeight: 500,
      },
      labelBgStyle: {
        fill: "#131b24",
        stroke: "#283848",
        strokeWidth: 1,
      },
      labelBgPadding: [8, 5] as [number, number],
    }));
  }, [chain.edges]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Asset lineage history"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="document"
        className="relative flex h-[640px] w-full max-w-5xl flex-col overflow-hidden rounded-none border-none shadow-none"
        style={{
          background: "linear-gradient(180deg, #182430 0%, #0d141d 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Title Hierarchy — canvas top-left, no container */}
        <div className="pointer-events-none absolute top-6 left-7 z-20 flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-chrome-fg-muted/60">
            Asset Lineage
          </span>
          <h2 className="font-serif text-lg font-semibold leading-tight text-chrome-fg">
            {chain.campaignHeadline}
          </h2>
          <span className="font-mono text-xs text-chrome-fg-muted">
            {chain.nodes.length} generations in chain
          </span>
        </div>

        {/* Single borderless close control — canvas top-right */}
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute top-6 right-6 z-20 cursor-pointer p-1 text-chrome-fg-muted transition-none hover:text-chrome-fg"
        >
          <X className="size-5" />
        </button>

        {/* Continuous canvas area */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {/* Whispered RegisterGrid pattern underlay */}
          <div className="pointer-events-none absolute inset-0 opacity-100" aria-hidden="true">
            <RegisterGrid
              stroke="#fffdf9"
              strokeOpacity={0.02}
              vStrokeOpacity={0.015}
              fill="#fffdf9"
              fillOpacity={0.01}
              className="absolute inset-0"
            />
          </div>

          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={1.5}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
            className="relative z-10"
          >
            <Controls
              showInteractive={false}
              position="bottom-right"
              className="!m-5"
            />
          </ReactFlow>

          {/* Audit banner notice */}
          <div className="pointer-events-none absolute bottom-5 left-7 z-20">
            <span className="border border-[#283848] bg-[#101822]/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-chrome-fg-muted">
              Read-only audit graph · Click node to view asset
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
