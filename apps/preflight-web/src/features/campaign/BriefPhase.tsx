/**
 * BriefPhase — document view after Save or edit form with extract.
 * Why: doc 19 G7 read-model plus edit without growing Campaign.tsx.
 */

import { useEffect, useState, type ReactElement } from "react";

import { BriefDocument } from "@/features/campaign/BriefDocument";
import { BriefForm } from "@/features/campaign/BriefForm";
import type { BriefPhaseProps } from "@/features/campaign/types";

export function BriefPhase({
  briefSaved,
  briefDirty,
  ...formProps
}: BriefPhaseProps): ReactElement {
  const [editing, setEditing] = useState<boolean>(!briefSaved);

  useEffect(() => {
    if (briefSaved && !briefDirty) {
      setEditing(false);
    }
  }, [briefSaved, briefDirty]);

  const showDocument = briefSaved && !briefDirty && !editing;

  if (showDocument) {
    return (
      <BriefDocument brief={formProps.brief} onEdit={() => setEditing(true)} />
    );
  }

  return <BriefForm {...formProps} />;
}
