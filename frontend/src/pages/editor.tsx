import React, { useEffect, useState } from "react";
import AISidebar from "../components/aiSidebar";
import { InitiatePlateEditor } from "../components/textEditor/plate-editor";
import { useAuth } from "../context/AuthContext"; // Add this import
import { useContentPage, useContractSelected, useCurrentDocId, useEditorComments, useEditorContent, useSuggestions } from "../store";
import { useNavigate } from "react-router-dom";
import { TComment } from "@udecode/plate-comments";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs
import { toast } from "react-toastify";
import TinyEditor from "../components/TinyEditor";
import TemplateSidebar from "../components/templateSidebar";

interface TextSegment {
  text?: string;
  comment?: boolean;
  [key: `comment_${string}`]: boolean | string;
  children?: TextSegment[];
  [key: string]: any;
}

interface Block {
  children: TextSegment[];
  type: string;
  id: string;
  [key: string]: any;
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
    // const [loadingLorem, setLoadingLorem] = useState(true);
    const [editorData, setEditorData] = useState<EditorData | null>(null);
    const EDITOR_CONTENT_KEY = 'editor-content';
    const EDITOR_CONTENT_COMMENTS = "editor-comments";
    const { id } = useCurrentDocId();
    const { shared_with, business_id } = useContractSelected();
    const suggestions = useSuggestions();
    const { contentPage } = useContentPage()
    // const { editor_content } = useEditorContent()
    // const { editor_comments } = useEditorComments()
    const navigate = useNavigate();
    const toastError = () => {
      toast.error('Error: Something went wrong!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }

    // const fetchDocument = async (doc_id: string) => {
    //     try {
    //         if (!userInfo?.email) {
    //             alert("Please login!");
    //             return navigate('/');
    //         }

    //         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/document/${doc_id}`, {
    //             method: 'GET',
    //             headers: {
    //                 'business-id': userInfo?.email,
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error("Unexpected error");
    //         }

    //         return await response.json();
    //     } catch (error) {
    //       toastError()
    //         console.error("Failed to fetch document:", error);
    //     }
    // };

    // const loadInitialValue = async () => {
    //     try {
    //         const data = await fetchDocument(id);
    //         useEditorComments.setState({editor_comments: JSON.stringify(data.comments)})
    //         useEditorContent.setState({editor_content: JSON.stringify(data.contents)})
    //         localStorage.setItem(EDITOR_CONTENT_KEY, JSON.stringify(data.contents)); // Store the response in local storage
    //         localStorage.setItem(EDITOR_CONTENT_COMMENTS, JSON.stringify(data.comments)); // Store the response in local storage

    //         return data || { contents: [{
    //             id: "1",
    //             type: "p",
    //             children: [{ text: "Start typing here..." }],
    //         }], comments: [] };
    //     } catch (error) {
    //       toastError()
    //         const savedValue = localStorage.getItem(EDITOR_CONTENT_KEY);
    //         // const savedValue = editor_content
    //         if (savedValue) {
    //             return JSON.parse(savedValue);
    //         }

    //         // Default content if nothing is saved
    //         return { contents: [{
    //             id: "1",
    //             type: "p",
    //             children: [{ text: "Start typing here..." }],
    //         }], comments: [] };
    //     }
    // };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const initialValue = await loadInitialValue();
    //         setEditorData(initialValue);
    //         setLoadingLorem(false);
    //     };

    //     fetchData(); // Call fetchData on component mount
    // }, []);

    const deepCopy = (obj: any): any => {
      return JSON.parse(JSON.stringify(obj));
    };

    function recursiveSegmentCheck(
      child: any,
      idMap: any,
      suggestionsArray: Suggestion[],
      arrayB: CommentBlock[],
      depth: number
    ) {
      // console.log("Entering recursiveSegmentCheck with depth:", depth);

      const segments: TextSegment[] = [];
      let childItemCounter: number = 0;
      // console.log('Child before processing:', JSON.stringify(child, null, 2));
      // console.log('Initial segments:', JSON.stringify(segments, null, 2));
    
      if (child !== undefined && child.length > 0) {
        // console.log("Initialized segments:", segments);
    
        child.forEach((childElement: any) => {
          // console.log("Processing item:", childItemCounter, " with childElement:", JSON.stringify(childElement, null, 2));
    
          if (childElement.children) {
            const newChild = recursiveSegmentCheck(childElement.children, idMap, suggestionsArray, arrayB, depth + 1);
            // console.log("Segments before adding newChild at dept:", depth, " and item: ", childItemCounter, " segments:", JSON.stringify(segments, null, 2), " child:", JSON.stringify(newChild, null, 2), " segment item to be pushed:", JSON.stringify(segmentItem, null, 2));
            segments.push({ ...deepCopy(childElement), children: newChild }); // Use deep copy here
            // console.log("Segments after adding newChild at dept:", depth,  " and item: ", childItemCounter, " segments:", JSON.stringify(segments, null, 2));
            childItemCounter++
            return;
          }
    
          let text = childElement.text;
          let startIdx = 0;
    
          suggestionsArray.forEach((suggestion) => {
            let index = text.indexOf(suggestion.target_text, startIdx);
            if (index !== -1) {
              let id = idMap.get(suggestion.target_text) || uuidv4().replace(/-/g, "").slice(0, 20);
              idMap.set(suggestion.target_text, id);
    
              // Push text before match
              if (index > startIdx) {
                segments.push({ text: text.substring(startIdx, index), ...deepCopy(childElement) }); // Use deep copy here
                // console.log("Segments after adding text before match at depth:", depth, " segments: ", JSON.stringify(segments, null, 2));
              }
    
              // Push matched text with comment metadata
              segments.push({
                text: suggestion.target_text,
                comment: true,
                [`comment_${id}`]: true,
                ...deepCopy(childElement) // Use deep copy here
              });
              // console.log("Segments after adding matched text at depth:", depth, " segments: ", JSON.stringify(segments, null, 2));
    
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
            segments.push({ text: text.substring(startIdx), ...deepCopy(childElement) }); // Use deep copy here
            // console.log("Segments after adding remaining text at depth:", depth, " segments: ", JSON.stringify(segments, null, 2));
          }

          childItemCounter++
        });
    
        if (segments.length === 0) {
          segments.push({ text: "" });
        }
    
        // console.log("Final segments at depth", depth, ":", JSON.stringify(segments, null, 2));
        return segments;
      } else {
        // console.log("Returning empty segment for depth", depth);
        return [{ text: "" }];
      }
    }

    function processTextData(
        originalArray: Block[],
        suggestionsArray: Suggestion[]
      ): { arrayA: Block[]; arrayB: CommentBlock[] } {
        let arrayA: Block[] = deepCopy(originalArray)
        let arrayB: CommentBlock[] = [];
        let idMap = new Map<string, string>(); // Store target_text -> generated ID mapping
    
        arrayA.forEach((block) => {
          block.children = recursiveSegmentCheck(block.children, idMap, suggestionsArray, arrayB, 0)
          // block.children = block.children.flatMap((child) => {
          //   let segments: TextSegment[] = [];
          //   let text = child.text;
          //   let startIdx = 0;
    
          //   suggestionsArray.forEach((suggestion) => {
          //     let index = text.indexOf(suggestion.target_text, startIdx);
          //     if (index !== -1) {
          //       let id =
          //         idMap.get(suggestion.target_text) ||
          //         uuidv4().replace(/-/g, "").slice(0, 20);
          //       idMap.set(suggestion.target_text, id); // Store/retrieve the same ID for consistency
    
          //       // Push text before match
          //       if (index > startIdx) {
          //         segments.push({ text: text.substring(startIdx, index) });
          //       }
    
          //       // Push matched text with comment metadata
          //       segments.push({
          //         text: suggestion.target_text,
          //         comment: true,
          //         [`comment_${id}`]: true,
          //       });
    
          //       // Store suggestion in arrayB if not already added
          //       if (!arrayB.some((b) => b.id === id)) {
          //         arrayB.push({
          //           createdAt: Date.now(),
          //           id: id,
          //           userId: "1",
          //           value: [
          //             { children: [{ text: suggestion.suggestion }], type: "p" },
          //           ],
          //         });
          //       }
    
          //       startIdx = index + suggestion.target_text.length;
          //     }
          //   });
    
          //   // Push remaining text
          //   if (startIdx < text.length) {
          //     segments.push({ text: text.substring(startIdx) });
          //   }
    
          //   return segments;
          // });
        });
    
        return { arrayA, arrayB };
      }
    
      const updateEditorContentAndComment = (newContents: any, newComments: any) => {
        // set local storage content and comment with the new value
        useEditorContent.setState({editor_content: JSON.stringify(newContents)})
        localStorage.setItem(EDITOR_CONTENT_KEY, JSON.stringify(newContents));
        const existingComments = localStorage.getItem(EDITOR_CONTENT_COMMENTS);
        const parsingExisting = existingComments && JSON.parse(existingComments)
        if(existingComments !== JSON.stringify(newComments)){
          const updatedComments = existingComments && [...parsingExisting, ...newComments]
          useEditorComments.setState({editor_comments: JSON.stringify(updatedComments) })
          localStorage.setItem(EDITOR_CONTENT_COMMENTS, JSON.stringify(updatedComments));

          setEditorData((prevState: any) => ({
            ...prevState,
            contents: newContents,
            comments: updatedComments
          }));
        }
        // const existingComments = editor_comments
      };

      const updateContentOnBackend = async() => {
        const storedValue = localStorage.getItem('editor-content');
          if (storedValue) {
            try {
              await fetch(`${import.meta.env.VITE_BACKEND_URL}/document/${id}/content`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: storedValue, // Send the whole documents
              });
            } catch (error) {
              toastError()
              throw new Error('Error updating document');
            }
          }
      }
    
      const updateCommentsOnBackend = async () => {
        let comments = localStorage.getItem("editor-comments");
        const parsedComments: Record<string, TComment>[] = comments ? JSON.parse(comments) : [];
    
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/document/${id}/comment`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedComments), // Use parsedComments as payload
          });
        } catch (error) {
          toastError()
          console.error('Error updating comments:', error);
        }
      };
    
      const handleDynamicComment = async (suggestionsArray: Suggestion[]) => {
        if (editorData && editorData.contents) {
          let { arrayA, arrayB } = processTextData(
            editorData.contents,
            suggestionsArray
          );
    
          updateEditorContentAndComment(arrayA, arrayB);
          await Promise.all([updateContentOnBackend(), updateCommentsOnBackend()]);
          
          navigate("/dashboard");
        }
      };

    useEffect(() => {
      handleDynamicComment(Object.values(suggestions).map(value => value));
    }, [suggestions]);

    // Initialize the editor only after data is loaded
    // const editor = editorData ? InitiatePlateEditor(editorData, userInfo, id) : null;
    
    const dummyContents = [
        { type: 'paragraph', children: [{ text: 'This is a dummy content paragraph.' }] },
        { type: 'paragraph', children: [{ text: 'Here is another dummy paragraph for testing.' }] }
    ];
    
    const dummyComments = [
        { createdAt: Date.now(), id: uuidv4(), userId: 'user1', value: [{ text: 'This is a dummy comment.', type: 'comment' }] },
        { createdAt: Date.now(), id: uuidv4(), userId: 'user2', value: [{ text: 'Another dummy comment for testing.', type: 'comment' }] }
    ];

    const editor = editorData ? InitiatePlateEditor(editorData, userInfo, id) : InitiatePlateEditor({ contents: dummyContents, comments: dummyComments }, userInfo, id);

    // console.log("From zustand: ", editor_content, editor_comments)

    // TODO: move this to TinyMCE editor file
    // --------------------------------
    // const rawTemplate = useTemplateStore((s) => s.rawTemplate);
    // const variables = useTemplateStore((s) => s.variables);
    // const setVariables = useTemplateStore((s) => s.setVariables);
  
    // useEffect(() => {
    //   const matches = [...rawTemplate.matchAll(/\$\{(\w+)\}/g)];
    //   const vars: Record<string, string> = {};
    //   matches.forEach((match) => {
    //     vars[match[1]] = match[0]; // keep original like ${name}
    //   });
    //   setVariables(vars);
    // }, [rawTemplate]);

    // const applyVariables = () => {
    //   let content = rawTemplate;
    
    //   // Step 1: Remove any <span> tags wrapping ${...}
    //   content = content.replace(/<span style="background-color: #ffffe0;">\s*(\$\{.*?\})\s*<\/span>/g, '$1');
    
    //   // Step 2: Replace ${key} with actual values
    //   Object.entries(variables).forEach(([key, value]) => {
    //     const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
    //     content = content.replace(regex, value);
    //   });
    
    //   useContent.setState({ content });
    //   console.log('ini content', content)
    // };

    // -------------------------------- to be moved to TinyMCE editor file
  

    return (
        <>
        <div className="w-3/4">
            {/* <SlateEditor /> */}
            {/* <PlateEditor editor={editor}/> */}
            <TinyEditor />
        </div>
        {
          (business_id === userInfo?.email || (shared_with.length > 0 && shared_with.find((user) => user.email === userInfo?.email)?.access === 'edit')) && (
            <div className="w-1/4">
              {/* { loadingLorem && <div>Loading...</div> } */}
                {contentPage === 'contracts' && <AISidebar editor={editor} /> }
                <div className="mt-4">
                  <TemplateSidebar />
                </div>
                {/* <button onClick={handleComment} className="bg-blue-500 hidden">Comment</button> */}
            </div> 
          )
        }
        </>
    );
};

export default EditorPage;
