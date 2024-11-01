// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from 'react';
import { withRef } from '@udecode/cn';
import { PlateElement } from '@udecode/plate-common/react';
import { useExcalidrawElement } from '@udecode/plate-excalidraw/react';

export const ExcalidrawElement = withRef<typeof PlateElement>(
  ({ nodeProps, ...props }, ref) => {
    const { children, element } = props;

    const { Excalidraw, excalidrawProps } = useExcalidrawElement({
      element,
    });

    return (
      <PlateElement ref={ref} {...props}>
        <div contentEditable={false}>
          <div className="h-[600px]">
            {Excalidraw && (
              <Excalidraw {...nodeProps} {...(excalidrawProps as any)} />
            )}
          </div>
        </div>
        {children}
      </PlateElement>
    );
  }
);
