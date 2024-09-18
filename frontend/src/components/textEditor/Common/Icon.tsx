import { PropsWithChildren, forwardRef } from "react";
import { css, cx } from "@emotion/css";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Icon = forwardRef<HTMLSpanElement, PropsWithChildren<IconProps>>(
  ({ className = "", ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        "material-icons",
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
        `
      )}
    />
  )
);
