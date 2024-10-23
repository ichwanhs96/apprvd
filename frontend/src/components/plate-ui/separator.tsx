// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { withProps, withVariants } from "@udecode/cn";
import { cva } from "class-variance-authority";

const separatorVariants = cva("shrink-0 bg-border", {
  defaultVariants: {
    orientation: "horizontal",
  },
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
});

export const Separator = withVariants(
  withProps(SeparatorPrimitive.Root, {
    decorative: true,
    orientation: "horizontal",
  }),
  separatorVariants
);
