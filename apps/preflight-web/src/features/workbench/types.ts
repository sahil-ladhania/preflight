/**
 * types — workbench feature props and local view shapes.
 * Why: no inline type declarations in components.
 */

import type { ExplainerSuggestedAction, StructuredBriefInput } from "@preflight/schemas";
import type { ReactNode } from "react";

import type { RuleCatalogRowDTO } from "@preflight/schemas";

export type WorkbenchMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "pending" }
  | {
      id: string;
      role: "assistant";
      text: string;
      ruleIds: string[];
      suggestedAction?: ExplainerSuggestedAction;
      brief?: StructuredBriefInput;
      reveal?: boolean;
    }
  | { id: string; role: "error"; text: string };

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
  onSearchQueryChange?: (value: string) => void;
  onSend?: () => void;
  onGoToCampaign?: () => void;
  onStartCampaignFromConversation?: () => void;
  handoffInFlight?: boolean;
  handoffEnabled?: boolean;
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
