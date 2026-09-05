/**
 * types — workbench feature props and local view shapes.
 * Why: no inline type declarations in components.
 */

import type { ReactNode } from "react";

import type {
  BriefField,
  ExplainerSuggestedAction,
  RuleCatalogRowDTO,
  StructuredBriefInput,
} from "@preflight/schemas";

export type WorkbenchMessage =
  | { id: string; role: "user"; text: string; createdAt?: string }
  | { id: string; role: "pending" }
  | {
      id: string;
      role: "assistant";
      text: string;
      ruleIds: string[];
      suggestedAction?: ExplainerSuggestedAction;
      brief?: Partial<StructuredBriefInput>;
      reveal?: boolean;
      createdAt?: string;
    }
  | { id: string; role: "error"; text: string; createdAt?: string };

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
  handoffDisabledCaption?: string | null;
  briefReadiness?: {
    capturedCount: number;
    missing: BriefField[];
    complete: boolean;
    captured?: Partial<StructuredBriefInput>;
  };
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
  showSearchFallback?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  onScrollToEnd?: () => void;
}

export interface ComposerProps {
  value: string;
  disabled?: boolean;
  sendInFlight: boolean;
  handoffInFlight?: boolean;
  handoffEnabled?: boolean;
  handoffDisabledCaption?: string | null;
  showCampaignActions?: boolean;
  appearance?: "empty" | "thread";
  onChange: (value: string) => void;
  onSend: () => void;
  onGoToCampaign?: () => void;
  onStartCampaignFromConversation?: () => void;
}
