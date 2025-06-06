// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from 'react';
import { cn, withRef } from '@udecode/cn';
import { PlateElement, useElement } from '@udecode/plate-common/react';
import { useLink } from '@udecode/plate-link/react';

import type { TLinkElement } from '@udecode/plate-link';

export const LinkElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    const element = useElement<TLinkElement>();
    const { props: linkProps } = useLink({ element });

    return (
      <PlateElement
        asChild
        className={cn(
          'font-medium text-primary underline decoration-primary underline-offset-4',
          className
        )}
        ref={ref}
        {...(linkProps as any)}
        {...props}
      >
        <a>{children}</a>
      </PlateElement>
    );
  }
);
