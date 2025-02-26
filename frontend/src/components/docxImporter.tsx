import { useState } from "react";
import { useContentToShow, useCurrentDocId, useEditorStore } from "../store"; // Import Zustand store
import * as mammoth from "mammoth";
import { useAuth } from "../context/AuthContext";
import { htmlToSlate } from "@slate-serializers/html";

const DocxImporter = ({ setAllContract }: any) => {
  const { userInfo } = useAuth();
  const { content } = useEditorStore();
  const setContent = useEditorStore((state) => state.setContent);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    fetchContracts();
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (event.dataTransfer.files.length) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  // const htmlToPlate = (html: string) => {
  //   return [
  //     {
  //       type: "p",
  //       children: [{ text: html }],
  //     },
  //   ];
  // };

  const handleUpload = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (file) => {
      const arrayBuffer = file?.target?.result as ArrayBuffer;
      // const json = JSON.stringify(arrayBuffer)

      // Convert DOCX to HTML
      const { value } = await mammoth.convertToHtml({ arrayBuffer });

      // Convert HTML to Plate.js format (Basic Example)
      const plateContent = htmlToSlate(value);

      // Store in Zustand
      await setContent(plateContent);
    };
    reader.readAsArrayBuffer(file);
    if(content.length === 0) {
      alert("Please upload a valid document");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "business-id": "ichwan@gmail.com",
        },
        body: JSON.stringify({
          name: file?.name,
          created_by: userInfo?.displayName,
          status: "DRAFT",
          version: "1",
          contents: content,
        }), // Send the form data as JSON
      });

      console.log("resp: ", response);


      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let result = await response.json();
      console.log("Success:", result);
      useCurrentDocId.setState({ id: result?.document?.id });
      useContentToShow.setState({ content: "editor" });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault(); // Prevent the default form submission

  //   };

  // const handleFileUpload = async () => {

  // };

  // const loadHTMLFile = async () => {
  //   try {
  //     const response = await fetch("/output.html");
  //     if (!response.ok) throw new Error("Failed to fetch output.html");

  //     const htmlContent = await response.text();
  //     const plateJson = htmlToPlate(htmlContent);

  //     localStorage.setItem("editor-content", JSON.stringify(plateJson));
  //   } catch (error) {
  //     console.error("Error loading HTML file:", error);
  //   }
  // };

  const fetchContracts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/document`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "business-id": "ichwan@gmail.com",
          },
        }
      ); // Adjust the URL as needed
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAllContract(
        data.map((contract: any) => ({
          id: contract.id,
          name: contract.name,
          language: contract.language || "EN",
          version: contract.version,
          created_at: contract.created_at,
          updated_at: contract.updated_at,
          status: contract.status,
        }))
      ); // Assuming the response contains a 'contracts' array
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  console.log(content[0]?.children[0]?.text);

  return (
    <>
      <div>
        {/* <input type="file" accept=".docx" onChange={handleFileUpload} /> */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-3xl"
          onClick={() => openModal()}
        >
          Upload existing
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">
              Upload Your Document Here
            </h2>

            {/* Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-4 border-dashed rounded-md p-6 mb-4 text-center cursor-pointer ${
                isDragging ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="flex flex-col items-center justify-center h-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-500 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-gray-500">
                  {file
                    ? file.name
                    : "Drag and drop a file here, or click to select a file"}
                </p>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Upload
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocxImporter;
