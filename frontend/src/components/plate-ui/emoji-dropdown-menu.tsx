import React from "react";
import { useEmojiDropdownMenuState } from "@udecode/plate-emoji/react";

import { Icons } from "../icons";

import { emojiCategoryIcons, emojiSearchIcons } from "./emoji-icons";
import { EmojiPicker } from "./emoji-picker";
import { EmojiToolbarDropdown } from "./emoji-toolbar-dropdown";
import { ToolbarButton } from "./toolbar";

import type { EmojiDropdownMenuOptions } from "@udecode/plate-emoji/react";

type EmojiDropdownMenuProps = {
  options?: EmojiDropdownMenuOptions;
} & React.ComponentPropsWithoutRef<typeof ToolbarButton>;

export function EmojiDropdownMenu({
  options,
  ...props
}: EmojiDropdownMenuProps) {
  const { emojiPickerState, isOpen, setIsOpen } =
    useEmojiDropdownMenuState(options);

  return (
    <EmojiToolbarDropdown
      control={
        <ToolbarButton isDropdown pressed={isOpen} tooltip="Emoji" {...props}>
          <Icons.emoji className="size-4" />
        </ToolbarButton>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <EmojiPicker
        {...emojiPickerState}
        icons={{
          categories: emojiCategoryIcons,
          search: emojiSearchIcons,
        }}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        settings={options?.settings}
      />
    </EmojiToolbarDropdown>
  );
}
