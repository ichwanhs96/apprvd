import React, { ForwardRefRenderFunction } from 'react';
import Menu from '../Common/DocMenu';
import '../../styles/toolbar.css';
import { cx, css } from '@emotion/css';

// Define props type
interface ToolbarProps extends React.ComponentPropsWithoutRef<'div'> {
	className?: string;
}

// toolbar menu with custom styling
const Toolbar: ForwardRefRenderFunction<HTMLDivElement, ToolbarProps> = ({ className, ...props }, ref) => (
	<Menu
		{...props}
		ref={ref}
		className={cx(
			className,
			'toolbar',
			css`
				position: relative;
				padding: 1em;
				margin: 0;
				border-bottom: 2px solid #eee;
				margin-bottom: 20px;
			`
		)}
	/>
);

export default React.forwardRef(Toolbar);