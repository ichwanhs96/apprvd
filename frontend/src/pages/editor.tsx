import React, { useEffect, useState } from "react";
import AISidebar from "../components/aiSidebar";
import PlateEditor, {
  InitiatePlateEditor,
} from "../components/textEditor/plate-editor";
import axios from 'axios'

const EditorPage: React.FC = () => {
    const [edit, setEdit] = useState(null);
    const [loading, setLoading] = useState(true);
    const STORAGE_KEY = "editor-content";

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
                children: [{ text: edit }],
            },
        ];
    };

    useEffect(() => {
        axios.get("/api/api/random")
            .then((response) => {
                setEdit(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const editor = InitiatePlateEditor(loadInitialValue());

    return (
        <>
            <div className="w-3/4">
                {/* <SlateEditor /> */}
                <PlateEditor editor={editor} />
            </div>
            <div className="w-1/4">
                <AISidebar editor={editor} />
            </div>
        </>
    );
};

export default EditorPage;
