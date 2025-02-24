import React, { useEffect, useState } from "react";
import AISidebar from "../components/aiSidebar";
import PlateEditor, { InitiatePlateEditor } from "../components/textEditor/plate-editor";
import axios from 'axios'
import { useAuth } from "../context/AuthContext"; // Add this import
import { useCurrentDocId } from "../store";

const EditorPage: React.FC = () => {
    const { userInfo } = useAuth();
    const [loadingLorem, setLoadingLorem] = useState(true);
    const [edit, setEdit] = useState('');
    const [editorData, setEditorData] = useState(null);
    const STORAGE_KEY = 'editor-content';
    const { id } = useCurrentDocId()

    

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
            // TODO: value of document id should be dynamically determine from Contract page
            const data = await fetchDocument(id ?? '');
            return data || [{
                id: "1",
                type: "p",
                children: [{ text: "Start typing here..." }],
            }];
        } catch (error) {
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
        }
    };

    useEffect(() => {
        if(!editorData){
            axios.get("/api/api/random")
            .then((response) => {
                setEdit(response.data);
                setLoadingLorem(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoadingLorem(false);
            });
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const initialValue = await loadInitialValue();
            setEditorData(initialValue);
            setLoadingLorem(false);
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
            { loadingLorem && <div>Loading...</div> }
            { !loadingLorem &&  <AISidebar editor={editor} /> }
        </div> 
        </>
    );
};

export default EditorPage;
