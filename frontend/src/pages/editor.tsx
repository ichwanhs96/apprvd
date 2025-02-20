import React, { useEffect, useState } from "react";
import AISidebar from "../components/aiSidebar";
import PlateEditor, { InitiatePlateEditor } from "../components/textEditor/plate-editor";
import { useAuth } from "../context/AuthContext"; // Add this import

const EditorPage: React.FC = () => {    
    const [loading, setLoading] = useState(true);
    const [editorData, setEditorData] = useState(null);
    const STORAGE_KEY = 'editor-content';

    const { userInfo } = useAuth();

    const fetchDocument = async (document_id: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/document/${document_id}/content`, {
                method: 'GET',
                headers: {
                    'business-id': 'ichwan@gmail.com',
                },
            });

        if (!response.ok) {
            throw new Error("Unexpected error");
        }

        const data = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); // Store the response in local storage
        return data;
        } catch (error) {
        console.error("Failed to fetch document:", error);
        }
    };

    const loadInitialValue = async () => {
        try {
            const data = await fetchDocument('67b704336fa04969bfa02ed5');
            return data || [{
                id: "1",
                type: "p",
                children: [{ text: "Start typing here..." }],
            }];
        } catch (error) {
            return [{
                id: "1",
                type: "p",
                children: [{ text: "Start typing here..." }],
            }];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const initialValue = await loadInitialValue();
            setEditorData(initialValue);
            setLoading(false);
        };

        fetchData(); // Call fetchData on component mount
    }, []);

    // Initialize the editor only after data is loaded
    const editor = editorData ? InitiatePlateEditor(editorData, userInfo) : null;

    return (
        <>
        <div className="w-3/4">
            {/* <SlateEditor /> */}
            <PlateEditor editor={editor}/>
        </div>
        <div className="w-1/4">
            { loading && <div>Loading...</div> }
            { !loading &&  <AISidebar editor={editor} /> }
        </div> 
        </>
    );
};

export default EditorPage;