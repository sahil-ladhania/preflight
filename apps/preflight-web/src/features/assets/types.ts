/**
 * types — assets feature props and local view shapes.
 * Why: no inline type declarations in components.
 */
// size: detail + register prop surfaces share one types module

import type { ReactNode } from "react";

import type {
  AssetDetailDTO,
  AssetListItemDTO,
  AssetStatus,
  Channel,
  ExceptionItemDTO,
  FindingDTO,
  LineageDTO,
  RerunStripDTO,
} from "@preflight/schemas";

import type { RegisterFilter } from "@/features/assets/register-lib";
import type { LedgerFilter } from "@/features/assets/ledger-lib";

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
  pollError?: boolean;
  onRetry?: () => void;
  showLoadingSpinner?: boolean;
  createInFlight?: boolean;
  onNewCampaign?: () => void;
}

export interface AssetsListShellProps {
  children: ReactNode;
  createInFlight: boolean;
  onNewCampaign: () => void;
  workSummary: ReactNode;
  search?: ReactNode;
  filter: RegisterFilter;
  onFilterChange: (filter: RegisterFilter) => void;
  showFilter: boolean;
  endLine: string | null;
  counts?: {
    needYou: number;
    all: number;
    resolved: number;
  };
}

export interface AssetsRegisterTableProps {
  assets: AssetListItemDTO[];
  filter: RegisterFilter;
}

export interface AssetListRowProps {
  asset: AssetListItemDTO;
}

export interface StatusChipProps {
  status: AssetStatus;
  surface?: "register" | "detail";
}

export interface AssetDetailShellProps {
  children: ReactNode;
  headline?: string;
  channel?: Channel;
  assetId?: string;
  generatedAt?: string;
  status?: AssetStatus;
}

export interface AssetActionRowProps {
  status: AssetStatus;
  findings: FindingDTO[];
  onAccept: () => void;
  onRegenerate: () => void;
  onExport: () => void;
  exportInFlight?: boolean;
  regenerateInFlight?: boolean;
}

export interface ChannelPreviewSectionProps {
  channel: Channel;
  headline: string;
  body: string;
  disclaimer: string;
  cta: string;
  brandKit: AssetDetailDTO["brandKit"];
}

export interface LedgerHeaderProps {
  countLine: string;
  filter: LedgerFilter;
  onFilterChange: (filter: LedgerFilter) => void;
  stepperText: string;
  showStepperChevrons: boolean;
  canStepperPrev: boolean;
  canStepperNext: boolean;
  onStepperPrev: () => void;
  onStepperNext: () => void;
}

export interface AssetDetailProps {
  asset: AssetDetailFixture;
  view?: AssetDetailView;
  rerunStrip?: RerunStripDTO | null;
  generatorSkillsRead?: string[] | null;
  buildNarration?: string | null;
  showVerdictBanner?: boolean;
  showLoadingSpinner?: boolean;
  openFindingId?: string | null;
  reasonModal?: ReasonModalState;
  onSpanClick?: (findingId: string) => void;
  onRowClick?: (findingId: string) => void;
  onConfirm?: (findingId: string) => void;
  onOverride?: (findingId: string) => void;
  onWaive?: (findingId: string) => void;
  onRetry?: (findingId: string) => void;
  onRerun?: () => void;
  onRegenerate?: () => void;
  onAccept?: () => void;
  onExport?: () => void;
  exportInFlight?: boolean;
  regenerateInFlight?: boolean;
  rerunInFlight?: boolean;
  onCloseReasonModal?: () => void;
  onSubmitReason?: (reason: string) => void;
  onRetryLoad?: () => void;
  queueIndex?: number | null;
  queueTotal?: number;
  hasPrevAsset?: boolean;
  hasNextAsset?: boolean;
  onPrevAsset?: () => void;
  onNextAsset?: () => void;
  campaignName?: string;
}

export interface LineageBannerProps {
  lineage: LineageDTO;
  generationIndex: number;
}

export interface GeneratorRunBannerProps {
  skillsRead: string[];
  narration?: string | null;
}

export interface ExceptionsSummaryProps {
  exceptions: ExceptionItemDTO[];
}

export interface AssetPaneProps {
  asset: AssetDetailFixture;
  openFindingId: string | null;
  onSpanClick: (findingId: string) => void;
  rerunStrip: RerunStripDTO | null;
  onRerun: () => void;
  rerunInFlight?: boolean;
}

export interface LedgerPaneProps {
  findings: FindingDTO[];
  status: AssetStatus;
  openFindingId: string | null;
  onRowClick: (findingId: string) => void;
  onConfirm: (findingId: string) => void;
  onOverride: (findingId: string) => void;
  onWaive: (findingId: string) => void;
  onRetry: (findingId: string) => void;
  onAccept: () => void;
  onRegenerate: () => void;
  onExport: () => void;
  exportInFlight?: boolean;
  regenerateInFlight?: boolean;
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
  rerunInFlight?: boolean;
}

export interface ReasonModalProps {
  mode: ReasonModalMode;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  ruleId?: string;
  frozenWording?: string;
  machineReason?: string | null;
}

export interface ReasonModalState {
  mode: ReasonModalMode;
  findingId: string | null;
}

export interface DecisionHistoryModalProps {
  finding: FindingDTO;
  open: boolean;
  onClose: () => void;
}
