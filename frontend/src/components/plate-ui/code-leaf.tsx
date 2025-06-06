// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import { cn, withRef } from "@udecode/cn";
import { PlateLeaf } from "@udecode/plate-common/react";

export const CodeLeaf = withRef<typeof PlateLeaf>(
  ({ children, className, ...props }, ref) => {
    return (
      <PlateLeaf
        asChild
        className={cn(
          "whitespace-pre-wrap rounded-md bg-muted px-[0.3em] py-[0.2em] font-mono text-sm",
          className
        )}
        ref={ref}
        {...props}
      >
        <code>{children}</code>
      </PlateLeaf>
    );
  }
);
