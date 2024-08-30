import React from 'react';
import { useSlate } from 'slate-react';
import { Editor, Element as SlateElement } from 'slate';
import Button from '../Common/DocButton';
import Icon from '../Common/DocIcon';

interface MarkButtonProps {
    format: string;
    icon: React.ReactNode;
    title: string;
}

export const MarkButton: React.FC<MarkButtonProps> = ({ format, icon, title }) => {
	const editor = useSlate();
	return (
		<Button
			title={title}
			active={isMarkActive(editor, format)}
			onMouseDown={(event) => {
				event.preventDefault();
				toggleMark(editor, format);
			}}>
			<Icon>{icon}</Icon>
		</Button>
	);
};

// to control the toggling of the mark level buttons
export const toggleMark = (editor: Editor, format: string) => {
	let runMarks = Editor.marks(editor);
	let parMarks = getParMarks(editor);
	let runMark = runMarks[format];
	let parMark = parMarks[format];
	if (runMark === true) {
		if (parMark) {
			Editor.addMark(editor, format, false);
		} else {
			Editor.removeMark(editor, format);
		}
	} else if (runMark === false) {
		if (parMark) {
			Editor.removeMark(editor, format);
		} else {
			Editor.addMark(editor, format, true);
		}
	} else {
		if (parMark) {
			Editor.addMark(editor, format, false);
		} else {
			Editor.addMark(editor, format, true);
		}
	}
};

function getParMarks(editor: Editor) {
	let marks: Record<string, boolean> = {};
	let { selection } = editor;
	if (selection) {
		const [match] = Editor.nodes(editor, {
				at: Editor.unhangRange(editor, selection),
				match: (n) =>
					!Editor.isEditor(n) &&
					SlateElement.isElement(n) &&
					Editor.isBlock(editor, n),
			}
		);
		if (match) {
			let type = editor.typeConv(match[0].type);
			marks = editor.getFont(type);
			//console.log('match node', match, marks);
		}
	}
	return marks;
}

// check if mark button is toggled currently
export const isMarkActive = (editor: Editor, format: string) => {
	let runMarks = Editor.marks(editor);
	let parMarks = getParMarks(editor);
	let marks = Object.assign({}, parMarks, runMarks);
	//console.log('runMarks', runMarks);
	//console.log('parMarks', parMarks);
	//console.log('combined marks', marks);
	return marks ? marks[format] === true : false;
};