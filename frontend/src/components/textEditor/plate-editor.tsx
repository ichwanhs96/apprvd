// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import React, { useRef, useState, useEffect } from "react";
import { cn, withProps } from "@udecode/cn";
import { AlignPlugin } from "@udecode/plate-alignment/react";
import { AutoformatPlugin } from "@udecode/plate-autoformat/react";
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { ExitBreakPlugin, SoftBreakPlugin } from "@udecode/plate-break/react";
import { CaptionPlugin } from "@udecode/plate-caption/react";
import {
  isCodeBlockEmpty,
  isSelectionAtCodeBlockStart,
  unwrapCodeBlock,
} from "@udecode/plate-code-block";
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from "@udecode/plate-code-block/react";
import { CommentsPlugin } from "@udecode/plate-comments/react";
import { TComment } from "@udecode/plate-comments"
import {
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  someNode,
} from "@udecode/plate-common";
import {
  createPlateEditor,
  ParagraphPlugin,
  Plate,
  PlateElement,
  PlateLeaf,
} from "@udecode/plate-common/react";
import { DndPlugin } from "@udecode/plate-dnd";
import { DocxPlugin } from "@udecode/plate-docx";
import { EmojiPlugin } from "@udecode/plate-emoji/react";
import { ExcalidrawPlugin } from "@udecode/plate-excalidraw/react";
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from "@udecode/plate-font/react";
import { HEADING_KEYS, HEADING_LEVELS } from "@udecode/plate-heading";
import { HeadingPlugin } from "@udecode/plate-heading/react";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { IndentListPlugin } from "@udecode/plate-indent-list/react";
import { IndentPlugin } from "@udecode/plate-indent/react";
import { JuicePlugin } from "@udecode/plate-juice";
import { KbdPlugin } from "@udecode/plate-kbd/react";
import { LineHeightPlugin } from "@udecode/plate-line-height/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import { BulletedListPlugin, ListItemPlugin, ListPlugin, NumberedListPlugin, TodoListPlugin } from "@udecode/plate-list/react";
import { MarkdownPlugin } from "@udecode/plate-markdown";
import { ImagePlugin, MediaEmbedPlugin } from "@udecode/plate-media/react";
import {
  MentionInputPlugin,
  MentionPlugin,
} from "@udecode/plate-mention/react";
import { NodeIdPlugin } from "@udecode/plate-node-id";
import { ResetNodePlugin } from "@udecode/plate-reset-node/react";
import { SelectOnBackspacePlugin } from "@udecode/plate-select";
import { BlockSelectionPlugin } from "@udecode/plate-selection/react";
import { TabbablePlugin } from "@udecode/plate-tabbable/react";
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from "@udecode/plate-table/react";
import { TrailingBlockPlugin } from "@udecode/plate-trailing-block";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { autoformatRules } from "../../lib/plate/autoformat-rules";
import { BlockquoteElement } from "../plate-ui/blockquote-element";
import { CodeBlockElement } from "../plate-ui/code-block-element";
import { CodeLeaf } from "../plate-ui/code-leaf";
import { CodeLineElement } from "../plate-ui/code-line-element";
import { CodeSyntaxLeaf } from "../plate-ui/code-syntax-leaf";
import { CommentLeaf } from "../plate-ui/comment-leaf";
import { CommentsPopover } from "../plate-ui/comments-popover";
import {
  CursorOverlay,
  DragOverCursorPlugin,
} from "../plate-ui/cursor-overlay";
import { Editor } from "../plate-ui/editor";
import { ExcalidrawElement } from "../plate-ui/excalidraw-element";
import { FixedToolbar } from "../plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "../plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "../plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "../plate-ui/floating-toolbar-buttons";
import { HeadingElement } from "../plate-ui/heading-element";
import { HighlightLeaf } from "../plate-ui/highlight-leaf";
import { HrElement } from "../plate-ui/hr-element";
import { ImageElement } from "../plate-ui/image-element";
import { KbdLeaf } from "../plate-ui/kbd-leaf";
import { LinkElement } from "../plate-ui/link-element";
import { LinkFloatingToolbar } from "../plate-ui/link-floating-toolbar";
import { MediaEmbedElement } from "../plate-ui/media-embed-element";
import { MentionElement } from "../plate-ui/mention-element";
import { MentionInputElement } from "../plate-ui/mention-input-element";
import { ParagraphElement } from "../plate-ui/paragraph-element";
import { withPlaceholders } from "../plate-ui/placeholder";
import {
  TableCellElement,
  TableCellHeaderElement,
} from "../plate-ui/table-cell-element";
import { TableElement } from "../plate-ui/table-element";
import { TableRowElement } from "../plate-ui/table-row-element";
import { TodoListElement } from "../plate-ui/todo-list-element";
import { withDraggables } from "../plate-ui/with-draggables";
import { useContracts, useCurrentDocId, useEditorComments } from "../../store"
import { ListElement } from "../plate-ui/list-element";

import { useEditorContent } from "../../store";
import { toast } from "react-toastify";

export default function PlateEditor({ editor }: { editor: any }) {
  const containerRef = useRef(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { id } = useCurrentDocId()
  // const { updated } = useContracts()
  
  const toastError = () => {
    toast.error('Error: Something went wrong!', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }
  const handleTyping = () => {
    if(typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
    }

    typingTimerRef.current = setTimeout(() => {
      useContracts.setState({ updated: new Date().toISOString() })
    }, 10000)
  }

  const STORAGE_KEY = 'editor-content';

  const [value, setValue] = useState(null);

  useEffect(() => {
    if (value !== null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); // update local storage every change in editor
      useEditorContent.setState({ editor_content: JSON.stringify(value) }) // update zustand storage
    }

    const intervalId = setInterval(async () => {
      let previousValue = value; // Store the previous value
      if(value === null){
        return
      }
      const storedValue = localStorage.getItem(STORAGE_KEY);
      // const storedValue = editor_content
      if (storedValue && storedValue !== JSON.stringify(previousValue)) {
        previousValue = JSON.parse(storedValue); // Update previous value

        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/document/${id}/content`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(value), // Send the whole document
          });
        } catch (error) {
          toastError()
          throw new Error('Error updating document');
        }
      }
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [value]);

  const persistChange = (newValue: any) => {
    setValue(newValue.value);
    handleTyping();
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onChange={persistChange}>
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

export const InitiatePlateEditor = (initialValue: any, userInfo: any, doc_id: any): any => {
  const editor = createPlateEditor({
    plugins: [
      // Nodes
      HeadingPlugin,
      BlockquotePlugin,
      CodeBlockPlugin,
      CodeLinePlugin,
      CodeSyntaxPlugin,
      HorizontalRulePlugin,
      LinkPlugin.configure({
        render: { afterEditable: () => <LinkFloatingToolbar /> },
      }),
      ImagePlugin,
      MediaEmbedPlugin,
      CaptionPlugin.configure({
        options: { plugins: [ImagePlugin, MediaEmbedPlugin] },
      }),
      MentionPlugin,
      MentionInputPlugin,
      TablePlugin,
      TableRowPlugin,
      TableCellPlugin,
      TableCellHeaderPlugin,
      TodoListPlugin,
      ExcalidrawPlugin,

      // Marks
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      StrikethroughPlugin,
      CodePlugin,
      SubscriptPlugin,
      SuperscriptPlugin,
      FontColorPlugin,
      FontBackgroundColorPlugin,
      FontSizePlugin,
      HighlightPlugin,
      KbdPlugin,
      ListPlugin,
      ListItemPlugin,
      NumberedListPlugin,
      BulletedListPlugin,

      // Block Style
      AlignPlugin.configure({
        inject: {
          targetPlugins: [ParagraphPlugin.key, ...HEADING_LEVELS],
        },
      }),
      IndentPlugin.configure({
        inject: {
          targetPlugins: [
            ParagraphPlugin.key,
            BlockquotePlugin.key,
            CodeBlockPlugin.key,
            ...HEADING_LEVELS,
          ],
        },
      }),
      IndentListPlugin.configure({
        inject: {
          targetPlugins: [
            ParagraphPlugin.key,
            BlockquotePlugin.key,
            CodeBlockPlugin.key,
            ...HEADING_LEVELS,
          ],
        },
      }),
      LineHeightPlugin.configure({
        inject: {
          nodeProps: {
            defaultNodeValue: 1.5,
            validNodeValues: [1, 1.2, 1.5, 2, 3],
          },
          targetPlugins: [ParagraphPlugin.key, ...HEADING_LEVELS],
        },
      }),

      // Functionality
      AutoformatPlugin.configure({
        options: {
          rules: autoformatRules,
          enableUndoOnDelete: true,
        },
      }),
      BlockSelectionPlugin,
      DndPlugin.configure({
        options: { enableScroller: true },
      }),
      EmojiPlugin,
      ExitBreakPlugin.configure({
        options: {
          rules: [
            {
              hotkey: "mod+enter",
            },
            {
              hotkey: "mod+shift+enter",
              before: true,
            },
            {
              hotkey: "enter",
              query: {
                start: true,
                end: true,
                allow: HEADING_LEVELS,
              },
              relative: true,
              level: 1,
            },
          ],
        },
      }),
      NodeIdPlugin,
      ResetNodePlugin.configure({
        options: {
          rules: [
            {
              types: [BlockquotePlugin.key, TodoListPlugin.key],
              defaultType: ParagraphPlugin.key,
              hotkey: "Enter",
              predicate: isBlockAboveEmpty,
            },
            {
              types: [BlockquotePlugin.key, TodoListPlugin.key],
              defaultType: ParagraphPlugin.key,
              hotkey: "Backspace",
              predicate: isSelectionAtBlockStart,
            },
            {
              types: [CodeBlockPlugin.key],
              defaultType: ParagraphPlugin.key,
              onReset: unwrapCodeBlock,
              hotkey: "Enter",
              predicate: isCodeBlockEmpty,
            },
            {
              types: [CodeBlockPlugin.key],
              defaultType: ParagraphPlugin.key,
              onReset: unwrapCodeBlock,
              hotkey: "Backspace",
              predicate: isSelectionAtCodeBlockStart,
            },
          ],
        },
      }),
      SelectOnBackspacePlugin.configure({
        options: {
          query: {
            allow: [ImagePlugin.key, HorizontalRulePlugin.key],
          },
        },
      }),
      SoftBreakPlugin.configure({
        options: {
          rules: [
            { hotkey: "shift+enter" },
            {
              hotkey: "enter",
              query: {
                allow: [
                  CodeBlockPlugin.key,
                  BlockquotePlugin.key,
                  TableCellPlugin.key,
                  TableCellHeaderPlugin.key,
                ],
              },
            },
          ],
        },
      }),
      TabbablePlugin.configure(({ editor }) => ({
        options: {
          query: () => {
            if (isSelectionAtBlockStart(editor)) return false;

            return !someNode(editor, {
              match: (n) => {
                return !!(
                  n.type &&
                  ([
                    TablePlugin.key,
                    TodoListPlugin.key,
                    CodeBlockPlugin.key,
                  ].includes(n.type as string) ||
                    n.listStyleType)
                );
              },
            });
          },
        },
      })),
      TrailingBlockPlugin.configure({
        options: { type: ParagraphPlugin.key },
      }),
      DragOverCursorPlugin,

      // Collaboration
      CommentsPlugin.configure({
        options: {
          // TODO: store the comments into a proper storage i.e. database
          comments: (() => { // This is the part where comment are loaded every page reload
            const comments = initialValue.comments;
            const parsedComments: Record<string, TComment> = comments.length > 0 
                ? comments.reduce((acc: Record<string, TComment>, comment: TComment) => {
                    acc[comment.id] = comment;
                    return acc;
                }, {})
                : {};
            // reset comments every editor reload
            localStorage.setItem("editor-comments", JSON.stringify(comments));
            useEditorComments.setState({editor_comments: JSON.stringify(comments)})
            return parsedComments;
          })() as Record<string, TComment>, // Immediately invoke the function and assert the type
          // TODO: update based on users profile
          users: {
            1: {
              id: userInfo?.providerId || 'default-id',
              name: userInfo?.displayName || 'apprvd user',
              avatarUrl:
                userInfo?.photoURL || 'https://avatars.githubusercontent.com/u/19695832?s=96&v=4',
            },
          },
          myUserId: "1",
          onCommentAdd: ((val: any) => {
            // const { editor_comments } = useEditorComments()
            let comments = localStorage.getItem("editor-comments");
            // let comments = editor_comments
            const parsedComments: Record<string, TComment>[] = comments ? JSON.parse(comments) : [];
            parsedComments.push(val); // Append the new comment object
            localStorage.setItem(
              "editor-comments",
              JSON.stringify(parsedComments) // Store the updated array
            );
            useEditorComments.setState({editor_comments: JSON.stringify(parsedComments)})

            // New HTTP PATCH function to update comments on the backend
            const updateCommentsOnBackend = async () => {
              try {
                await fetch(`${import.meta.env.VITE_BACKEND_URL}/document/${doc_id}/comment`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(parsedComments), // Use parsedComments as payload
                });
              } catch (error) {
                const toastError = () => {
                  toast.error('Error: Something went wrong!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                }
                toastError()
                console.error('Error updating comments:', error);
              }
            };

            updateCommentsOnBackend(); // Call the function to update comments
          }),
        },
      }),

      // Deserialization
      DocxPlugin,
      MarkdownPlugin,
      JuicePlugin,
      MarkdownPlugin,
    ],
    override: {
      components: withDraggables(
        withPlaceholders({
          [BlockquotePlugin.key]: BlockquoteElement,
          [CodeBlockPlugin.key]: CodeBlockElement,
          [CodeLinePlugin.key]: CodeLineElement,
          [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
          [HorizontalRulePlugin.key]: HrElement,
          [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: "h1" }),
          [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: "h2" }),
          [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: "h3" }),
          [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: "h4" }),
          [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: "h5" }),
          [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: "h6" }),
          [ImagePlugin.key]: ImageElement,
          [LinkPlugin.key]: LinkElement,
          [MediaEmbedPlugin.key]: MediaEmbedElement,
          [MentionPlugin.key]: MentionElement,
          [MentionInputPlugin.key]: MentionInputElement,
          [ParagraphPlugin.key]: ParagraphElement,
          [TablePlugin.key]: TableElement,
          [TableRowPlugin.key]: TableRowElement,
          [TableCellPlugin.key]: TableCellElement,
          [TableCellHeaderPlugin.key]: TableCellHeaderElement,
          [TodoListPlugin.key]: TodoListElement,
          [ExcalidrawPlugin.key]: ExcalidrawElement,
          [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
          [CodePlugin.key]: CodeLeaf,
          [HighlightPlugin.key]: HighlightLeaf,
          [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
          [KbdPlugin.key]: KbdLeaf,
          [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
          [SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
          [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
          [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
          [CommentsPlugin.key]: CommentLeaf,
          [BulletedListPlugin.key]: withProps(ListElement, { variant: 'ul' }),
          [ListItemPlugin.key]: withProps(PlateElement, { as: 'li' }),
          [NumberedListPlugin.key]: withProps(ListElement, { variant: 'ol' }),    
        })
      ),
    },
    value: initialValue.contents
  });

  return editor;
};
