'use client';

import {
  FileStack,
  Info,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

import {
  FileList,
  FileUploadZone,
} from './';

interface PdfMergeToolProps {
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemove: (file: File) => void;
  onMerge?: () => void;
  isProcessing?: boolean;
}

export function PdfMergeTool({
  files,
  onFilesSelected,
  onRemove,
  onMerge,
  isProcessing = false,
}: PdfMergeToolProps) {
  const pdfFiles = files.filter(
    (file) => file.type === 'application/pdf',
  );

  return (
    <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <FileStack className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h2 className="font-semibold">
            Merge PDFs
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Combine multiple PDF files into one document.
          </p>
        </div>
      </div>

      <FileUploadZone
        accept="application/pdf,.pdf"
        multiple
        maxFiles={20}
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
            onClick={onMerge}
            disabled={
              isProcessing || pdfFiles.length < 2
            }
          >
            {isProcessing
              ? 'Merging...'
              : `Merge ${pdfFiles.length} PDFs`}
          </Button>

          {pdfFiles.length < 2 && (
            <p className="text-xs text-muted-foreground">
              Select at least two PDF files to merge.
            </p>
          )}
        </>
      )}

      <div className="flex gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />

        <p>
          Files are kept in the order shown above. A PDF processing
          library will be required for the actual merge operation.
        </p>
      </div>
    </div>
  );
}