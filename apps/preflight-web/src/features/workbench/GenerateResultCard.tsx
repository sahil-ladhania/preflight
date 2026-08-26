/**
 * GenerateResultCard — asset links plus generator skill reads.
 * Why: Loom-visible skillsRead or honest no skill read caption.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { channelLabel, shortId } from "@/features/assets/lib";
import { CommentSheet } from "@/features/workbench/CommentSheet";
import { skillsReadCaption } from "@/features/workbench/journey";
import type { GenerateResultCardProps } from "@/features/workbench/types";

export function GenerateResultCard({
  assets,
  skillsRead,
}: GenerateResultCardProps): ReactElement {
  return (
    <CommentSheet label="Generate">
      <ul className="flex flex-col gap-2">
        {assets.map((asset) => (
          <li key={asset.id}>
            <Link
              to={`/assets/${asset.id}`}
              className="text-body-airy text-primary underline decoration-primary/50 underline-offset-4"
            >
              {channelLabel(asset.channel)} · {shortId(asset.id)}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-caption text-fg-muted">
        {skillsReadCaption(skillsRead)}
      </p>
    </CommentSheet>
  );
}
