// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React from "react";
import { someNode } from "@udecode/plate-common";
import {
  focusEditor,
  useEditorPlugin,
  useEditorSelector,
} from "@udecode/plate-common/react";
import { deleteTable, insertTableRow } from "@udecode/plate-table";
import {
  deleteColumn,
  deleteRow,
  insertTable,
  TablePlugin,
} from "@udecode/plate-table/react";

import { Icons, iconVariants } from "../icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";

import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

export function TableDropdownMenu(props: DropdownMenuProps) {
  const tableSelected = useEditorSelector(
    (editor) => someNode(editor, { match: { type: TablePlugin.key } }),
    []
  );

  const { editor, tf } = useEditorPlugin(TablePlugin);

  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton isDropdown pressed={openState.open} tooltip="Table">
          <Icons.table />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="flex w-[180px] min-w-0 flex-col gap-0.5"
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icons.table className={iconVariants({ variant: "menuItem" })} />
            <span>Table</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className="min-w-[180px]"
              onSelect={() => {
                insertTable(editor);
                focusEditor(editor);
              }}
            >
              <Icons.add className={iconVariants({ variant: "menuItem" })} />
              Insert table
            </DropdownMenuItem>
            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!tableSelected}
              onSelect={() => {
                deleteTable(editor);
                focusEditor(editor);
              }}
            >
              <Icons.trash className={iconVariants({ variant: "menuItem" })} />
              Delete table
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!tableSelected}>
            <Icons.column className={iconVariants({ variant: "menuItem" })} />
            <span>Column</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!tableSelected}
              onSelect={() => {
                tf.insert.tableColumn();
                focusEditor(editor);
              }}
            >
              <Icons.add className={iconVariants({ variant: "menuItem" })} />
              Insert column after
            </DropdownMenuItem>
            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!tableSelected}
              onSelect={() => {
                deleteColumn(editor);
                focusEditor(editor);
              }}
            >
              <Icons.minus className={iconVariants({ variant: "menuItem" })} />
              Delete column
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!tableSelected}>
            <Icons.row className={iconVariants({ variant: "menuItem" })} />
            <span>Row</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!tableSelected}
              onSelect={() => {
                insertTableRow(editor);
                focusEditor(editor);
              }}
            >
              <Icons.add className={iconVariants({ variant: "menuItem" })} />
              Insert row after
            </DropdownMenuItem>
            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!tableSelected}
              onSelect={() => {
                deleteRow(editor);
                focusEditor(editor);
              }}
            >
              <Icons.minus className={iconVariants({ variant: "menuItem" })} />
              Delete row
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
