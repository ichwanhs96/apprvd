// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import {
  useColorsCustom,
  useColorsCustomState,
} from "@udecode/plate-font/react";

import { buttonVariants } from "./button";
import { ColorDropdownMenuItems } from "./color-dropdown-menu-items";
import { ColorInput } from "./color-input";
import { DropdownMenuItem } from "./dropdown-menu";

import type { TColor } from "./color-dropdown-menu";

type ColorsCustomProps = {
  color?: string;
  colors: TColor[];
  customColors: TColor[];
  updateColor: (color: string) => void;
  updateCustomColor: (color: string) => void;
};

export function ColorsCustom({
  color,
  colors,
  customColors,
  updateColor,
  updateCustomColor,
}: ColorsCustomProps) {
  const state = useColorsCustomState({
    color,
    colors,
    customColors,
    updateCustomColor,
  });
  const { inputProps, menuItemProps } = useColorsCustom(state);

  return (
    <div className="flex flex-col gap-4">
      <ColorInput {...inputProps}>
        <DropdownMenuItem
          className={buttonVariants({
            isMenu: true,
            variant: "outline",
          })}
          {...menuItemProps}
        >
          CUSTOM
        </DropdownMenuItem>
      </ColorInput>

      <ColorDropdownMenuItems
        color={color}
        colors={state.computedColors}
        updateColor={updateColor}
      />
    </div>
  );
}
