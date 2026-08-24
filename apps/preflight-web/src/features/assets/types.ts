/**
 * types — assets feature props and local view shapes.
 * Why: no inline type declarations in components.
 */

import type {
  AssetDetailDTO,
  AssetListItemDTO,
  AssetStatus,
  ExceptionItemDTO,
  FindingDTO,
  LineageDTO,
  RerunStripDTO,
} from "@preflight/schemas";

export type AssetsListView = "loaded" | "loading" | "error";
export type AssetDetailView = "loaded" | "loading" | "error";
export type ReasonModalMode = "closed" | "override" | "waive";

export interface SpanSegment {
  text: string;
  findingId: string | null;
}

export interface CopySegments {
  headline: SpanSegment[];
  body: SpanSegment[];
  disclaimer: SpanSegment[];
  cta: SpanSegment[];
}

export type AssetDetailFixture = AssetDetailDTO & {
  copySegments: CopySegments;
};

export interface AssetsListProps {
  assets: AssetListItemDTO[];
  view?: AssetsListView;
}

export interface AssetListRowProps {
  asset: AssetListItemDTO;
}

export interface StatusChipProps {
  status: AssetStatus;
}

export interface AssetDetailProps {
  asset: AssetDetailFixture;
  view?: AssetDetailView;
  initialRerunStrip?: RerunStripDTO | null;
}

export interface LineageBannerProps {
  lineage: LineageDTO;
}

export interface ExceptionsSummaryProps {
  exceptions: ExceptionItemDTO[];
}

export interface AssetPaneProps {
  asset: AssetDetailFixture;
  openFindingId: string | null;
  onSpanClick: (findingId: string) => void;
  onAccept: () => void;
  onRegenerate: () => void;
}

export interface LedgerPaneProps {
  findings: FindingDTO[];
  openFindingId: string | null;
  onRowClick: (findingId: string) => void;
  onConfirm: (findingId: string) => void;
  onOverride: (findingId: string) => void;
  onWaive: (findingId: string) => void;
  onRetry: (findingId: string) => void;
}

export interface LedgerExpandedProps {
  finding: FindingDTO;
  isPassSelected: boolean;
  onConfirm: () => void;
  onOverride: () => void;
  onWaive: () => void;
  onRetry: () => void;
}

export interface RerunStripProps {
  strip: RerunStripDTO | null;
  onRerun: () => void;
}

export interface ReasonModalProps {
  mode: ReasonModalMode;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export interface ReasonModalState {
  mode: ReasonModalMode;
  findingId: string | null;
}
