import React, { useEffect, useState } from "react";
import AISidebar from "../components/aiSidebar";
import PlateEditor, { InitiatePlateEditor } from "../components/textEditor/plate-editor";
import axios from 'axios'
import { useAuth } from "../context/AuthContext"; // Add this import
import { useCurrentDocId } from "../store";
import { useNavigate } from "react-router-dom";

const EditorPage: React.FC = () => {
    const { userInfo } = useAuth();
    const [loadingLorem, setLoadingLorem] = useState(true);
    const [edit, setEdit] = useState('');
    const [editorData, setEditorData] = useState(null);
    const EDITOR_CONTENT_KEY = 'editor-content';
    const { id } = useCurrentDocId();
    const navigate = useNavigate();

    const fetchDocument = async (doc_id: string) => {
        try {
            if (!userInfo?.email) {
                alert("Please login!");
                return navigate('/');
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/document/${doc_id}`, {
                method: 'GET',
                headers: {
                    'business-id': userInfo?.email,
                },
            });

            if (!response.ok) {
                throw new Error("Unexpected error");
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to fetch document:", error);
        }
    };

    const loadInitialValue = async () => {
        try {
            const data = await fetchDocument(id);
            localStorage.setItem(EDITOR_CONTENT_KEY, JSON.stringify(data.contents)); // Store the response in local storage
            return data || { contents: [{
                id: "1",
                type: "p",
                children: [{ text: "Start typing here..." }],
            }], comments: [] };
        } catch (error) {
            const savedValue = localStorage.getItem(EDITOR_CONTENT_KEY);
            if (savedValue) {
                return JSON.parse(savedValue);
            }

            // Default content if nothing is saved
            return {
                contents: [
                    {
                        id: "1",
                        type: "p",
                        children: [{ text: edit }],
                    },
                ],
                comments: []
            };
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const initialValue = await loadInitialValue();
            setEditorData(initialValue);
            setLoadingLorem(false);
        };

        fetchData(); // Call fetchData on component mount
    }, []);

    // Initialize the editor only after data is loaded
    const editor = editorData ? InitiatePlateEditor(editorData, userInfo, id) : null;

    return (
        <>
        <div className="w-3/4">
            {/* <SlateEditor /> */}
            <PlateEditor editor={editor}/>
        </div>
        <div className="w-1/4">
            { loadingLorem && <div>Loading...</div> }
            { !loadingLorem &&  <AISidebar editor={editor} /> }
        </div> 
        </>
    );
};

export default EditorPage;
