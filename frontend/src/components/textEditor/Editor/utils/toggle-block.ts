import { BaseEditor, Editor, Element as SlateElement, Transforms } from "slate";
import {
  HIGHLIGHT_TYPES,
  LIST_TYPES,
  TEXT_ALIGN_TYPES,
} from "../constants/editor.constant";
import { isBlockActive } from "./is-block-active";

interface CustomElement extends SlateElement {
  type: string;
  align?: string;
  highlight?: string;
}

export const toggleBlock = (editor: BaseEditor, format: string) => {
  const isAlign = TEXT_ALIGN_TYPES.includes(format);
  const isHighlight = HIGHLIGHT_TYPES.includes(format);

  const isActive = isBlockActive(
    editor,
    format,
    isAlign ? "align" : isHighlight ? "highlight" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  if (!isAlign && !isHighlight) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes((n as CustomElement).type),
      split: true,
    });
  }

  const newProperties: Partial<CustomElement> = {};

  if (isAlign) {
    newProperties.align = isActive ? undefined : format;
  } else if (isHighlight) {
    newProperties.highlight = isActive ? undefined : format;
  } else {
    newProperties.type = isActive ? "paragraph" : isList ? "list-item" : format;
  }

  Transforms.setNodes<CustomElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
