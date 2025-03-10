// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { useEditorReadOnly } from "@udecode/plate-common/react";
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
} from "@udecode/plate-font/react";
import { ListStyleType } from "@udecode/plate-indent-list";
import { ImagePlugin } from "@udecode/plate-media/react";

import { Icons, iconVariants } from "../icons";
import { AlignDropdownMenu } from "../plate-ui/align-dropdown-menu";
import { CommentToolbarButton } from "../plate-ui/comment-toolbar-button";
import { EmojiDropdownMenu } from "../plate-ui/emoji-dropdown-menu";
import { IndentListToolbarButton } from "../plate-ui/indent-list-toolbar-button";
import { IndentToolbarButton } from "../plate-ui/indent-toolbar-button";
import { LineHeightDropdownMenu } from "../plate-ui/line-height-dropdown-menu";
import { LinkToolbarButton } from "../plate-ui/link-toolbar-button";
import { MediaToolbarButton } from "../plate-ui/media-toolbar-button";
import { MoreDropdownMenu } from "../plate-ui/more-dropdown-menu";
import { OutdentToolbarButton } from "../plate-ui/outdent-toolbar-button";
import { TableDropdownMenu } from "../plate-ui/table-dropdown-menu";

import { ColorDropdownMenu } from "./color-dropdown-menu";
import { InsertDropdownMenu } from "./insert-dropdown-menu";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ModeDropdownMenu } from "./mode-dropdown-menu";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";
import { ExportToolbarButton } from "./export-toolbar-button";

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <div className="w-full overflow-x-scroll scrollbar-hidden">
      {/* <div className="w-full overflow-hidden"> */}
      <div
        className="flex"
        // className="flex flex-wrap"
        style={{
          transform: "translateX(calc(-1px))",
        }}
      >
        {!readOnly && (
          <>
            <ToolbarGroup noSeparator>
              <InsertDropdownMenu />
              <TurnIntoDropdownMenu />
            </ToolbarGroup>

            <ToolbarGroup>
              <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
                <Icons.bold />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={ItalicPlugin.key}
                tooltip="Italic (⌘+I)"
              >
                <Icons.italic />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={UnderlinePlugin.key}
                tooltip="Underline (⌘+U)"
              >
                <Icons.underline />
              </MarkToolbarButton>

              <MarkToolbarButton
                nodeType={StrikethroughPlugin.key}
                tooltip="Strikethrough (⌘+⇧+M)"
              >
                <Icons.strikethrough />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
                <Icons.code />
              </MarkToolbarButton>
            </ToolbarGroup>

            <ToolbarGroup>
              <ColorDropdownMenu
                nodeType={FontColorPlugin.key}
                tooltip="Text Color"
              >
                <Icons.color className={iconVariants({ variant: "toolbar" })} />
              </ColorDropdownMenu>
              <ColorDropdownMenu
                nodeType={FontBackgroundColorPlugin.key}
                tooltip="Highlight Color"
              >
                <Icons.bg className={iconVariants({ variant: "toolbar" })} />
              </ColorDropdownMenu>
            </ToolbarGroup>

            <ToolbarGroup>
              <AlignDropdownMenu />

              <LineHeightDropdownMenu />

              <IndentListToolbarButton nodeType={ListStyleType.Disc} />
              <IndentListToolbarButton nodeType={ListStyleType.Decimal} />

              <OutdentToolbarButton />
              <IndentToolbarButton />
            </ToolbarGroup>

            <ToolbarGroup>
              <ExportToolbarButton />
              <LinkToolbarButton />

              <MediaToolbarButton nodeType={ImagePlugin.key} />

              <TableDropdownMenu />

              <EmojiDropdownMenu />

              <MoreDropdownMenu />
            </ToolbarGroup>
          </>
        )}

        <div className="grow" />

        <ToolbarGroup noSeparator>
          <CommentToolbarButton />
          <ModeDropdownMenu />
        </ToolbarGroup>
      </div>
    </div>
  );
}
