// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from 'react';
import { cn, withRef } from '@udecode/cn';
import { PlateLeaf } from '@udecode/plate-common/react';

export const HighlightLeaf = withRef<typeof PlateLeaf>(
  ({ children, className, ...props }, ref) => (
    <PlateLeaf
      asChild
      className={cn('bg-yellow-400/20 text-inherit dark:bg-primary/40', className)}
      ref={ref}
      {...props}
    >
      <mark>{children}</mark>
    </PlateLeaf>
  )
);
