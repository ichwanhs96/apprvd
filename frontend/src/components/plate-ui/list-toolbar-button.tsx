// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import { withRef } from "@udecode/cn";
import {
  BulletedListPlugin,
  useListToolbarButton,
  useListToolbarButtonState,
} from "@udecode/plate-list/react";

import { Icons } from "../icons";

import { ToolbarButton } from "./toolbar";

export const ListToolbarButton = withRef<
  typeof ToolbarButton,
  {
    nodeType?: string;
  }
>(({ nodeType = BulletedListPlugin.key, ...rest }, ref) => {
  const state = useListToolbarButtonState({ nodeType });
  const { props } = useListToolbarButton(state);

  return (
    <ToolbarButton
      ref={ref}
      tooltip={
        nodeType === BulletedListPlugin.key ? "Bulleted List" : "Numbered List"
      }
      {...props}
      {...rest}
    >
      {nodeType === BulletedListPlugin.key ? <Icons.ul /> : <Icons.ol />}
    </ToolbarButton>
  );
});
