'use client';

import { FileText, Info } from 'lucide-react';

import { Button } from '@/components/ui/Button';

import {
  FileList,
  FileUploadZone,
} from './';

interface ImageToPdfToolProps {
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemove: (file: File) => void;
  onConvert?: () => void;
  isProcessing?: boolean;
}

export function ImageToPdfTool({
  files,
  onFilesSelected,
  onRemove,
  onConvert,
  isProcessing = false,
}: ImageToPdfToolProps) {
  const imageFiles = files.filter(
    (file) => file.type.startsWith('image/'),
  );

  return (
    <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h2 className="font-semibold">
            Image to PDF
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Combine images into a single PDF document.
          </p>
        </div>
      </div>

      <FileUploadZone
        accept="image/*"
        multiple
        onFilesSelected={onFilesSelected}
      />

      {imageFiles.length > 0 && (
        <>
          <FileList
            files={imageFiles}
            onRemove={onRemove}
          />

          <Button
            type="button"
            onClick={onConvert}
            disabled={isProcessing}
          >
            {isProcessing
              ? 'Creating PDF...'
              : 'Create PDF'}
          </Button>
        </>
      )}

      <div className="flex gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />

        <p>
          Image ordering is preserved from the selected file list.
          Connect a PDF generation library to perform the final
          conversion.
        </p>
      </div>
    </div>
  );
}