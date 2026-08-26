/**
 * types — campaign feature props and local view shapes.
 * Why: no inline type declarations in components.
 */

import type { ReactNode } from "react";

import type {
  CampaignDTO,
  CompileResponseDTO,
  InjectionDetection,
  StructuredBriefInput,
} from "@preflight/schemas";
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

export type CampaignNarrations = {
  brief: string | null;
  freeze: string | null;
  generate: string | null;
};

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
  proposedFieldKeys?: ReadonlySet<BriefField>;
  extractSkillsRead?: string[] | null;
  extractInjection?: InjectionDetection | null;
  compileResult?: CompileResponseDTO | null;
  emptySetAcknowledged?: boolean;
  extractInFlight?: boolean;
  saveInFlight?: boolean;
  compileInFlight?: boolean;
  generateInFlight?: boolean;
  saveDisabled?: boolean;
  saveDisabledCaption?: string | null;
  generateDisabled?: boolean;
  generateCaption?: string | null;
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
  onExtract?: () => void;
  onSave?: () => void;
  onCompile?: () => void;
  onGenerate?: () => void;
  onRetry?: () => void;
  buildPhase?: BuildPhase;
  buildInFlight?: boolean;
  runningStep?: CampaignStepId;
  narrations?: CampaignNarrations;
  missingFields?: BriefField[];
  onRunBuild?: () => void;
}

export interface CampaignStepProps {
  subtitle?: string;
  narration?: string | null;
  children?: ReactNode;
}

export interface BriefFormProps {
  freeText: string;
  brief: StructuredBriefInput;
  proposedFieldKeys: ReadonlySet<BriefField>;
  extractSkillsRead: string[] | null;
  extractInjection: InjectionDetection | null;
  saveDisabled: boolean;
  saveDisabledCaption: string | null;
  saveInFlight: boolean;
  extractInFlight: boolean;
  missingFields?: BriefField[];
  showStructuredForm?: boolean;
  showManualActions?: boolean;
  onFreeTextChange: (value: string) => void;
  onBriefChange: (brief: StructuredBriefInput) => void;
  onFieldEdit: (field: BriefField) => void;
  onExtract: () => void;
  onSave: () => void;
}

export interface BriefPhaseProps extends BriefFormProps {
  briefSaved: boolean;
  briefDirty: boolean;
  buildPhase?: BuildPhase;
  buildInFlight?: boolean;
  missingFieldsBuild?: BriefField[];
  emptySetAcknowledged?: boolean;
  onRunBuild?: () => void;
  onEmptySetAckChange?: (checked: boolean) => void;
}

export interface ConstraintCardsProps {
  compileResult: CompileResponseDTO | null;
  compileInFlight: boolean;
  compileDisabled: boolean;
  emptySetAcknowledged: boolean;
  staleBanner: boolean;
  onCompile: () => void;
  onEmptySetAckChange: (checked: boolean) => void;
}

export interface GenerateBlockProps {
  compileResult: CompileResponseDTO | null;
  dimmed: boolean;
  disabled: boolean;
  disabledCaption: string | null;
  generateInFlight: boolean;
  onGenerate: () => void;
}
