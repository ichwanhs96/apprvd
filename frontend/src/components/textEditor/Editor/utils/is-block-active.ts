import { BaseEditor, Editor, Element as SlateElement, Range } from "slate";

interface CustomElement extends SlateElement {
  type: string;
  align?: string;
  highlight?: string;
}

export const isBlockActive = (
  editor: BaseEditor,
  format: string,
  blockType: "type" | "align" | "highlight" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection) as Range,
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as CustomElement)[blockType] === format,
    })
  );

  return !!match;
};
