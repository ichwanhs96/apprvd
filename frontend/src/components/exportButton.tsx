import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  TableCell,
  TableRow,
  Table,
  ShadingType,
  UnderlineType /*ImageRun*/,
} from "docx"; // Import docx library
import { saveAs } from "file-saver";

export default function ExportToDoxc() {
  const STORAGE_KEY = "editor-content";

  const exportToDocx = () => {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    const rgbToHex = (rgb: string) => {
      const match = rgb.match(/\d+/g);
      if (!match) return "#000000"; // Default to black if invalid
      return `#${match
        .map((x) => parseInt(x).toString(16).padStart(2, "0"))
        .join("")}`;
    };

    if (savedValue) {
      const content = JSON.parse(savedValue);

      const doc = new Document({
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
                        reference: isDecimal ? "orderList" : "unorderedList",
                        level: item.listStart - 1, // Adjust level for zero-based index
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

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "exported-content.docx");
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
