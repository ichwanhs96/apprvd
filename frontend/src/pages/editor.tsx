import React, { useEffect, useState } from "react";
import AISidebar from "../components/aiSidebar";
import PlateEditor, {
  InitiatePlateEditor,
} from "../components/textEditor/plate-editor";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Add this import
import { useCurrentDocId } from "../store";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs
import { useNavigate } from "react-router-dom";

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
  const [comments, setComments] = useState<CommentBlock[]>([]);
  const [edit, setEdit] = useState("");
  const [editorData, setEditorData] = useState<EditorData | null>(null);
  const EDITOR_CONTENT_KEY = "editor-content";
  const EDITOR_CONTENT_COMMENTS = "editor-comments";
  const { id } = useCurrentDocId();
  const router = useNavigate();

  // console.log(editorData)
  // console.log("comments: ",localStorage.getItem('editor-comments'))

  const fetchDocument = async (doc_id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/document/${doc_id}`,
        {
          method: "GET",
          headers: {
            "business-id": "ichwan@gmail.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unexpected error");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch document:", error);
    }
  };

  const loadInitialValue = async (): Promise<EditorData> => {
    try {
      const data = await fetchDocument(id);
      localStorage.setItem(EDITOR_CONTENT_KEY, JSON.stringify(data.contents)); // Store the response in local storage
      const saveComments = localStorage.getItem(EDITOR_CONTENT_COMMENTS);
      if (saveComments) {
        setComments(JSON.parse(saveComments));
      }
      return (
        data || {
          contents: [
            {
              id: "1",
              type: "p",
              children: [{ text: "Start typing here..." }],
            },
          ],
          comments: [],
        }
      );
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
        comments: [],
      };
    }
  };

  useEffect(() => {
    if (!editorData) {
      axios
        .get("/api/api/random")
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

  useEffect(() => {
    // if (editorData) {
    //     localStorage.setItem(EDITOR_CONTENT_KEY, JSON.stringify(editorData)); // Store the response in local storage
    // }
  }, []);

  // Initialize the editor only after data is loaded
  const editor = editorData
    ? InitiatePlateEditor(editorData, userInfo, id, comments)
    : null;

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

  // Example data
  const originalArray: Block[] = [
    { children: [{ text: "Start typing here…" }], type: "p", id: "sjhd1" },
  ];

  const suggestionsArray: Suggestion[] = [
    { target_text: "typing", suggestion: "this is a typing" },
    { target_text: "here", suggestion: "this is here" },
    { target_text: "...", suggestion: "this is ..." },
  ];

  const { arrayA, arrayB } = processTextData(originalArray, suggestionsArray);

  console.log("Array A:", JSON.stringify(arrayA, null, 2));
  console.log("Array B:", JSON.stringify(arrayB, null, 2));

  const updateEditorContent = (newContent: any) => {
    setEditorData((prevState: any) => ({
      ...prevState,
      contents: newContent,
    }));
    localStorage.setItem(EDITOR_CONTENT_KEY, JSON.stringify(newContent)); // Store the response in local storage
  };

  const handleComment = () => {
    // let { arrayA, arrayB } = processTextData(originalArray, suggestionsArray);
    // console.log('editor-content: ',JSON.stringify(arrayA, null, 2));
    // localStorage.setItem(EDITOR_CONTENT_KEY, JSON.stringify(arrayA)); // Store the response in local storage
    // console.log('editor-comments: ',JSON.stringify(arrayB, null, 2));
    // localStorage.setItem(EDITOR_CONTENT_COMMENTS, JSON.stringify(arrayB)); // Store the response in local storage
    // router('/dashboard')

    if (editorData && editorData.contents) {
      let { arrayA, arrayB } = processTextData(
        editorData.contents,
        suggestionsArray
      );

      updateEditorContent(arrayA);
      setComments(arrayB);
      localStorage.setItem(EDITOR_CONTENT_COMMENTS, JSON.stringify(arrayB)); // Store the response in local storage
      router("/dashboard");
    }
  };

  return (
    <>
      <div className="w-3/4">
        {/* <SlateEditor /> */}
        <PlateEditor editor={editor} />
      </div>
      <div className="w-1/4">
        {loadingLorem && <div>Loading...</div>}
        {!loadingLorem && <AISidebar editor={editor} />}
        <button onClick={handleComment} className="bg-blue-500">Comment</button>
      </div>
    </>
  );
};

export default EditorPage;
