'use client';

import {
  Archive,
  Info,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

import {
  FileList,
  FileUploadZone,
} from './';

interface FileCompressionToolProps {
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemove: (file: File) => void;
  onCompress?: () => void;
  isProcessing?: boolean;
}

export function FileCompressionTool({
  files,
  onFilesSelected,
  onRemove,
  onCompress,
  isProcessing = false,
}: FileCompressionToolProps) {
  return (
    <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Archive className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h2 className="font-semibold">
            Compress Files
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Prepare files for smaller storage and easier sharing.
          </p>
        </div>
      </div>

      <FileUploadZone
        multiple
        onFilesSelected={onFilesSelected}
      />

      {files.length > 0 && (
        <>
          <FileList
            files={files}
            onRemove={onRemove}
          />

          <Button
            type="button"
            onClick={onCompress}
            disabled={isProcessing}
          >
            {isProcessing
              ? 'Compressing...'
              : 'Compress Files'}
          </Button>
        </>
      )}

      <div className="flex gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />

        <p>
          Compression strategy depends on the file type. Images,
          PDFs, and archives should use different processing
          pipelines.
        </p>
      </div>
    </div>
  );
}