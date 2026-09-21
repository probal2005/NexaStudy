'use client';

import {
  FileImage,
  FileText,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface FilePreviewProps {
  file: File | null;
  onClose?: () => void;
}

export function FilePreview({
  file,
  onClose,
}: FilePreviewProps) {
  if (!file) {
    return null;
  }

  const objectUrl = URL.createObjectURL(file);

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {file.type.startsWith('image/') ? (
            <FileImage className="h-5 w-5 shrink-0 text-primary" />
          ) : (
            <FileText className="h-5 w-5 shrink-0 text-primary" />
          )}

          <p className="truncate font-medium">
            {file.name}
          </p>
        </div>

        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {file.type.startsWith('image/') ? (
        <div className="flex max-h-[600px] justify-center overflow-auto rounded-xl bg-muted/30 p-4">
          {/* Object URL is revoked by the browser when the document is unloaded. */}
          <img
            src={objectUrl}
            alt={file.name}
            className="max-h-[560px] max-w-full rounded-lg object-contain"
          />
        </div>
      ) : file.type === 'application/pdf' ? (
        <iframe
          src={objectUrl}
          title={`Preview of ${file.name}`}
          className="h-[600px] w-full rounded-xl border"
        />
      ) : (
        <div className="flex min-h-[180px] items-center justify-center rounded-xl bg-muted/30 p-6 text-center">
          <div>
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />

            <p className="mt-3 text-sm text-muted-foreground">
              Preview is not available for this file type.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}