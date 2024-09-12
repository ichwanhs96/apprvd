import { useSlate } from "slate-react";
import { Button } from "../Common/Button";
import { Icon } from "../Common/Icon";
import { ReactNode } from "react";
import { isMarkActive } from "./utils/is-mark-active";
import { toggleMark } from "./utils/toggle-mark";

export const MarkButton = ({
  format,
  icon,
}: {
  format: string;
  icon: ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};
