import React from 'react';
import {useSlate} from 'slate-react';
import {FontConv} from '../../services/docx/fontConv';

interface LeafProps {
	attributes: any; // Replace 'any' with the appropriate type
	children: React.ReactNode;
	leaf: any;
}

const Leaf: React.FC<LeafProps> = ({ attributes, children, leaf }) => {
	let font = leaf;
	let parent = (children as any).props.parent;
	if(parent){
		let editor = useSlate();
		let type = editor.typeConv(parent.type);
		let parFont = editor.getFont(type);
		font = Object.assign({}, parFont, leaf);
	}
	if(font.strike) {
		children = <s>{children}</s>;
	}
	if(font.superscript){
		children = <sup>{children}</sup>;
	}
	if(font.subscript){
		children = <sub>{children}</sub>;
	}
	let style = FontConv.toStyleObj(font);
	if(Object.keys(style).length>0){
		return <span style={style} {...attributes}>{children}</span>;
	}
	return <span {...attributes}>{children}</span>;
};

export default Leaf;
