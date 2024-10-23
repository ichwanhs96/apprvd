// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { withCn } from "@udecode/cn";

export const Avatar = withCn(
  AvatarPrimitive.Root,
  "relative flex size-10 shrink-0 overflow-hidden rounded-full"
);

export const AvatarImage = withCn(
  AvatarPrimitive.Image,
  "aspect-square size-full"
);

export const AvatarFallback = withCn(
  AvatarPrimitive.Fallback,
  "flex size-full items-center justify-center rounded-full bg-muted"
);
