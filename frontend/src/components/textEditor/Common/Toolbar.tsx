import { HTMLAttributes, PropsWithChildren, forwardRef } from "react";
import { css, cx } from "@emotion/css";
import { Menu } from "./Menu";

interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {}

export const Toolbar = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ToolbarProps>
>(({ className = "", ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        position: relative;
        padding: 8px;
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        align-items: center;
        border-radius: 10px 0 0 10px;
        background-color: white;
        margin: 10px;
        margin-bottom: 0;
        border-radius: 20px 20px 0 0;
        background-color: white;
        border-width: 1px;
        border-color: #e2e8f0;
      `
    )}
  />
));
