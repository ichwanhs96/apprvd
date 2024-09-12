import { RenderElementProps } from "slate-react";

import { BaseElement } from "slate";

type TextAlign = "left" | "right" | "center" | "justify";

interface CustomElement extends BaseElement {
  type: string;
  align?: TextAlign;
  highlight?: string;
}

function isCustomElement(element: BaseElement): element is CustomElement {
  return "type" in element;
}

export const Element = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  if (!isCustomElement(element)) {
    return <div {...attributes}>{children}</div>;
  }

  const style = {
    textAlign: element.align || "left",
    backgroundColor: element.highlight || "transparent",
  };

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          style={{
            ...style,
            borderLeft: "4px solid #ccc",
            paddingLeft: "10px",
            color: "#666",
            fontStyle: "italic",
          }}
          {...attributes}
        >
          {children}
        </blockquote>
      );

    case "bulleted-list":
      return (
        <ul
          style={{
            ...style,
            listStyleType: "disc", // Adds bullet points
            paddingLeft: "20px",
            margin: "0",
          }}
          {...attributes}
        >
          {children}
        </ul>
      );

    case "numbered-list":
      return (
        <ol
          style={{
            ...style,
            listStyleType: "decimal",
            paddingLeft: "20px",
            margin: "0",
          }}
          {...attributes}
        >
          {children}
        </ol>
      );

    case "heading-one":
      return (
        <h1
          style={{ ...style, fontSize: "2em", fontWeight: "bold" }}
          {...attributes}
        >
          {children}
        </h1>
      );

    case "heading-two":
      return (
        <h2
          style={{ ...style, fontSize: "1.5em", fontWeight: "bold" }}
          {...attributes}
        >
          {children}
        </h2>
      );

    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );

    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};
