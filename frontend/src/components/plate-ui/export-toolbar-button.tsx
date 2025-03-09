'use client';


import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';


import { useEditorRef } from '@udecode/plate/react';
import { ArrowDownToLineIcon } from 'lucide-react';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { ToolbarButton } from './toolbar';


export function ExportToolbarButton({ children, ...props }: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  const getCanvas = async () => {
    const { default: html2canvas } = await import('html2canvas');

    const style = document.createElement('style');
    document.head.append(style);
    style.sheet?.insertRule(
      'body > div:last-child img { display: inline-block !important; }'
    );

    const canvas = await html2canvas(editor.api.toDOMNode(editor)!);
    style.remove();

    return canvas;
  };

  const downloadFile = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);
  };

  const exportToPdf = async () => {
    const canvas = await getCanvas();

    const PDFLib = await import('pdf-lib');
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([canvas.width, canvas.height]);
    const imageEmbed = await pdfDoc.embedPng(canvas.toDataURL('PNG'));
    const { height, width } = imageEmbed.scale(1);
    page.drawImage(imageEmbed, {
      height,
      width,
      x: 0,
      y: 0,
    });
    const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: true });

    await downloadFile(pdfBase64, 'plate.pdf');
  };

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Export" isDropdown>
          <ArrowDownToLineIcon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={exportToPdf}>
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
