// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import { withRef } from "@udecode/cn";
import { ListStyleType } from "@udecode/plate-indent-list";
import {
  useIndentListToolbarButton,
  useIndentListToolbarButtonState,
} from "@udecode/plate-indent-list/react";

import { Icons } from "../icons";

import { ToolbarButton } from "./toolbar";

export const IndentListToolbarButton = withRef<
  typeof ToolbarButton,
  {
    nodeType?: ListStyleType;
  }
>(({ nodeType = ListStyleType.Disc }, ref) => {
  const state = useIndentListToolbarButtonState({ nodeType });
  const { props } = useIndentListToolbarButton(state);

  return (
    <ToolbarButton
      ref={ref}
      tooltip={
        nodeType === ListStyleType.Disc ? "Bulleted List" : "Numbered List"
      }
      {...props}
    >
      {nodeType === ListStyleType.Disc ? <Icons.ul /> : <Icons.ol />}
    </ToolbarButton>
  );
});
