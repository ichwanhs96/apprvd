import { HTMLAttributes, PropsWithChildren, forwardRef } from "react";
import { css, cx } from "@emotion/css";

interface MenuProps extends HTMLAttributes<HTMLDivElement> {}

export const Menu = forwardRef<HTMLDivElement, PropsWithChildren<MenuProps>>(
  ({ className = "", ...props }, ref) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }

          /* & > * + * {
            margin-left: 15px;
          } */
        `
      )}
    />
  )
);
