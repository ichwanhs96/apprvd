import React from "react";
import AISidebar from "../components/aiSidebar";
import PlateEditor, { InitiatePlateEditor } from "../components/textEditor/plate-editor";

const EditorPage: React.FC = () => {
    const STORAGE_KEY = 'editor-content';
    const loadInitialValue = () => {
        const savedValue = localStorage.getItem(STORAGE_KEY);
        if (savedValue) {
            return JSON.parse(savedValue);
        }

        // Default content if nothing is saved
        return [
            {
                id: "1",
                type: "p",
                children: [{ text: "Start typing here..." }],
            },
        ];
    };

    const editor = InitiatePlateEditor(loadInitialValue());

    return (
        <>
        <div className="w-3/4">
            {/* <SlateEditor /> */}
            <PlateEditor editor={editor}/>
        </div>
        <div className="w-1/4">
            <AISidebar editor={editor} />
        </div>
        </>
    );
};

export default EditorPage;