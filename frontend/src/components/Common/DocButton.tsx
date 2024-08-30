import React from 'react';
import { cx, css } from '@emotion/css';

interface ButtonProps extends React.HTMLProps<HTMLSpanElement> {
	active?: boolean;
	reversed?: boolean;
}

// Button element for all toolbar options
const Button = React.forwardRef<HTMLSpanElement, ButtonProps>(
	({ className, active, reversed, ...props }, ref) => (
		<span
			{...props}
			ref={ref}
			// emotion css to add custom style
			className={cx(
				className,
				css`
					cursor: pointer;
					color: ${reversed
						? active
							? 'white'
							: '#aaa'
						: active
						? '#344563'
						: '#ccc'};
				`
			)}
		/>
	)
);

export default Button;
