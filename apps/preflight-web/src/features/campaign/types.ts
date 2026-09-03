/**
 * types — campaign feature props and local view shapes.
 * Why: no inline type declarations in components.
 */

import type { AssetListItemDTO, CampaignDTO, CompileResponseDTO, StructuredBriefInput } from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

import type { CampaignStepId } from "@/features/campaign/CampaignStepRail";

export type CampaignView = "loaded" | "loading" | "error";

export type BuildPhase =
  | "idle"
  | "extract"
  | "save"
  | "compile"
  | "generate"
  | "needs_input"
  | "needs_ack"
  | "failed";

export type { CampaignPane, PaneOverride } from "@/features/campaign/campaign-pane";

export interface CampaignNarrations {
  brief: string | null;
  freeze: string | null;
  generate: string | null;
}

export interface CampaignLoadingStateProps {
  showSpinner: boolean;
}

export interface CampaignErrorStateProps {
  onRetry?: () => void;
}

export interface CampaignProps {
  campaign: CampaignDTO;
  view?: CampaignView;
  showLoadingSpinner?: boolean;
  freeText?: string;
  brief?: StructuredBriefInput;
  compileResult?: CompileResponseDTO | null;
  emptySetAcknowledged?: boolean;
  campaignAssets?: AssetListItemDTO[];
  staleBanner?: boolean;
  s2Dimmed?: boolean;
  s3Dimmed?: boolean;
  briefDirty?: boolean;
  briefSaved?: boolean;
  activeStep?: CampaignStepId;
  initialCompileResult?: CompileResponseDTO | null;
  zeroRulesCompile?: boolean;
  onFreeTextChange?: (value: string) => void;
  onBriefChange?: (brief: StructuredBriefInput) => void;
  onFieldEdit?: (field: BriefField) => void;
  onEmptySetAckChange?: (checked: boolean) => void;
  onCompile?: () => void;
  onGenerate?: () => void;
  onRetry?: () => void;
  buildPhase?: BuildPhase;
  buildInFlight?: boolean;
  runningStep?: CampaignStepId;
  missingFields?: BriefField[];
  onRunBuild?: () => void;
}

export interface BriefPhaseProps {
  building: boolean;
  freeText: string;
  brief: StructuredBriefInput;
  buildPhase?: BuildPhase;
  buildInFlight?: boolean;
  missingFieldsBuild?: BriefField[];
  emptySetAcknowledged?: boolean;
  missingFields?: BriefField[];
  onRunBuild?: () => void;
  onEmptySetAckChange?: (checked: boolean) => void;
  onFreeTextChange: (value: string) => void;
  onBriefChange: (brief: StructuredBriefInput) => void;
  onFieldEdit: (field: BriefField) => void;
}
