import {
  FileImage,
  FilePlus2,
  FileStack,
  FileText,
} from 'lucide-react';

import { FileToolCard } from './FileToolCard';

interface FileToolsGridProps {
  onPdfToImage?: () => void;
  onImageToPdf?: () => void;
  onMergePdf?: () => void;
  onCompress?: () => void;
}

export function FileToolsGrid({
  onPdfToImage,
  onImageToPdf,
  onMergePdf,
  onCompress,
}: FileToolsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FileToolCard
        title="PDF to Image"
        description="Convert PDF pages into image files for easy sharing and editing."
        icon={FileImage}
        onClick={onPdfToImage}
      />

      <FileToolCard
        title="Image to PDF"
        description="Combine one or more images into a downloadable PDF document."
        icon={FileText}
        onClick={onImageToPdf}
      />

      <FileToolCard
        title="Merge PDFs"
        description="Combine multiple PDF documents into a single file."
        icon={FileStack}
        onClick={onMergePdf}
      />

      <FileToolCard
        title="Compress Files"
        description="Reduce file size before uploading or sharing your study materials."
        icon={FilePlus2}
        onClick={onCompress}
      />
    </div>
  );
}