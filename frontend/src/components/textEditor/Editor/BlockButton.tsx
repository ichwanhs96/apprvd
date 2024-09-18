import { ReactNode } from "react";
import { useSlate } from "slate-react";
import { Button } from "../Common/Button";
import { isBlockActive } from "./utils/is-block-active";
import { Icon } from "../Common/Icon";
import { HIGHLIGHT_TYPES, TEXT_ALIGN_TYPES } from "./constants/editor.constant";
import { toggleBlock } from "./utils/toggle-block";

export const BlockButton = ({
  format,
  icon,
}: {
  format: string;
  icon: ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format)
          ? "align"
          : HIGHLIGHT_TYPES.includes(format)
          ? "highlight"
          : "type"
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};
