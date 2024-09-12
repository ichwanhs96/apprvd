import { RenderLeafProps } from "slate-react";

interface CustomLeaf {
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  underline?: boolean;
  highlight?: boolean;
}

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const customLeaf = leaf as CustomLeaf; // Cast leaf to CustomLeaf

  if (customLeaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (customLeaf.code) {
    children = <code>{children}</code>;
  }

  if (customLeaf.italic) {
    children = <em>{children}</em>;
  }

  if (customLeaf.underline) {
    children = <u>{children}</u>;
  }

  if (customLeaf.highlight) {
    children = <span style={{ backgroundColor: "red" }}>{children}</span>;
  }

  return <span {...attributes}>{children}</span>;
};
