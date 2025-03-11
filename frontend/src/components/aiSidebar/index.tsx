import React, { useState } from "react";
import Markdown from "markdown-to-jsx";
import { TPlateEditor } from "@udecode/plate-common/react";
// import ExportToDoxc from "../exportButton";
import { useSuggestions } from "../../store";
import Loader from "../Loader";
import { MinusCircleIcon } from "lucide-react";
import { toast } from "react-toastify";

interface AISidebarProps {
  editor: TPlateEditor;
}

const AISidebar: React.FC<AISidebarProps> = ({ editor }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [docSummary, setDocSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  // const [suggestionSummary, setSuggestionSummary] = useState<string>("");
  // const [isOpen, setIsOpen] = useState(false);
  // const [contentModal, setContentModal] = useState("");
  const [reviewInput, setReviewInput] = useState<string>(
    "My company does highly confidential data & innovation, this NDA has to be very strong and also compliant with EU law."
  ); // Added state for textarea

  const comment = localStorage.getItem("editor-comments");
  const commentData = JSON.parse(comment ? comment : "");
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

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      const markdownContent = (editor.api as any).markdown.serialize();

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/prompt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `
            Use this document written in Markdown format as a context:
            
            \`\`\`markdown
            "${markdownContent}".
            \`\`\`
            
            With markdown document attached as context, the user asked you to generate summary of the documents`,
          }),
        }
      );
      const data = await response.json();
      setDocSummary(data.response); // Assuming the response has a 'summary' field

      const contentSummary = document.getElementById("ContentSummary");
      if (contentSummary) contentSummary.classList.remove("hidden");

      const keyItems = document.getElementById("KeyItems");
      if (keyItems) keyItems.classList.remove("hidden");

      setIsTyping(true);
      setIsLoading(false);
    } catch (error) {
      toastError()
      console.error("Error fetching document summary:", error);
      setIsLoading(false);
    }
  };

  const handleReviewRequest = async () => {
    setIsLoadingReview(true);
    try {
      const markdownContent = (editor.api as any).markdown.serialize();

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/prompt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `
            Use this document written in Markdown format as a context:
            
            \`\`\`markdown
            "${markdownContent}".
            \`\`\`
            
            With markdown document attached as context, generate contextual response based on this user question: "${reviewInput}".
            
            Your response must be in form of suggestions to the document.
            
            Response only with valid JSON format as follows:
            [{
               "target_text": referring to text in the document and remove the Markdown format such as bold (**) and italic (*),
               "suggestion": your own suggestion to improve the document
            }]
            `,
          }),
        }
      );
      const data = await response.json();

      try {
        let extractedText = data.response.split("```json")[1];
        extractedText = extractedText.split("```")[0];
        let suggestions: any[] = JSON.parse(extractedText);

        // Ensure suggestions is an array of Suggestion objects before setting the state
        if (Array.isArray(suggestions)) {
          const validSuggestions = suggestions.map((s) => ({
            target_text: s.target_text || "",
            suggestion: s.suggestion || "",
          }));
          useSuggestions.setState(validSuggestions);
        } else {
          console.error("Parsed suggestions is not an array:", suggestions);
        }
      } catch (error) {
        toastError()
        console.error("error parsing response ", error);
      } finally {
        const suggestionSummary = document.getElementById("SuggestionSummary");
        if (suggestionSummary) suggestionSummary.classList.remove("hidden");

        setIsTyping(true);
      }
      setIsLoadingReview(false);
    } catch (error) {
      toastError()
      console.error("Error fetching review request:", error);
      setIsLoadingReview(false);
    }
  };

  return (
    <div className="text-sm pt-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        {/* <div className="mb-4">
          <ExportToDoxc />
        </div> */}
        <div className="mb-4">
          <h2 className="font-semibold text-xl">Smart Review</h2>
        </div>
        <div className="mb-6">
          <button
            disabled={isLoading}
            className="w-full bg-gray-200 py-2 px-4 rounded-lg text-gray-800 font-medium hover:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleGenerateSummary}
          >
            {isLoading ? <Loader /> : "Generate Document Summary"}
          </button>
        </div>
        <div id="ContentSummary" className="mb-6 flex-column hidden">
          <h3 className="font-medium text-lg">Content summary</h3>
          <div className="border rounded-lg">
            <p
              className={`mt-2 overflow-hidden text-gray-700 p-4 ${
                isTyping ? "animate-typing" : ""
              }`}
            >
              <Markdown>{docSummary}</Markdown>
            </p>
          </div>

          {/* <div className="flex justify-end">
            <div className="text-blue-500 underline hover:cursor-pointer" onClick={() => {
                setIsOpen(true);
                setContentModal("docSummary");
              }}>
              Read more
            </div>
          </div> */}
        </div>
        {/* <div id="KeyItems" className="mb-6 hidden">
          <h3 className="font-medium text-lg">Key items</h3>
          <div className="border rounded-lg">
            <ul
              className={`list-disc mt-2 text-gray-700 p-4 ${
                isTyping ? "animate-typing" : ""
              }`}
            >
              <li className="ml-2">
                Definition of Confidential Information: Clear description of
                what is considered confidential.
              </li>
              <li className="ml-2">
                Exclusions from Confidential Information: Information not
                covered
              </li>
            </ul>
          </div>
          <div className="flex justify-end">
            <div className="text-blue-500 underline hover:cursor-pointer" onClick={() => {
                setIsOpen(true);
                setContentModal("keyitems");
              }}>
              Read more
            </div>
          </div>
        </div> */}
        <div className="mb-6">
          <h3 className="font-medium text-lg">Review request</h3>
          <textarea
            id="reviewInput"
            className="w-full mt-2 p-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 resize-none bg-white"
            rows={4}
            value={reviewInput} // Bind the value to state
            onChange={(e) => setReviewInput(e.target.value)} // Update state on change
          />
        </div>
        <div className="mb-6">
          <button
            className="w-full bg-gray-200 py-2 px-4 rounded-lg text-gray-800 font-medium hover:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isLoadingReview}
            onClick={handleReviewRequest}
          >
            {isLoadingReview ? <Loader /> : "Ask for Review"}
          </button>
        </div>
        {/* <div id="SuggestionSummary" className="mb-6 hidden">
          <h3 className="font-medium text-lg">Suggestions</h3>
          <div className="border rounded-lg">
            <p
              className={`mt-2 overflow-hidden text-gray-700 p-4 ${
                isTyping ? "animate-typing" : ""
              }`}
            >
              <Markdown>{suggestionSummary}</Markdown>
            </p>
          </div>
          <div className="text-blue-500 underline hover:cursor-pointer" onClick={() => {
                setIsOpen(true);
                setContentModal("suggestionSummary");
              }}>
            Read more
          </div>
        </div> */}
        {/* <div className='text-center'>
                    <button
                        className='bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring focus:bg-blue-500'>
                        Accept suggestions
                    </button>
                </div> */}
      </div>
      {!commentOpen && (
        <div className="w-full flex items-center justify-center">
          <button
            className="bg-white border rounded-lg border-neutral-400 m-4 text-black"
            onClick={() => setCommentOpen(true)}
          >
            See All Comments
          </button>
        </div>
      )}
      {commentOpen && commentData.length > 0 ? (
        <div className="p-4 rounded-lg flex flex-col gap-y-4">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="text-xl font-bold">Comments</div>
            <MinusCircleIcon onClick={() => setCommentOpen(false)} />
          </div>
          <div className="flex flex-col gap-y-4">
            {commentData?.map((coment: any) => {
              const createdAt = new Date(coment.createdAt); // Assuming createdAt is in ISO format
              const timeDiff = Math.floor(
                (new Date().getTime() - createdAt.getTime()) / 1000
              ); // Time difference in seconds

              let timeAgo = "";
              if (timeDiff < 60) {
                timeAgo = `${timeDiff} seconds ago`;
              } else if (timeDiff < 3600) {
                timeAgo = `${Math.floor(timeDiff / 60)} minutes ago`;
              } else if (timeDiff < 86400) {
                timeAgo = `${Math.floor(timeDiff / 3600)} hours ago`;
              } else {
                timeAgo = `${Math.floor(timeDiff / 86400)} days ago`;
              }
              return (
                <a
                  href={`#${coment?.id}`}
                  key={coment?.id}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    const element = document.getElementById(
                      `${coment?.id}`
                    );
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                >
                  <div className="border rounded-lg p-4 flex w-full items-start justify-center flex-col gap-y-2">
                    <div>Comment: {coment?.value[0]?.children[0]?.text}</div>
                    <div className="text-xs text-neutral-400">{timeAgo}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      ) : commentOpen && commentData <= 0 &&  <div className="w-full flex text-center p-8 items-center justify-between">No comments found <MinusCircleIcon onClick={() => setCommentOpen(false)} /></div>}
      {/* {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-70 absolute inset-0 w-screen h-screen z-40"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl z-50">
            <div
              className="flex items-center justify-end w-full pb-4 text-2xl hover:cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              x
            </div>
            {contentModal === "suggestionSummary" && suggestionSummary && (
              <Markdown>{suggestionSummary}</Markdown>
            )}
            {contentModal === "keyitems" && (
              <ul
                className={`list-disc mt-2 text-gray-700 p-4 ${
                  isTyping ? "animate-typing" : ""
                }`}
              >
                <li className="ml-2">
                  Definition of Confidential Information: Clear description of
                  what is considered confidential.
                </li>
                <li className="ml-2">
                  Exclusions from Confidential Information: Information not
                  covered
                </li>
              </ul>
            )}
            {contentModal === "docSummary" && docSummary && (
              <Markdown>{docSummary}</Markdown>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AISidebar;
