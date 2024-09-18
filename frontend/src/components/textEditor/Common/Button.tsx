import { HTMLAttributes, PropsWithChildren, forwardRef } from "react";
import { css, cx } from "@emotion/css";

interface ButtonProps extends HTMLAttributes<HTMLSpanElement> {
  active: boolean;
  reversed?: boolean;
}

export const Button = forwardRef<
  HTMLSpanElement,
  PropsWithChildren<ButtonProps>
>(({ className = "", active, reversed, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        cursor: pointer;
        color: ${reversed
          ? active
            ? "white"
            : "#aaa"
          : active
          ? "black"
          : "#ccc"};
      `
    )}
  />
));
