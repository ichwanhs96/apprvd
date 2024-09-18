import { BaseEditor, Text } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

// Extend Text to include custom formatting options
interface CustomText extends Text {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  highlight?: string; // Optional highlight color
}

// Extend Element to include block types and alignments
interface ParagraphElement {
  type: "paragraph";
  align?: "left" | "center" | "right" | "justify";
  children: CustomText[]; // Children are an array of text nodes
}

interface BlockQuoteElement {
  type: "block-quote";
  children: CustomText[]; // Children are an array of text nodes
}

// Define a union of possible custom element types
type CustomElement = ParagraphElement | BlockQuoteElement;

// Define the type of Editor that includes history and react editor
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

// Define the Descendant type as CustomElement or CustomText
export type CustomDescendant = CustomElement | CustomText;
