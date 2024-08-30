import React from 'react';
import { cx, css } from '@emotion/css';

// element to use material icons in toolbar
const Icon = React.forwardRef<HTMLSpanElement, React.HTMLProps<HTMLSpanElement>>(({ className, ...props }, ref) => (
	<span
		{...props}
		ref={ref}
		className={cx(
			'material-icons',
			className,
			css`
				font-size: 18px;
				vertical-align: text-bottom;
			`
		)}
	/>
));

export default Icon;
