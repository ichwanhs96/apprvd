// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from 'react';
import { cn, withRef } from '@udecode/cn';
import { PlateElement } from '@udecode/plate-common/react';
import { useFocused, useSelected } from 'slate-react';

export const HrElement = withRef<typeof PlateElement>(
  ({ className, nodeProps, ...props }, ref) => {
    const { children } = props;

    const selected = useSelected();
    const focused = useFocused();

    return (
      <PlateElement ref={ref} {...props}>
        <div className="py-6" contentEditable={false}>
          <hr
            {...nodeProps}
            className={cn(
              'h-0.5 cursor-pointer rounded-sm border-none bg-muted bg-clip-content',
              selected && focused && 'ring-2 ring-ring ring-offset-2',
              className
            )}
          />
        </div>
        {children}
      </PlateElement>
    );
  }
);
