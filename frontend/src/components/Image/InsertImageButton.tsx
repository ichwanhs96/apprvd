import React from 'react';
import { useSlateStatic, BaseEditor } from 'slate-react';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import { Transforms, Editor } from 'slate';

import Button from '../Common/DocButton';
import Icon from '../Common/DocIcon';

// wrapper function to mempize editor with images
export const withImages = (editor: BaseEditor) => {
	const { insertData, isVoid } = editor;

	editor.isVoid = (element) => {
		return element.type === 'image' ? true : isVoid(element);
	};

	editor.insertData = (data: DataTransfer) => {
		const text = data.getData('text/plain');
		const { files } = data;

		if (files && files.length > 0) {
			for (const file of files) {
				const reader = new FileReader();
				const [mime] = file.type.split('/');

				if (mime === 'image') {
					reader.addEventListener('load', () => {
						const url = reader.result as string;
						insertImage(editor, url);
					});

					reader.readAsDataURL(file);
				}
			}
		} else if (isImageUrl(text)) {
			insertImage(editor, text);
		} else {
			insertData(data);
		}
	};

	return editor;
};

// insert image node to slate editor
const insertImage = (editor: BaseEditor, url: string) => {
	const text = { text: '' };
	const image = { type: 'image', url, children: [text] };
	Transforms.insertNodes(editor, image);
};

// check if image url exists
const isImageUrl = (url: string) => {
	if (!url) return false;
	if (!isUrl(url)) {
		console.log('huh');
		return false;
	}
	const ext = new URL(url).pathname.split('.').pop();
	return imageExtensions.includes(ext);
};

// toolbar option to insert image url
export const InsertImageButton: React.FC<{ title: string }> = ({ title }) => {
	const editor = useSlateStatic();
	return (
		<Button
			title={title}
			onMouseDown={(event) => {
				event.preventDefault();
				const url = window.prompt('Enter the URL of the image:');
				if (url && !isImageUrl(url)) {
					alert('URL is not an image');
					return;
				}
				if (url) {
					insertImage(editor, url);
				}
			}}>
			<Icon>image</Icon>
		</Button>
	);
};
