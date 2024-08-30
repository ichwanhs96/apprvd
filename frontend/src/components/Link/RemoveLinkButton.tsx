import React from 'react';
import { isLinkActive, unwrapLink } from './linkUtilFunctions';
import { useSlate } from 'slate-react';
import Button from '../Common/DocButton';
import Icon from '../Common/DocIcon';

interface RemoveLinkButtonProps {
	title: string
}

// to render a different button to remove the link from the editor
const RemoveLinkButton: React.FC<RemoveLinkButtonProps> = ({ title }) => {
	const editor = useSlate();

	return (
		<Button
			title={title}
			active={isLinkActive(editor)}
			onMouseDown={(event) => {
				if (isLinkActive(editor)) {
					unwrapLink(editor);
				}
			}}>
			<Icon>link_off</Icon>
		</Button>
	);
};

export default RemoveLinkButton;
