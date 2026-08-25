/**
 * types — campaign feature props and local view shapes.
 * Why: no inline type declarations in components.
 */

import type { ReactNode } from "react";

import type {
  CampaignDTO,
  CompileResponseDTO,
  StructuredBriefInput,
} from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

export type CampaignView = "loaded" | "loading" | "error";

export interface CampaignProps {
  campaign: CampaignDTO;
  view?: CampaignView;
}

export interface CampaignStepProps {
  title: string;
  subtitle?: string;
  dimmed?: boolean;
  collapsed?: boolean;
  sectionId: string;
  children: ReactNode;
}

export interface BriefFormProps {
  freeText: string;
  brief: StructuredBriefInput;
  proposedFieldKeys: ReadonlySet<BriefField>;
  saveDisabled: boolean;
  saveInFlight: boolean;
  extractInFlight: boolean;
  onFreeTextChange: (value: string) => void;
  onBriefChange: (brief: StructuredBriefInput) => void;
  onFieldEdit: (field: BriefField) => void;
  onExtract: () => void;
  onSave: () => void;
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
