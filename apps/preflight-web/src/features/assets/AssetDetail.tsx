/**
 * AssetDetail — Screen 1 orchestrator.
 * Why: region siblings extracted; orchestrator stays ≤250 lines.
 */

import { useState, type ReactElement } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { AssetPane } from "@/features/assets/AssetPane";
import { ExceptionsSummary } from "@/features/assets/ExceptionsSummary";
import { LedgerPane } from "@/features/assets/LedgerPane";
import { LineageBanner } from "@/features/assets/LineageBanner";
import { ReasonModal } from "@/features/assets/ReasonModal";
import { RerunStrip } from "@/features/assets/RerunStrip";
import type {
  AssetDetailProps,
  ReasonModalState,
} from "@/features/assets/types";
import { useToastContext } from "@/features/shell/ToastHost";
import {
  ASSETS_DETAIL,
  RERUN_STRIPS,
} from "@/fixtures/assets-detail";
import type { RerunStripDTO } from "@preflight/schemas";

function LoadingState(): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <div
        className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

function ErrorState(): ReactElement {
  const handleRetry = (): void => {
    // Will re-GET /assets/:id.
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-4">
      <p className="text-caption text-fg-muted">Could not load asset.</p>
      <Button type="button" variant="outline" onClick={handleRetry}>
        Retry
      </Button>
    </div>
  );
}

function NotFoundState(): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <p className="text-caption text-fg-muted">Asset not found</p>
    </div>
  );
}

export function AssetDetail({
  asset,
  view = "loaded",
  initialRerunStrip = null,
}: AssetDetailProps): ReactElement {
  const { enqueue } = useToastContext();
  const [openFindingId, setOpenFindingId] = useState<string | null>(null);
  const [reasonModal, setReasonModal] = useState<ReasonModalState>({
    mode: "closed",
    findingId: null,
  });
  const [rerunStrip, setRerunStrip] = useState<RerunStripDTO | null>(
    initialRerunStrip,
  );

  if (view === "loading") {
    return <LoadingState />;
  }

  if (view === "error") {
    return <ErrorState />;
  }

  const handleAccept = (): void => {
    // Will ship — demo has no publishing endpoint.
    enqueue("Would ship — demo has no publishing.");
  };

  const handleRerun = (): void => {
    const strip = RERUN_STRIPS[asset.id] ?? null;
    setRerunStrip(strip);
  };

  const closeModal = (): void => {
    setReasonModal({ mode: "closed", findingId: null });
  };

  const submitModal = (): void => {
    closeModal();
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col bg-canvas-subtle">
      {asset.lineage !== null ? (
        <LineageBanner lineage={asset.lineage} />
      ) : null}
      {asset.exceptions.length > 0 ? (
        <ExceptionsSummary exceptions={asset.exceptions} />
      ) : null}
      <div className="flex min-h-0 flex-1 gap-0 p-0">
        <div className="min-h-0 w-[58%] shrink-0 p-2">
          <AssetPane
            asset={asset}
            openFindingId={openFindingId}
            onSpanClick={setOpenFindingId}
            onAccept={handleAccept}
            onRegenerate={() => {}}
          />
        </div>
        <div className="min-h-0 w-[42%] shrink-0 p-2 pl-0">
          <LedgerPane
            findings={asset.findings}
            openFindingId={openFindingId}
            onRowClick={setOpenFindingId}
            onConfirm={() => {}}
            onOverride={(findingId) =>
              setReasonModal({ mode: "override", findingId })
            }
            onWaive={(findingId) =>
              setReasonModal({ mode: "waive", findingId })
            }
            onRetry={() => {}}
          />
        </div>
      </div>
      <RerunStrip strip={rerunStrip} onRerun={handleRerun} />
      <ReasonModal
        mode={reasonModal.mode}
        onClose={closeModal}
        onSubmit={submitModal}
      />
    </div>
  );
}

export function AssetDetailRoute(): ReactElement {
  const { id } = useParams<{ id: string }>();
  if (id === undefined) {
    return <NotFoundState />;
  }
  const asset = ASSETS_DETAIL[id];
  if (asset === undefined) {
    return <NotFoundState />;
  }
  return <AssetDetail asset={asset} />;
}
