/**
 * types — workbench feature props and local view shapes.
 * Why: no inline type declarations in components.
 */

import type { ReactNode } from "react";

import type { RuleCatalogRowDTO } from "@preflight/schemas";

export type WorkbenchMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; text: string; ruleIds: string[] }
  | { id: string; role: "error"; text: string };

export interface WorkbenchProps {
  rules: RuleCatalogRowDTO[];
  prefetchFailed?: boolean;
  initialMessages?: WorkbenchMessage[];
  initialShowSearchFallback?: boolean;
}

export interface CommentSheetProps {
  label: string;
  children: ReactNode;
}

export interface RuleCardsProps {
  ruleIds: string[];
  rules: RuleCatalogRowDTO[];
  onGoToCampaign: () => void;
}

export interface SearchFallbackProps {
  rules: RuleCatalogRowDTO[];
  query: string;
  onQueryChange: (query: string) => void;
  onGoToCampaign: () => void;
}

export interface ThreadProps {
  messages: WorkbenchMessage[];
  rules: RuleCatalogRowDTO[];
  showSearchFallback: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onGoToCampaign: () => void;
}

export interface ComposerProps {
  value: string;
  disabled: boolean;
  sendInFlight: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onGoToCampaign?: () => void;
}
