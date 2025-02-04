// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from 'react';
import * as Popover from '@radix-ui/react-popover';

import type { ReactNode } from 'react';

type EmojiToolbarDropdownProps = {
  children: ReactNode;
  control: ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function EmojiToolbarDropdown({
  children,
  control,
  isOpen,
  setIsOpen,
}: EmojiToolbarDropdownProps) {
  return (
    <Popover.Root onOpenChange={setIsOpen} open={isOpen}>
      <Popover.Trigger asChild>{control}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="z-[100]">{children}</Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
