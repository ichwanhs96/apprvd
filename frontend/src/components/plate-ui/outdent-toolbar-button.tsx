// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import { withRef } from "@udecode/cn";
import { useOutdentButton } from "@udecode/plate-indent/react";

import { Icons } from "../icons";

import { ToolbarButton } from "./toolbar";

export const OutdentToolbarButton = withRef<typeof ToolbarButton>(
  (rest, ref) => {
    const { props } = useOutdentButton();

    return (
      <ToolbarButton ref={ref} tooltip="Outdent" {...props} {...rest}>
        <Icons.outdent />
      </ToolbarButton>
    );
  }
);
