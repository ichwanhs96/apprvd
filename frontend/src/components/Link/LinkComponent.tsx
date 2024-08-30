import React from 'react';
import { useSelected } from 'slate-react';
import { css } from '@emotion/css';

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix: React.FC = () => (
	<span
		contentEditable={false}
		className={css`
			font-size: 0;
		`}>
		${String.fromCodePoint(160) /* Non-breaking space */}
	</span>
);

// a link component to render when link is added to editor
interface LinkComponentProps {
	attributes: React.HTMLAttributes<HTMLAnchorElement>;
	children: React.ReactNode;
	element: { url: string };
}

export const LinkComponent: React.FC<LinkComponentProps> = ({ attributes, children, element }) => {
	const selected = useSelected();
	return (
		<a
			{...attributes}
			href={element.url}
			className={
				selected
					? css`
							text-decoration: underline;
							cursor: pointer;
					  `
					: ''
			}>
			<InlineChromiumBugfix />
			{children}
			<InlineChromiumBugfix />
		</a>
	);
};
