import { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Toolbar } from "./Common/Toolbar";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdCode,
  MdFormatQuote,
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
} from "react-icons/md";

import { LuHeading1, LuHeading2 } from "react-icons/lu";
import { FaHighlighter } from "react-icons/fa";
import { css, cx } from "@emotion/css";
import { MarkButton, BlockButton, Element, Leaf } from "./Editor";
import { toggleMark } from "./Editor/utils/toggle-mark";
import { HOTKEYS } from "./Editor/constants/editor.constant";
import { CustomDescendant } from "./Editor/types";

const SlateEditor = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handleGetValue = () => {
    console.log(JSON.stringify(value));
  };

  return (
    <div>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(newValue) => setValue(newValue)}
        data-testid="di-sini"
      >
        <Toolbar>
          <MarkButton format="bold" icon={<MdFormatBold />} />
          <MarkButton format="italic" icon={<MdFormatItalic />} />
          <MarkButton format="underline" icon={<MdFormatUnderlined />} />
          <MarkButton format="code" icon={<MdCode />} />
          <BlockButton format="heading-one" icon={<LuHeading1 />} />
          <BlockButton format="heading-two" icon={<LuHeading2 />} />
          <BlockButton format="block-quote" icon={<MdFormatQuote />} />
          <BlockButton format="numbered-list" icon={<MdFormatListNumbered />} />
          <BlockButton format="bulleted-list" icon={<MdFormatListBulleted />} />
          <BlockButton format="left" icon={<MdFormatAlignLeft />} />
          <BlockButton format="center" icon={<MdFormatAlignCenter />} />
          <BlockButton format="right" icon={<MdFormatAlignRight />} />
          <BlockButton format="justify" icon={<MdFormatAlignJustify />} />
          <BlockButton
            format="yellow"
            icon={<FaHighlighter className="text-yellow-500" />}
          />
          <BlockButton
            format="red"
            icon={<FaHighlighter className="text-red-500" />}
          />
          <BlockButton
            format="green"
            icon={<FaHighlighter className="text-green-500" />}
          />
        </Toolbar>
        <Editable
          className={cx(
            css`
              padding: 18px 1px 18px 17px;
              background-color: white;
              margin: 0 10px;
              border-radius: 0 0 20px 20px;
              background-color: white;
              border-width: 1px;
              border-top-width: 0;
              border-color: #e2e8f0;
              height: calc(100vh - 88px - 20px - 62px);
              overflow-y: scroll;

              &:focus {
                outline: none;
                box-shadow: none;
              }
            `
          )}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
      <button onClick={handleGetValue}>Get Editor Value</button>
    </div>
  );
};

const initialValue: CustomDescendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: "bold", bold: true, underline: true },
      {
        text: ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },
  {
    type: "block-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    align: "center",
    children: [{ text: "Try it out for yourself!" }],
  },
];

// const initialValue: Descendant[] = [
//   {
//     type: "paragraph",
//     children: [
//       { text: "This is editable " },
//       { text: "rich", bold: true },
//       { text: " text, " },
//       { text: "much", italic: true },
//       { text: " better than a " },
//       { text: "<textarea>", code: true },
//       { text: "!" },
//     ],
//   },
//   {
//     type: "paragraph",
//     children: [
//       {
//         text: "Since it's rich text, you can do things like turn a selection of text ",
//       },
//       { text: "bold", bold: true, underline: true },
//       {
//         text: ", or add a semantically rendered block quote in the middle of the page, like this:",
//       },
//     ],
//   },
//   {
//     type: "block-quote",
//     children: [{ text: "A wise quote." }],
//   },
//   {
//     type: "paragraph",
//     align: "center",
//     children: [{ text: "Try it out for yourself!" }],
//   },
// ];

export default SlateEditor;
