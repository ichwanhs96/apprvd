// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React, { useRef, useState } from "react";
import { cn } from "@udecode/cn";
import { Plate } from "@udecode/plate-common/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { CommentsPopover } from "../plate-ui/comments-popover";
import { CursorOverlay } from "../plate-ui/cursor-overlay";
import { Editor } from "../plate-ui/editor";
import { FixedToolbar } from "../plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "../plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "../plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "../plate-ui/floating-toolbar-buttons";

export default function PlateEditor({ editor }: { editor: any }) {
  const containerRef = useRef(null);

  console.log(JSON.stringify(editor.children, null, 2));

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <div
          ref={containerRef}
          className={cn(
            "relative",
            // Block selection
            "[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4"
          )}
        >
          <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>

          <Editor
            className="px-[96px] py-16"
            autoFocus
            focusRing={false}
            variant="ghost"
            size="md"
          />

          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>

          <CommentsPopover />

          <CursorOverlay containerRef={containerRef} />
        </div>
      </Plate>
    </DndProvider>
  );
}
