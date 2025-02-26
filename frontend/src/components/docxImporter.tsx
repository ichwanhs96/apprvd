import React from "react";
import { useEditorStore } from "../store"; // Import Zustand store

const DocxImporter: React.FC = () => {
  const { content } = useEditorStore()
  // const setContent = useEditorStore((state) => state.setContent);

  // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const arrayBuffer = e.target?.result as ArrayBuffer;
  //     const json = JSON.stringify(arrayBuffer)

  //     // Convert DOCX to HTML

  //     // Convert HTML to Plate.js format (Basic Example)
  //     const plateContent = htmlToPlate(json);

  //     // Store in Zustand
  //     setContent(plateContent);
  //   };
  //   reader.readAsText(file);
  // };

  
    const loadHTMLFile = async () => {
      try {
        const response = await fetch("/output.html");
        if (!response.ok) throw new Error("Failed to fetch output.html");
  
        const htmlContent = await response.text();
        const plateJson = htmlToPlate(htmlContent);
  
        localStorage.setItem("editor-content", JSON.stringify(plateJson));
      } catch (error) {
        console.error("Error loading HTML file:", error);
      }
    };

  console.log(content[0]?.children[0]?.text)

  return (
    <div>
      {/* <input type="file" accept=".docx" onChange={handleFileUpload} /> */}
      <button onClick={loadHTMLFile}>Load</button>
    </div>
  );
};

// 🔹 Convert HTML to Plate.js Format (Basic Example)
const htmlToPlate = (html: string) => {
  return [
    {
      type: "p",
      children: [{ text: html }],
    },
  ];
};

export default DocxImporter;
