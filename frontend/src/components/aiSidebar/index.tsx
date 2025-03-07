import React, { useState } from "react";
import Markdown from "markdown-to-jsx";
import { TPlateEditor } from "@udecode/plate-common/react";
import ExportToDoxc from "../exportButton";
import { useSuggestions } from "../../store";

interface AISidebarProps {
  editor: TPlateEditor;
}

const AISidebar: React.FC<AISidebarProps> = ({ editor }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [docSummary, setDocSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingReview, setIsLoadingReview] = useState(false)
  // const [suggestionSummary, setSuggestionSummary] = useState<string>("");
  // const [isOpen, setIsOpen] = useState(false);
  // const [contentModal, setContentModal] = useState("");
  const [reviewInput, setReviewInput] = useState<string>(
    "My company does highly confidential data & innovation, this NDA has to be very strong and also compliant with EU law."
  ); // Added state for textarea

  const handleGenerateSummary = async () => {
    setIsLoading(true)
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
            prompt: `with this document written in markdown format "${markdownContent}", please summarize the document.`,
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
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching document summary:", error);
      setIsLoading(false)
    }
  };

  const handleReviewRequest = async () => {
    setIsLoadingReview(true)
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
               "target_text": referring to text in the document,
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
            const validSuggestions = suggestions.map(s => ({
                target_text: s.target_text || '',
                suggestion: s.suggestion || ''
            }));
            useSuggestions.setState(validSuggestions);
        } else {
            console.error("Parsed suggestions is not an array:", suggestions);
        }
      } catch (error) {
        console.error("error parsing response ", error);
      } finally {
        const suggestionSummary = document.getElementById("SuggestionSummary");
        if (suggestionSummary) suggestionSummary.classList.remove("hidden");
  
        setIsTyping(true); 
      }
      setIsLoadingReview(false)
    } catch (error) {
      console.error("Error fetching review request:", error);
      setIsLoadingReview(false)
    }
  };

  return (
    <div className="text-sm pt-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="mb-4">
          <ExportToDoxc />
        </div>
        <div className="mb-4">
          <h2 className="font-semibold text-xl">Smart Review</h2>
        </div>
        <div className="mb-6">
          <button
            disabled={isLoading}
            className="w-full bg-gray-200 py-2 px-4 rounded-lg text-gray-800 font-medium hover:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleGenerateSummary}
          >
            {isLoading ? (
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-white animate-spin dark:text-gray-600 fill-gray-400 dark:fill-gray-300"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  "Generate Document Summary"
                )}
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

          <div className="flex justify-end">
            {/* <div className="text-blue-500 underline hover:cursor-pointer" onClick={() => {
                setIsOpen(true);
                setContentModal("docSummary");
              }}>
              Read more
            </div> */}
          </div>
        </div>
        <div id="KeyItems" className="mb-6 hidden">
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
            {/* <div className="text-blue-500 underline hover:cursor-pointer" onClick={() => {
                setIsOpen(true);
                setContentModal("keyitems");
              }}>
              Read more
            </div> */}
          </div>
        </div>
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
            {isLoadingReview ? (
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-white animate-spin dark:text-gray-600 fill-gray-400 dark:fill-gray-300"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  "Ask for Review"
                )}
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
