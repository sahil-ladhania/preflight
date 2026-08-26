/**
 * types — workbench feature props and local view shapes.
 * Why: no inline type declarations in components.
 */

import type { ReactNode } from "react";

import type {
  CompileResponseDTO,
  ExplainerSuggestedAction,
  GenerateResponseItem,
  RuleCatalogRowDTO,
  StructuredBriefInput,
} from "@preflight/schemas";

export type WorkbenchMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "pending" }
  | {
      id: string;
      role: "assistant";
      text: string;
      ruleIds: string[];
      suggestedAction?: ExplainerSuggestedAction;
      brief?: Partial<StructuredBriefInput>;
      reveal?: boolean;
    }
  | { id: string; role: "error"; text: string }
  | {
      id: string;
      role: "journey_extract";
      proposal: Partial<StructuredBriefInput>;
    }
  | { id: string; role: "journey_freeze"; compile: CompileResponseDTO }
  | {
      id: string;
      role: "journey_generate";
      assets: GenerateResponseItem[];
      skillsRead: string[];
    };

export interface WorkbenchJourneyView {
  active: boolean;
  saveDisabled: boolean;
  saveCaption: string | null;
  freezeDisabled: boolean;
  freezeCaption: string | null;
  generateDisabled: boolean;
  generateCaption: string | null;
  emptySetVisible: boolean;
  emptySetAcknowledged: boolean;
  saveInFlight: boolean;
  freezeInFlight: boolean;
  generateInFlight: boolean;
  onSave: () => void;
  onFreeze: () => void;
  onGenerate: () => void;
  onEmptySetAckChange: (checked: boolean) => void;
}

export interface WorkbenchProps {
  rules: RuleCatalogRowDTO[];
  prefetchFailed?: boolean;
  initialMessages?: WorkbenchMessage[];
  initialShowSearchFallback?: boolean;
  messages?: WorkbenchMessage[];
  composerText?: string;
  sendInFlight?: boolean;
  showSearchFallback?: boolean;
  searchQuery?: string;
  onComposerTextChange?: (value: string) => void;
  onSearchQueryChange?: (query: string) => void;
  onSend?: () => void;
  onGoToCampaign?: () => void;
  onStartCampaignFromConversation?: () => void;
  handoffInFlight?: boolean;
  handoffEnabled?: boolean;
  journey?: WorkbenchJourneyView;
}

export interface CommentSheetProps {
  label?: string;
  variant?: "user" | "assistant" | "error";
  children: ReactNode;
}

export interface RuleCardsProps {
  ruleIds: string[];
  rules: RuleCatalogRowDTO[];
}

export interface SearchFallbackProps {
  rules: RuleCatalogRowDTO[];
  query: string;
  onQueryChange: (query: string) => void;
}

export interface ThreadProps {
  messages: WorkbenchMessage[];
  rules: RuleCatalogRowDTO[];
  showSearchFallback: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  journey?: WorkbenchJourneyView;
}

export interface ComposerProps {
  value: string;
  disabled?: boolean;
  sendInFlight: boolean;
  handoffInFlight?: boolean;
  handoffEnabled?: boolean;
  showCampaignActions?: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onGoToCampaign?: () => void;
  onStartCampaignFromConversation?: () => void;
}

export interface ExtractResultCardProps {
  proposal: Partial<StructuredBriefInput>;
}

export interface FreezeResultCardProps {
  compile: CompileResponseDTO;
}

export interface GenerateResultCardProps {
  assets: GenerateResponseItem[];
  skillsRead: string[];
}

export type JourneyActionsProps = WorkbenchJourneyView;
