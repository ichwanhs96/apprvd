// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import { withRef } from "@udecode/cn";
import {
  useToggleToolbarButton,
  useToggleToolbarButtonState,
} from "@udecode/plate-toggle/react";

import { Icons } from "../icons";

import { ToolbarButton } from "./toolbar";

export const ToggleToolbarButton = withRef<typeof ToolbarButton>(
  (rest, ref) => {
    const state = useToggleToolbarButtonState();
    const { props } = useToggleToolbarButton(state);

    return (
      <ToolbarButton ref={ref} tooltip="Toggle" {...props} {...rest}>
        <Icons.chevronDown />
      </ToolbarButton>
    );
  }
);
