import { useSlate } from 'slate-react';
import { toggleBlock } from './BlockButton';
import { Editor, Element as SlateElement } from "slate";

export const Dropdown: React.FC = () => { // Added type annotation for functional component
    const editor = useSlate();
    let types: string[] = editor.getElementTypes(); // Added type annotation for types
    return (
        <select style={{ width: 170, height: 33 }}
            value={activeBlockType(editor, types)}
            onChange={(e) => changeFormat(editor, e)}
        >
            {types.map((item, index) => (
                <option key={index} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

const activeBlockType = (editor: any, types: string[]): string => { // Added type annotations
    const { selection } = editor;
    if (!selection) return '';
    const [match] =
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) && types.includes(n.type),
        }
    );
    if (match) return match[0].type;
    return '';
};

const changeFormat = (editor: any, event: React.ChangeEvent<HTMLSelectElement>): void => { // Added type annotations
    event.preventDefault();
    const value = event.target.value;
    toggleBlock(editor, value);
};