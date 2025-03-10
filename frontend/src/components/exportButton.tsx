import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  TableCell,
  TableRow,
  Table,
  ShadingType,
  UnderlineType, /*ImageRun*/
  LevelFormat,
} from "docx"; // Import docx library
import { saveAs } from "file-saver";
import { useContractSelected } from "../store";

export default function ExportToDoxc() {
  const STORAGE_KEY = "editor-content";
  const { name, version } =useContractSelected();
  // const { editor_content } = useEditorContent();

  const exportToDocx = () => {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    // const savedValue = editor_content
    const rgbToHex = (rgb: string) => {
      const match = rgb.match(/\d+/g);
      if (!match) return "#000000"; // Default to black if invalid
      return `#${match
        .map((x) => parseInt(x).toString(16).padStart(2, "0"))
        .join("")}`;
    };

    if (savedValue) {
      const content = JSON.parse(savedValue);
      console.log(content);

      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "orderedList",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.DECIMAL,
                  text: "%1.",
                  alignment: "left",
                },
              ],
            },
            {
              reference: "unorderedList",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.BULLET,
                  text: "\u1F60",
                  alignment: "left",
                },
              ],
            },
          ],
        },
        sections: [
          {
            properties: {},
            children: content.map((item: any) => {
              if (item.type === "p") {
                // Handle paragraph
                const paragraphChildren = item.children.map((child: any) => {
                  return new TextRun({
                    text: child.text,
                    bold: child.bold,
                    italics: child.italic,
                    underline: child.underline,
                    strike: child.strikethrough,
                    color: child.color?.startsWith("rgb")
                      ? rgbToHex(child.color)
                      : child.color,
                    shading: {
                      type: ShadingType.CLEAR,
                      color: child.backgroundColor?.startsWith("rgb")
                        ? rgbToHex(child.backgroundColor)
                        : child.backgroundColor,
                      fill: child.backgroundColor?.startsWith("rgb")
                        ? rgbToHex(child.backgroundColor)
                        : child.backgroundColor,
                    },
                    break: (child.text?.match(/\n/g) || []).length,
                  });
                });

                return new Paragraph({
                  children: paragraphChildren,
                  alignment: item.align ? item.align : "left",
                });
              }else if(item.type === 'h1'){
                return new Paragraph({
                  text: item.children[0]?.text,
                  heading: "Heading1",
                  alignment: item.align ? item.align : "left",
                });
              }else if(item.type === 'h2'){
                return new Paragraph({
                  text: item.children[0]?.text,
                  heading: "Heading2",
                  alignment: item.align ? item.align : "left",
                });
              }else if(item.type === 'h3'){
                return new Paragraph({
                  text: item.children[0]?.text,
                  heading: "Heading3",
                  alignment: item.align ? item.align : "left",
                });
              }else if(item.type === 'h4'){
                return new Paragraph({
                  text: item.children[0]?.text,
                  heading: "Heading4",
                  alignment: item.align ? item.align : "left",
                });
              }else if(item.type === 'h5'){
                return new Paragraph({
                  text: item.children[0]?.text,
                  heading: "Heading5",
                  alignment: item.align ? item.align : "left",
                });
              } else if (item.type === "ol") {
                const listOl = item.children.map((child: any) => {
                  return new TextRun({
                    text: child[0]?.text,
                  });
                });
                // Handle ordered list
                   return new Paragraph({
                    children: listOl,
                    numbering: {
                      reference: "orderedList",
                      level: 0,
                    },
                });
              } else if (item.type === "ul") {
                // Handle unordered list
                item.children.map((child: any) => {
                   return new Paragraph({
                    text: child[0]?.text,
                    // numbering: {
                    //   reference: "unorderedList",
                    //   level: 0,
                    // },
                    bullet: {
                      level: 0,
                    }
                  });
                });
              } else if (item.type === "table") {
                // Handle table
                const rows = item.children.map((row: any) => {
                  const cells = row.children.map((cell: any) => {
                    const cellParagraphs = cell.children.map(
                      (cellChild: any) => {
                        return new Paragraph({
                          children: cellChild.children.map((textChild: any) => {
                            return new TextRun({ text: textChild.text });
                          }),
                        });
                      }
                    );
                    return new TableCell({
                      children: cellParagraphs,
                    });
                  });
                  return new TableRow({
                    children: cells,
                  });
                });
                return new Table({
                  rows: rows,
                });
              } else if (item.type === "p" && item.listStyleType) {
                // Handle list
                const isDecimal = item.listStyleType === "decimal";
                new Paragraph({
                  // Wrapper for the list
                  text: item.children[0]?.text,
                  numbering: isDecimal
                    ? {
                        reference: isDecimal ? "orderedList" : "unorderedList",
                        level: 0, // Adjust level for zero-based index
                      }
                    : undefined, // No numbering for bullet style
                });
              } else if (item.comment === true) {
                const paragraphChildren = new TextRun({
                  text: item.text,
                  underline: item?.comment
                    ? { type: UnderlineType.SINGLE }
                    : undefined,
                  color: item.color,
                  shading: {
                    type: ShadingType.CLEAR,
                    color: "#cfd1d4",
                    fill: "#cfd1d4",
                  },
                });

                return paragraphChildren;
              }
              // else if (item.type === 'img') {
              //     // Handle image
              //     return new Paragraph({
              //         children: [
              //             new ImageRun({
              //                 data: fetch(item.url).then(res => res.blob()), // Fetch the image blob
              //                 transformation: {
              //                     width: 100, // Set width as needed
              //                     height: 100, // Set height as needed
              //                 },
              //             }),
              //         ],
              //     });
              // }
              // Add more types as needed
            }),
          },
        ],
      });

      console.log("generate docs");
      console.log(doc);

      Packer.toBlob(doc).then((blob) => {
        // TODO: change this to follow document name
        saveAs(blob, `${name}-${version}.docx`);
      });
    } else {
      console.error("No content found in localStorage.");
    }
  };

  return (
    <button
      className="bg-transparent text-black rounded-lg border border-neutral-400"
      onClick={exportToDocx}
    >
      Export to DOCX
    </button>
  );
}
