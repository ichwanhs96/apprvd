import React from "react";
import AISidebar from "../components/aiSidebar";
import PlateEditor, { InitiatePlateEditor } from "../components/textEditor/plate-editor";

const EditorPage: React.FC = () => {
    const editor = InitiatePlateEditor();

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