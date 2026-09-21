'use client';

import { FileImage, Info } from 'lucide-react';

import { Button } from '@/components/ui/Button';

import {
  FileList,
  FileUploadZone,
} from './';

interface PdfToImageToolProps {
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemove: (file: File) => void;
  onConvert?: () => void;
  isProcessing?: boolean;
}

export function PdfToImageTool({
  files,
  onFilesSelected,
  onRemove,
  onConvert,
  isProcessing = false,
}: PdfToImageToolProps) {
  const pdfFiles = files.filter(
    (file) => file.type === 'application/pdf',
  );

  return (
    <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <FileImage className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h2 className="font-semibold">
            PDF to Image
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Convert PDF pages into image files.
          </p>
        </div>
      </div>

      <FileUploadZone
        accept="application/pdf,.pdf"
        multiple
        onFilesSelected={onFilesSelected}
      />

      {pdfFiles.length > 0 && (
        <>
          <FileList
            files={pdfFiles}
            onRemove={onRemove}
          />

          <Button
            type="button"
            onClick={onConvert}
            disabled={isProcessing}
          >
            {isProcessing
              ? 'Converting...'
              : 'Convert to Images'}
          </Button>
        </>
      )}

      <div className="flex gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />

        <p>
          The UI is ready for PDF processing. Actual PDF rendering
          should be connected to a browser-side PDF library or
          backend processing service.
        </p>
      </div>
    </div>
  );
}