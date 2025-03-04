import React, { useEffect, useState } from "react";
import AISidebar from "../components/aiSidebar";
import PlateEditor, { InitiatePlateEditor } from "../components/textEditor/plate-editor";
import { useAuth } from "../context/AuthContext"; // Add this import
import { useCurrentDocId } from "../store";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid"; // To generate unique IDs

interface TextSegment {
  text: string;
  comment?: boolean;
  [key: `comment_${string}`]: boolean | string;
}

interface Block {
  children: TextSegment[];
  type: string;
  id: string;
}

interface Suggestion {
  target_text: string;
  suggestion: string;
}

interface CommentBlock {
  createdAt: number;
  id: string;
  userId: string;
  value: { children: { text: string }[]; type: string }[];
}

interface EditorData {
  contents: Block[];
  comments: CommentBlock[];
}

const EditorPage: React.FC = () => {
    const { userInfo } = useAuth();
    const [loadingLorem, setLoadingLorem] = useState(true);
    const [editorData, setEditorData] = useState<EditorData | null>(null);
    const EDITOR_CONTENT_KEY = 'editor-content';
    const EDITOR_CONTENT_COMMENTS = "editor-comments";
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
            const savedComments = localStorage.getItem(EDITOR_CONTENT_COMMENTS);
            if (data && data.comments && savedComments !== null) {
                data.comments = JSON.parse(savedComments);
            }

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
            return { contents: [{
                id: "1",
                type: "p",
                children: [{ text: "Start typing here..." }],
            }], comments: [] };
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

    function processTextData(
        originalArray: Block[],
        suggestionsArray: Suggestion[]
      ): { arrayA: Block[]; arrayB: CommentBlock[] } {
        let arrayA: Block[] = JSON.parse(JSON.stringify(originalArray)); // Deep copy
        let arrayB: CommentBlock[] = [];
        let idMap = new Map<string, string>(); // Store target_text -> generated ID mapping
    
        arrayA.forEach((block) => {
          block.children = block.children.flatMap((child) => {
            let segments: TextSegment[] = [];
            let text = child.text;
            let startIdx = 0;
    
            suggestionsArray.forEach((suggestion) => {
              let index = text.indexOf(suggestion.target_text, startIdx);
              if (index !== -1) {
                let id =
                  idMap.get(suggestion.target_text) ||
                  uuidv4().replace(/-/g, "").slice(0, 20);
                idMap.set(suggestion.target_text, id); // Store/retrieve the same ID for consistency
    
                // Push text before match
                if (index > startIdx) {
                  segments.push({ text: text.substring(startIdx, index) });
                }
    
                // Push matched text with comment metadata
                segments.push({
                  text: suggestion.target_text,
                  comment: true,
                  [`comment_${id}`]: true,
                });
    
                // Store suggestion in arrayB if not already added
                if (!arrayB.some((b) => b.id === id)) {
                  arrayB.push({
                    createdAt: Date.now(),
                    id: id,
                    userId: "1",
                    value: [
                      { children: [{ text: suggestion.suggestion }], type: "p" },
                    ],
                  });
                }
    
                startIdx = index + suggestion.target_text.length;
              }
            });
    
            // Push remaining text
            if (startIdx < text.length) {
              segments.push({ text: text.substring(startIdx) });
            }
    
            return segments;
          });
        });
    
        return { arrayA, arrayB };
      }
    
      const suggestionsArray: Suggestion[] = [
        { target_text: "typing", suggestion: "this is a typing" },
        { target_text: "here", suggestion: "this is here" },
        { target_text: "...", suggestion: "this is ..." },
      ];
    
      const updateEditorContentAndComment = (newContents: any, newComments: any) => {
        setEditorData((prevState: any) => ({
          ...prevState,
          contents: newContents,
          comments: newComments
        }));
        // set local storage content and comment with the new value
        localStorage.setItem(EDITOR_CONTENT_KEY, JSON.stringify(newContents));
        const existingComments = localStorage.getItem(EDITOR_CONTENT_COMMENTS);
        const updatedComments = existingComments ? [...JSON.parse(existingComments), ...newComments] : newComments;
        localStorage.setItem(EDITOR_CONTENT_COMMENTS, JSON.stringify(updatedComments));
      };
    
      const handleComment = () => {
        if (editorData && editorData.contents) {
          let { arrayA, arrayB } = processTextData(
            editorData.contents,
            suggestionsArray
          );
    
          updateEditorContentAndComment(arrayA, arrayB);
          
          navigate("/dashboard");
        }
      };

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
            <button onClick={handleComment} className="bg-blue-500 hidden">Comment</button>
        </div> 
        </>
    );
};

export default EditorPage;
