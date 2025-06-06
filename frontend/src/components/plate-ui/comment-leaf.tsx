// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import { cn } from "@udecode/cn";
import {
  useCommentLeaf,
  useCommentLeafState,
} from "@udecode/plate-comments/react";
import { PlateLeaf } from "@udecode/plate-common/react";

import type { TCommentText } from "@udecode/plate-comments";
import type { PlateLeafProps } from "@udecode/plate-common/react";

export function CommentLeaf({
  className,
  ...props
}: PlateLeafProps<TCommentText>) {
  const { children, leaf, nodeProps } = props;

  const state = useCommentLeafState({ leaf });
  const { props: rootProps } = useCommentLeaf(state);

  if (!state.commentCount) return <>{children}</>;

  let aboveChildren = <>{children}</>;

  if (!state.isActive) {
    for (let i = 1; i < state.commentCount; i++) {
      aboveChildren = <span className="bg-yellow/20">{aboveChildren}</span>;
    }
  }

  return (
    <PlateLeaf
      id={state.lastCommentId}
      {...props}
      className={cn(
        "border-b-2 border-b-primary/40",
        state.isActive ? "bg-yellow-400/40" : "bg-yellow-400/20",
        className
      )}
      nodeProps={{
        ...rootProps,
        ...nodeProps,
      }}
    >
      {aboveChildren}
    </PlateLeaf>
  );
}
