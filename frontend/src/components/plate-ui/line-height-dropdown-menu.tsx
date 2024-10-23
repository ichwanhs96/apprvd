// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import {
  useLineHeightDropdownMenu,
  useLineHeightDropdownMenuState,
} from "@udecode/plate-line-height/react";

import { Icons } from "../icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";

import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

export function LineHeightDropdownMenu({ ...props }: DropdownMenuProps) {
  const openState = useOpenState();
  const state = useLineHeightDropdownMenuState();
  const { radioGroupProps } = useLineHeightDropdownMenu(state);

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          isDropdown
          pressed={openState.open}
          tooltip="Line height"
        >
          <Icons.lineHeight />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-0">
        <DropdownMenuRadioGroup
          className="flex flex-col gap-0.5"
          {...radioGroupProps}
        >
          {state.values.map((_value) => (
            <DropdownMenuRadioItem
              className="min-w-[180px]"
              key={_value}
              value={_value}
            >
              {_value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
