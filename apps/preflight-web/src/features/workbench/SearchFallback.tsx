/**
 * SearchFallback — R2f error-only rule search.
 * Why: client filter on cached GET /rules catalog.
 */

import type { ReactElement } from "react";

import { Input } from "@/components/ui/input";
import { searchRules } from "@/features/workbench/lib";
import { RuleCard } from "@/features/workbench/RuleCards";
import type { SearchFallbackProps } from "@/features/workbench/types";

export function SearchFallback({
  rules,
  query,
  onQueryChange,
}: SearchFallbackProps): ReactElement {
  const results = searchRules(rules, query);

  return (
    <div className="mt-3 flex flex-col gap-3">
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search rules by id or wording…"
        className="h-auto rounded-xl px-4 py-3 text-body-airy"
      />
      {query.trim().length > 0 && results.length === 0 ? (
        <p className="text-caption text-fg-muted">No matching rules.</p>
      ) : null}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {results.map((rule) => (
            <RuleCard key={rule.ruleId} rule={rule} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
