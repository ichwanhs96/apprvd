import { BaseEditor, Editor } from "slate";

export const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks = Editor.marks(editor) as Record<string, unknown> | null;
  return marks ? marks[format] === true : false;
};
